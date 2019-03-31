'use strict';


/* -- Подключение модулей  -- */


/* Подключение gulp таск-раннера */
const gulp = require('gulp');

/* Подключение SASS препроцессора */
const sass = require('gulp-sass');

/* Запирает все ошибки в себя, не останавливая работу скрипта */
const plumber = require('gulp-plumber');

/* POSTCSS c автопрефиксером */
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

/* Модуль отображающий сайт в браузере */
const server = require('browser-sync').create();
const reload = server.reload;

/* Минификация HTML */
const htmlmin = require('gulp-htmlmin');

/* Минификация CSS */
const minify = require('gulp-csso');

/* Конкатенация отдельных файлов в единый */
const concat = require('gulp-concat');

/* Минификация JS с поддержкой ES6*/
const uglify = require('gulp-uglifyes');

/* Отдельный плагин для переименования файла */
const rename = require('gulp-rename');

/* Оптимизация изображений */
const imagemin = require('gulp-imagemin');

/* Конвертация изображений в Webp для blink браузеров */
const webp = require('gulp-webp');

/* Сборка SVG-спрайтов */
const svgstore = require('gulp-svgstore');

/* Модуль для удаления файлов */
const del = require('del');

/* POSTHTML для минификации HTML с плагином для вставки
других файлов в HTML файл с помощью <include src='></include> */
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');

/* Babel транспилятор. Для преобразования кода es6 в es5 для старых браузеров */
const babel = require('gulp-babel');

/* -- Задачи  -- */


/* Минифицирует HTML */
gulp.task('html', function() {       /* название таска*/
  return gulp.src('./source/*.html') /* откуда берет файлы */
    .pipe(posthtml([
      include()                      /* конвертирует все <include></include> */
    ]))
    .pipe(htmlmin({                  /* Минификация HTML*/
      collapseWhitespace: true,
      ignoreCustomFragments: [ /<br>\s/gi ]  /*Не убираем пробел после <br> */
    }))
    .pipe(gulp.dest('./build'))      /* куда кидает файлы */
    .pipe(server.stream());          /* команда перезагрузки сервера в браузере */
});


/* Минифицирует стили */
gulp.task('style', function() {
  return gulp.src(['./source/sass/style.scss', './source/sass/blocks/**/*.scss'])
    .pipe(plumber())
    .pipe(concat('style.min.css'))
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(minify({
      restructure: false          /*Отключаем смешивание общих стилей, чтобы не страдать*/
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(server.stream());
});

/* Минифицирует скрипты */
gulp.task('scripts', function () {
  return gulp.src('source/js/**/*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify({
      mangle: false,
      ecma: 6
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/js'))
    .pipe(server.stream());
});

/* Минифицирует изображения*/
gulp.task('images', function() {
  return gulp.src('./source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([    /* imagemin сам по себе содержит в себе множество плагинов (работа с png,svg,jpg и тд) */
      imagemin.optipng({optimizationLevel: 3}),  /* 1 - максимальное сжатие, 3 - безопасное сжатие, 10 - без сжатия */
      imagemin.jpegtran({progressive: true}),    /* прогрессивная загрузка jpg (изображение постепенно прорисовывается при загрузке) */
      imagemin.svgo()   /*Минификация svg от лишних тегов*/
      ]))
    .pipe(gulp.dest('./build/img'));
});

/* Конвертация в webp*/
gulp.task('webp', function() {
  return gulp.src('./build/img/towebp/**/*.{png,jpg}')
    .pipe(webp({quality: 90})) /* Конвертируем png/jpg в webp с легкой потерей качества изображения */
    .pipe(gulp.dest('./build/img'));
});

/* Сборка спрайта SVG */
gulp.task('sprite', function() {
  return gulp.src('./build/img/inline-icons/*.svg')
    .pipe(svgstore({    /* Делает спрайт из SVG-файлов */
      inLineSvg: true
    }))
     .pipe(imagemin([
      imagemin.svgo()
      ]))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('./build/img'));
});

/* Таск для копирования шрифтов */
gulp.task('copy-fonts', function() {
  return gulp.src([
  './source/fonts/**/*.{woff,woff2}'
  ], {
    base: './source/'     /* Говорим что базовый путь начинается из корня */
  })
  .pipe(gulp.dest('build'));
});

/* Таск для копирования gif */
gulp.task('copy-gif', function() {
  return gulp.src([
  './source/img/**/*.gif'
  ], {
    base: './source/'     /* Говорим что базовый путь начинается из корня */
  })
  .pipe(gulp.dest('build'));
});

/* Таск для удаления прошлой сборки */
gulp.task('clean', function() {
  return del('build');
});

/* Удаление всех изображений*/
gulp.task('clean-images', function() {
  return del('./build/img/**/*.{png,jpg,svg,webp,gif}');
});

/* Удаление всех шрифтов */
gulp.task('clean-fonts', function() {
  return del('./build/fonts/**/*.{woff,woff2}');
});

/* Таск для отслеживания изображений */
gulp.task('images-watch', gulp.series('clean-images', 'copy-gif', 'images', 'webp', 'sprite', 'html' , function(done) {
  done();
}));

/* Таск для отслеживания шрифтов */
gulp.task('fonts-watch', gulp.series('clean-fonts', 'copy-fonts', 'html', function(done) {
  done();
}));

/* Таск компиляции всего проекта(npm run build) */
gulp.task('build', gulp.series('clean', 'copy-fonts', 'style', 'scripts', 'images', 'copy-gif', 'webp', 'sprite', 'html', function(done) {
  done();
}));

/* Перед тем как таск serve стартует должен быть запущен build.
gulp serve для запуска локального сервера */
gulp.task('serve', function() {
  server.init({           /* инициирует сервер */
    server: './build/',   /* говорим откуда смотреть сайт ( . - текущий каталог) */
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  /* Ватчеры следящие за изменениями файлов: */
  /* Например, препроцессорные ватчеры (следим за всеми Sass файлами во всех папках внутри папки sass),
   вторым аргументом передаем какой таск нужно запустить если один из файлов изменился */
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('style'));
  gulp.watch('source/*.html',  gulp.series('html'));
  gulp.watch('source/js/*.js',  gulp.series('scripts'));
  gulp.watch('source/img/**/*.{png,jpg,svg,webp,gif}',  gulp.series('images-watch'));
  gulp.watch('source/fonts/**/*.{woff,woff2}',  gulp.series('fonts-watch'));
});

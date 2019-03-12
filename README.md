# mandarin-mania #
Выполнил - **Паярели Александр**

## Описание проекта:
Игра мандарин-маниа<br/>


## Запуск сборки

1) Скачайте и установите [Node.js](https://nodejs.org/en/ "Ссылка на оф. сайт Node.js")
2) Скачайте и установите [Git Bash](https://git-scm.com/downloads "Ссылка на скачку Git Bash")
3) Создайте и зайдите в папку для проекта. Нажмите правой кнопкой мыши на пустую область папки и выберите Git Bash Here

![Тут должна была быть картинка-подсказка, но она не загрузилась =*(](https://a.radikal.ru/a27/1810/e3/039fb460e246.png)

4) Загрузите сборку локально себе на компьютер с помощью команды:<br/>
`git clone https://github.com/Magistr19/basic-site-assembler.git .`
5) Обновите версии вспомогательных пакетов, которые были использованные в проекте:<br/>
`npm up`
6) Установите все вспомогательные пакеты, которые были использованные в проекте:<br/>
`npm i`
7) Выполните сборку проекта <br/>
`npm run build`<br/>
В папке проекта появится папка build, которая содержит скомпилированный проект на выпуск в продакшн.<br/>

Для выполнения компиляции и запуска локального сервера с автообновлением браузера и build на изменения, используйте команду `npm start`.<br/>

___Внимание!___ Не редактируйте содержимое папки build. Все изменение вносите в папку разработки - source<br/>
Не удаляйте и не обращайте внимание на файлы:<br/>
_`.gitattributes`, `.gitignore`, `.gulpfile.js`, `package-lock.json`, `package.json`._
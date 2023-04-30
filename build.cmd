@echo off
if exist build\ rmdir /s /q build
mkdir build\js
call node build-pug
call sass --load-path=node_modules src/css/styles.scss build/css/styles.css
copy /Y src\js\* build\js>nul
copy /Y node_modules\bootstrap\dist\js\bootstrap.js build\js\bootstrap.js>nul
copy /Y node_modules\@popperjs\core\dist\umd\popper.js build\js\popper.js>nul
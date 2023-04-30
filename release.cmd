@echo off
call build
if exist release\ rmdir /s /q release
mkdir release
mkdir release\cloak-data-editor
xcopy build\* release\cloak-data-editor\
tar -cf release\cloak-data-editor.zip release\cloak-data-editor
copy src\scripts\update.cmd release\update.cmd
rmdir /s /q release\cloak-data-editor\
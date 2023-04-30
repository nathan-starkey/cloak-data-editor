@echo off
call build
if exist release\ rmdir /s /q release
mkdir release
mkdir release\cloak-data-editor
xcopy /S build\* release\cloak-data-editor\
pushd release
tar -a -cf cloak-data-editor.zip cloak-data-editor
popd
copy src\scripts\update.cmd release\update.cmd
rmdir /s /q release\cloak-data-editor\
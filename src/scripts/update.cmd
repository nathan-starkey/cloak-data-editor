@echo off
title Cloak Data Editor - Updater
if exist cloak-data-editor\ rmdir /s /q cloak-data-editor
curl -L -O http://github.com/nathan-starkey/cloak-data-editor/releases/latest/download/cloak-data-editor.zip
tar -xf cloak-data-editor.zip
del cloak-data-editor.zip
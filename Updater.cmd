@echo off
title Cloak Data Editor - Updater
setlocal enableextensions
set installDir=%1

if not %installDir%x==x (
  if not exist %installDir%\index.html (
    echo Input folder does not appear to be the Cloak Data Editor, aborting.
    echo Press any key to exit . . .
    pause>nul
    goto :eof
  )

  echo Updating . . .
  set successMessage=Update complete!
  goto update
)

choice /c 12 /n /m "[1] Download [2] Update >"

if errorlevel 2 (
  echo To update, drag the editor's folder onto the updater's .CMD file.
  echo Press any key to exit . . .
  pause>nul
  goto :eof
) else if errorlevel 1 (
  set installDir="Cloak Data Editor"
  echo Downloading . . .
  set successMessage=Download complete!
  goto update
) else (
  goto :eof
)

:update
if exist %installDir%\ rmdir /s /q %installDir%
curl -L -O http://github.com/nathan-starkey/cloak-data-editor/releases/latest/download/cloak-data-editor.zip
tar -xf cloak-data-editor.zip
del cloak-data-editor.zip
move cloak-data-editor %installDir%
echo %successMessage%
timeout /t 2 /nobreak>nul
@echo off
setlocal
pushd "%~dp0"
node scripts\dev-server.mjs %*
set "exit_code=%ERRORLEVEL%"
popd
exit /b %exit_code%

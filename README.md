# flutter-app

[![CircleCI](https://circleci.com/gh/lathonez/flutter-app.svg?style=shield)](https://circleci.com/gh/lathonez/flutter-app)

Mobile app for [FlutterBot](http://flutterbot.co.uk/)

## Prerequisites

* Node LTS (20+ recommended)
* Java JDK 17+
* Android SDK (set `ANDROID_HOME` and add SDK `platform-tools` and `cmdline-tools` to `PATH`)
* Ionic CLI and Cordova are installed from project dependencies and used via `npx`

## Install

`npm i`

## Start Dev Server

`npm start`

## Build APK

Committing to this repo will result in a CircleCI build.

If the build is successful a `flutter-app.apk` will be available in the "artifacts" section.

Local Android release build:

`npx ionic cordova build android --release -- --packageType=apk`

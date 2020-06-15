# TBT Revamp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7.

Apply PWA and SSR.

### Requirements

* Install [Node.js] LTS version (https://nodejs.org/en/)

* Install Angular CLI Lastest Version : Run `npm install -g @angular/cli`

* Install Node Modules : Run `npm install`

* Gist ID : `ba99f4a54cd3bcb87fc0938fc557dcea`

##### How to Init Project PWA & SSR


* New Project : `ng new [projectName] --skip-tests`

* Skip Test config (optional, disable generate test files if you not type --skip-tests): 
`ng config schematics.@schematics/angular.component.spec false`

* Open Folder: `cd [projectName]`

* Ref: [Angular server-side rendering with @ng-toolkit/universal](https://medium.com/@maciejtreder/angular-server-side-rendering-with-ng-toolkit-universal-c08479ca688)
* Add Server Render Tool - Angular Universal: `ng add @ng-toolkit/universal`

* Ref: [Angular PWA pitfalls](https://medium.com/@maciejtreder/angular-pwa-pitfalls-how-to-address-them-with-ng-toolkit-79c45ebcc315)
* Add PWA: `ng add @angular/pwa`
* Add toolkit combine SSR and PWA: `ng add @ng-toolkit/pwa`

##### How to add Nebular Theme 
* Install Bootstrap 4 : `npm i bootstrap`
* Install Nebular Theme v3.5 : `npm i @nebular/theme@^3.5.0`
* Install Nebular Bootstrap v3.5 : `npm i @nebular/bootstrap@^3.5.0`

### Build Development Server

* Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build Production Server

* Run `npm run build:prod` to build the project. The build artifacts will be stored in the `dist/` directory.
* Run `npm run server` to run server.

### Deploy to Firebase for test

##### How to Set-up Fisebase

Ref: [Deploying Angular Universal v6+ with Firebase](https://hackernoon.com/deploying-angular-universal-v6-with-firebase-c86381ddd445)

* Run `firebase login:ci` to get token and and to `package.json` file 

##### Deploy by command
* Run `npm run build:prod` to build the project. The build artifacts will be stored in the `dist/` directory.
* Run `npm run build:fb` to deploy project to Google Firebase.

### Document

* [How to define a highly scalable folder structure for your Angular project](https://itnext.io/choosing-a-highly-scalable-folder-structure-in-angular-d987de65ec7)
* [How to Set Dynamic Page Title and Meta Tags in Angular 6 / Angular 7 for SEO](https://www.truecodex.com/course/angular-6/how-to-set-dynamic-page-title-and-meta-tags-in-angular-6-angular-7-for-seo)

### Deploy app engine
* Install Google Cloud Sdk console : [Link Download](https://cloud.google.com/sdk/docs/)
* Start at root folder (same as app.yaml)
* gcloud auth login [useraccount]
* gcloud config set project [obw-platform]

* Step 1: `gcloud init`
* step 2: `gcloud app deploy`

##### Reference gcloud app data
region = `asia-southeast1`
zone = `asia-southeast1-a`
account = `hai.vo@kyanon.digital`
disable_usage_reporting = `False`
project = `obw-platform`
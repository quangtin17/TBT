import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppBrowserModule } from './app/app.browser.module';

if (environment.production) {
  enableProdMode();

  window.console.log(`Production buid for ${environment.type}`);

  //TIP: hide console log on production mode
  if (window && environment.type === 'PROD') {
    window.console.log = function() {}; // clean console.log
  }
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppBrowserModule)
    .catch(err => console.error(err));
});

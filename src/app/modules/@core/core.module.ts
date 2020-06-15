import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UrlSerializer } from '@angular/router';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from './interceptors';

import { LowerCaseUrl } from './helpers';

import {
  ApiService,
  JwtService,
  MetaService,
  FilterService,
  PushNotificationsService,
  LocalStorageService,
  ConnectionService,
  IndexedDbService
} from './services';

export function initFilter(fs: FilterService) {
  return (): Promise<any> => {
    return fs.initFilter();
  };
}

export const CORE_HELPERS = [
  {
    provide: UrlSerializer,
    useClass: LowerCaseUrl
  }
];

export const CORE_PROVIDER = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpConfigInterceptor,
    // useClass: FakeBackendInterceptor,
    multi: true
  },

  ApiService,
  JwtService,
  MetaService,
  FilterService,
  PushNotificationsService,
  LocalStorageService,
  ConnectionService,
  IndexedDbService,
  {
    provide: APP_INITIALIZER,
    useFactory: initFilter,
    deps: [FilterService],
    multi: true
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  exports: [],
  providers: []
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [...CORE_PROVIDER, ...CORE_HELPERS]
    } as ModuleWithProviders;
  }
}

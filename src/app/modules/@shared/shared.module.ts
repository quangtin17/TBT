// Core Modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

// Custom Modules
import { ThemeModule } from '../@theme/theme.module';
import { NgxGalleryModule } from 'ngx-gallery';
import { HeadroomModule } from '@ctrl/ngx-headroom';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { ShareModule } from '@ngx-share/core';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import {
  RecaptchaModule,
  RecaptchaFormsModule,
  RecaptchaSettings,
  RECAPTCHA_SETTINGS
} from 'ng-recaptcha';

// Package Modules
import { LazyLoadImageModule } from 'ng-lazyload-image';
export function loadImage({ imagePath }) {
  return [imagePath];
}

// Custom Components
import {
  BannerComponent,
  GalleryComponent,
  ImgLazyloadComponent,
  MenuDropdownComponent,
  FormSubscribeComponent,
  VideoYoutubeComponent,
  UserComponent,
  ShareComponent,
  SpotlightItemComponent,
  BookmarkItemComponent,
  BookmarkBtnComponent,
  MultiSelectComponent,
  DropdownSelectCountryComponent,
  RelatedTopicComponent
} from './components';

import {
  HeaderComponent,
  HeaderUpperComponent,
  HeaderLowerComponent,
  HeaderMenuComponent,
  FooterComponent
} from './layout';

// Dialogs
import {
  DialogEnquiryComponent,
  DialogThankyouComponent,
  DialogShareComponent,
  DialogShareByEmailComponent,
  DialogTextFieldComponent,
  DialogConfirmComponent,
  DialogBookmarkAddItemComponent,
  DialogBookmarkRemoveItemComponent,
  DialogShareByEmailSuccessComponent,
  DialogNotifyFeatureComponent,
  DialogBookmarkRequireAuthComponent,
  DialogBookmarkRequireConnectionComponent
} from './dialogs';

// Services
import { ShareGroupService } from './services/share-group.service';
export const SHARED_DIALOGS = [
  DialogEnquiryComponent,
  DialogThankyouComponent,
  DialogShareComponent,
  DialogShareByEmailComponent,
  DialogTextFieldComponent,
  DialogConfirmComponent,
  DialogBookmarkAddItemComponent,
  DialogBookmarkRemoveItemComponent,
  DialogShareByEmailSuccessComponent,
  DialogNotifyFeatureComponent,
  DialogBookmarkRequireAuthComponent,
  DialogBookmarkRequireConnectionComponent
];

export const SHARED_PROVIDERS = [
  ...NgxYoutubePlayerModule.forRoot().providers,
  ...DeviceDetectorModule.forRoot().providers,
  ShareGroupService,
  {
    provide: RECAPTCHA_SETTINGS,
    useValue: { siteKey: `${environment.SiteKey}` } as RecaptchaSettings
  }
];

export const SHARED_MODULES = [
  ReactiveFormsModule,
  FormsModule,

  NgxGalleryModule,
  HeadroomModule,
  CKEditorModule,
  NgxYoutubePlayerModule,
  NgMultiSelectDropDownModule,
  ShareModule,
  NgSelectModule,
  NgxPageScrollCoreModule,
  RecaptchaModule,
  RecaptchaFormsModule
];

export const SHARED_COMPONENTS = [
  HeaderComponent,
  HeaderLowerComponent,
  HeaderUpperComponent,
  HeaderMenuComponent,
  FooterComponent,
  BannerComponent,
  GalleryComponent,
  ImgLazyloadComponent,
  MenuDropdownComponent,
  FormSubscribeComponent,
  VideoYoutubeComponent,
  UserComponent,
  ShareComponent,
  SpotlightItemComponent,
  BookmarkItemComponent,
  BookmarkBtnComponent,
  MultiSelectComponent,
  DropdownSelectCountryComponent,
  RelatedTopicComponent
];

@NgModule({
  declarations: [...SHARED_COMPONENTS, ...SHARED_DIALOGS],
  entryComponents: [...SHARED_DIALOGS],

  imports: [
    CommonModule,
    RouterModule,
    ThemeModule,
    ...SHARED_MODULES,
    LazyLoadImageModule.forRoot({ loadImage })
  ],
  exports: [
    ...SHARED_MODULES,
    // Components
    ...SHARED_COMPONENTS
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [...SHARED_PROVIDERS]
    } as ModuleWithProviders;
  }
}

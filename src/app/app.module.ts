import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
// import { HttpClientModule } from '@angular/common/http';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AuthModule } from './modules/@auth/auth.module';
import { CoreModule } from './modules/@core/core.module';
import { ThemeModule } from './modules/@theme/theme.module';
import { SharedModule } from './modules/@shared/shared.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }), // For Server Render
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    TransferHttpCacheModule,
    // HttpClientModule,
    NgtUniversalModule,

    CoreModule.forRoot(), // Import to use Core Services
    AuthModule.forRoot(), // Import to use Auth Services
    SharedModule.forRoot(), // Import to use Shared Services
    ToastrModule.forRoot({
      // Global config
      timeOut: 3000,
      preventDuplicates: true
    }),
    ThemeModule.forRoot(),
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

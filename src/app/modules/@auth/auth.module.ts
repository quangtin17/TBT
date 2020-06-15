// Core
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

// Custom
import { SharedModule } from '../@shared/shared.module';
import { ThemeModule } from '../@theme/theme.module';

// Components
import { FormLoginComponent } from './components/form-login/form-login.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';

import {
  PageLoginComponent,
  PageRegisterComponent,
  PageOAuthCallbackComponent
} from './views';
import { AuthComponent } from './auth.component';
import { AuthService } from './services/auth.service';

const AUTH_MODULES = [
  CommonModule,
  AuthRoutingModule,
  SharedModule,
  ThemeModule
];

const AUTH_COMPONENTS = [
  PageLoginComponent,
  PageRegisterComponent,
  FormLoginComponent,
  FormRegisterComponent,
  AuthComponent,
  PageOAuthCallbackComponent
];

export const AUTH_PROVIDER = [AuthService];

@NgModule({
  declarations: [...AUTH_COMPONENTS],
  imports: [...AUTH_MODULES],
  providers: [...AUTH_PROVIDER]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: AuthModule,
      providers: [...AUTH_PROVIDER]
    };
  }
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import {
  PageLoginComponent,
  PageRegisterComponent,
  PageOAuthCallbackComponent
} from './views';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      // { path: '', redirectTo: 'login', pathMatch: 'full' },
      // {
      //   path: 'login',
      //   component: PageLoginComponent
      // },
      // {
      //   path: 'register',
      //   component: PageRegisterComponent
      // },
      {
        path: 'tbt',
        component: PageOAuthCallbackComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}

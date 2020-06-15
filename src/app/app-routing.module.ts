import { NgModule, InjectionToken } from '@angular/core';
import {
  Routes,
  RouterModule,
  PreloadAllModules,
  ActivatedRouteSnapshot
} from '@angular/router';
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './modules/@auth/auth.module#AuthModule'
  },
  {
    path: '',
    loadChildren: './modules/main/main.module#MainModule'
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true, // <-- debugging purposes only
      preloadingStrategy: PreloadAllModules
    })
  ],

  exports: [RouterModule]
})
export class AppRoutingModule {}

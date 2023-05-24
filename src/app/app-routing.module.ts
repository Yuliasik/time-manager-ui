import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from "./authentication.guard";
import { LoginFormComponent } from "./structure/auth/login-form/login-form.component";
import { GreetingComponent } from "./structure/greeting/greeting.component";
import { RegisterComponent } from "./structure/auth/register/register.component";
import { NoticesComponent } from "./structure/notices/notices.component";
import { SettingsComponent } from "./structure/settings/settings.component";

const routes: Routes = [
  {
    path: 'greeting',
    component: GreetingComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        component: NoticesComponent,
      },
      {
        path: '**',
        redirectTo: ''
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

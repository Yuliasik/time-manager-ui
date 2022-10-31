import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from "./structure/test/test.component";
import { AuthenticationGuard } from "./authentication.guard";
import { LoginFormComponent } from "./structure/auth/login-form/login-form.component";
import { GreetingComponent } from "./structure/greeting/greeting.component";
import { RegisterComponent } from "./structure/auth/register/register.component";

const routes: Routes = [
  {
    path: 'greeting',
    component: GreetingComponent,
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
        component: TestComponent,
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

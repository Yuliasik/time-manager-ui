import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from "./test/test.component";
import { AuthenticationGuard } from "./authentication.guard";
import { LoginFormComponent } from "./login/login-form/login-form.component";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        component: TestComponent,
      },
      {
        path: 'login',
        component: LoginFormComponent,
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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './structure/test/test.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RequestInterceptor } from "./request-interceptor.service";
import { LoginFormComponent } from './structure/auth/login-form/login-form.component';
import { LogoutComponent } from './structure/auth/logout/logout.component';
import { GreetingComponent } from './structure/greeting/greeting.component';
import { PortalComponent } from './structure/portal-layout/portal/portal.component';
import { NavbarComponent } from './structure/portal-layout/navbar/navbar.component';
import { FooterComponent } from './structure/portal-layout/footer/footer.component';
import { RegisterComponent } from './structure/auth/register/register.component';
import { ValidationMessageComponent } from './shared/components/validation-message/validation-message.component';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from "ng-recaptcha";
import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginFormComponent,
    LogoutComponent,
    GreetingComponent,
    PortalComponent,
    NavbarComponent,
    FooterComponent,
    RegisterComponent,
    ValidationMessageComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RecaptchaFormsModule,
    RecaptchaModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

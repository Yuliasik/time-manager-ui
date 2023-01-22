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
import { environment } from "../environments/environment";
import { TaskCreateComponent } from './structure/task/task-create/task-create.component';
import { NoticesComponent } from './structure/notices/notices.component';
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TaskTileComponent } from './structure/notices/task-tile/task-tile.component';
import { NoticeComponent } from './structure/notices/notice/notice.component';
import { MatMenuModule } from "@angular/material/menu";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { TaskDeleteComponent } from './structure/task/task-delete/task-delete.component';

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
    DialogComponent,
    TaskCreateComponent,
    NoticesComponent,
    TaskTileComponent,
    NoticeComponent,
    TaskDeleteComponent
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
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatMenuModule,
    ScrollingModule,
    InfiniteScrollModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

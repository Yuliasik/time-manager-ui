import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginDto } from "../../../shared/models/login-dto";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Session } from "../../../shared/models/session";
import { HttpService } from "../../../shared/services/http.service";
import { DialogComponent } from "../../../shared/components/dialog/dialog.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UserService } from "../../../shared/services/user.service";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../styles/auth-style.scss']
})
export class LoginFormComponent implements OnInit {

  sessionId: any = "";
  loginForm!: FormGroup;
  dialogConfig = new MatDialogConfig();
  numberOfAttempts = 0;
  hide = true;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  login() {
    let loginDto: LoginDto = this.loginForm.value as LoginDto;
    this.userService.login(loginDto)
      .subscribe((session: Session) => {
          if (session) {
            this.sessionId = session.sessionId
            sessionStorage.setItem('token', this.sessionId);
            sessionStorage.setItem('userId', String(session.userId))
            sessionStorage.setItem('username', loginDto.username!)
            this.router.navigate(['']);
          } else {
            alert("Authentication failed!")
          }
        }, (errorRes) => {
          this.numberOfAttempts++;
          this.dialogConfig.hasBackdrop = true

          if (this.numberOfAttempts % 3 == 0) {
            this.dialogConfig.data = {
              message: "Check the current input language or whether CapsLock is enabled"
            }
            this.dialog.open(DialogComponent, this.dialogConfig);
          }
          this.dialogConfig.data = {
            message: errorRes.error
          }
          this.dialog.open(DialogComponent, this.dialogConfig);

          this.resetPassword();

        }
      )
  }

  back() {
    this.router.navigate(['/greeting']);
  }

  private initLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  private resetPassword() {
    this.loginForm.get("password")?.reset();
  }

}

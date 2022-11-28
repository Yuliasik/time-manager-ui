import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpService } from "../../../shared/services/http.service";
import { LoginDto } from "../../../shared/models/login-dto";
import { Session } from "../../../shared/models/session";
import { LoginFormControl } from "../login-form.controls";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogComponent } from "../../../shared/components/dialog/dialog.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../styles/auth-style.scss']
})
export class RegisterComponent implements OnInit {

  sessionId: any = "";
  loginForm!: FormGroup;
  dialogConfig = new MatDialogConfig();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['',
        [
          Validators.required,
          Validators.pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-@^=+!#()$?._%&*])(?=.*[a-zA-Z]).{8,}$/)
        ]
      ],
      repeatPassword: ['', [Validators.required]],
      recaptcha: ['', [Validators.required]]
    })
  }

  get password(): string {
    return this.loginForm.get(LoginFormControl.PASSWORD)?.value;
  }

  get repeatPassword(): string {
    return this.loginForm.get(LoginFormControl.REPEAT_PASSWORD)?.value;
  }

  back() {
    this.router.navigate(['/greeting']);
  }

  register() {
    let url = "/api/register";
    let loginDto: LoginDto = this.loginForm.value as LoginDto;
    this.http.post<Session>(url, loginDto)
      .subscribe((session: Session) => {
          if (session) {
            this.sessionId = session.sessionId
            sessionStorage.setItem('token', this.sessionId);
            this.router.navigate(['']);
          } else {
            alert("Register failed!")
          }
        }, (errorRes) => {
          this.dialogConfig.hasBackdrop = true
          this.dialogConfig.disableClose = true
          this.dialogConfig.data = {
            message: errorRes.error
          }
          this.dialog.open(DialogComponent, this.dialogConfig);
        }
      )
  }

  isDifferentPassword(): boolean {
    return !!this.password && !!this.repeatPassword && this.password !== this.repeatPassword
  }

}

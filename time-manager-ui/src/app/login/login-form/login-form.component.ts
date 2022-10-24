import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginDto } from "../../models/login-dto";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Session } from "../../models/session";
import { HttpService } from "../../services/http.service";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  sessionId: any = "";
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private http: HttpService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  login() {
    let url = "/api/login";
    let loginDto: LoginDto = this.loginForm.value as LoginDto;
    this.http.post<Session>(url, loginDto)
      .subscribe((session: Session) => {
        if (session) {
          this.sessionId = session.sessionId
          sessionStorage.setItem('token', this.sessionId);
          this.router.navigate(['']);
        } else {
          alert("Authentication failed!")
        }
      })
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
      })
  }

}

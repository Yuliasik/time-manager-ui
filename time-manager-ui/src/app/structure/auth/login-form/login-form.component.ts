import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginDto } from "../../../shared/models/login-dto";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Session } from "../../../shared/models/session";
import { HttpService } from "../../../shared/services/http.service";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../styles/auth-style.scss']
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

  back() {
    this.router.navigate(['/greeting']);
  }

}

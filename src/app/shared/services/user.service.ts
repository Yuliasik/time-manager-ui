import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { Session } from "../models/session";
import { LoginDto } from "../models/login-dto";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _userPath = '/api';

  constructor(
    private httpService: HttpService
  ) {
  }

  logout(): Observable<void> {
    return this.httpService.get<void>(`${this._userPath}/logout`)
  }

  login(loginDto: LoginDto): Observable<Session> {
    return this.httpService.post<Session>(`${this._userPath}/login`, loginDto)
  }

  register(loginDto: LoginDto): Observable<Session> {
    return this.httpService.post<Session>(`${this._userPath}/register`, loginDto)
  }
}

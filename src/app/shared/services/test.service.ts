import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getTime(): Observable<any> {
    return this.httpClient.get('/api/test', {responseType: 'text'});
  }
}

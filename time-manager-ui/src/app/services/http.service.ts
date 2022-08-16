import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly apiUrl = 'http://localhost:8080'

  constructor(
    private httpClient: HttpClient
  ) {
  }

  get<T>(path: string, params?: HttpParams): Observable<T> {
    let url = this.apiUrl + path;
    return this.httpClient.get<T>(url, {params: params})
  }

  post<T>(path: string, body?: any, params?: HttpParams): Observable<T> {
    let url = this.apiUrl + path
    return this.httpClient.post<T>(url, body, {params: params})
  }

  put<T>(path: string, body: any, params?: HttpParams): Observable<T> {
    let url = this.apiUrl + path
    return this.httpClient.put<T>(url, body, {params: params})
  }

  patch<T>(path: string, body?: any, params?: HttpParams): Observable<T> {
    let url = this.apiUrl + path
    return this.httpClient.patch<T>(url, body, {params: params})
  }

  delete<T>(path: string): Observable<T> {
    let url = this.apiUrl + path
    return this.httpClient.delete<T>(url)
  }
}

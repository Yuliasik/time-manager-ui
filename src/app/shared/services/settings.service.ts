import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { Settings } from "../models/settintgs";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly _settingPath = '/api/settings';

  constructor(
    private httpService: HttpService
  ) {
  }

  getSettings(): Observable<Settings> {
    return this.httpService.get<Settings>(`${this._settingPath}`);
  }

  updateSettings(settings: Settings): Observable<Settings> {
    return this.httpService.put<Settings>(this._settingPath, settings);
  }
}

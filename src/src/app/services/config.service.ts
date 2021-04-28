import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config: Config = { 
    apiUrl:'',
    authClientId: '',
    authAuthority: '',
    authRedirectUrl: '',
    authScopes: []
  };

  constructor() { }

  get settings(): Config {
    return this.config;
  }

  async load() {
    const headers = new Headers();

    const options = {
      method: "GET",
      headers: headers,
    };

    const url = `app.config`;

    const response = await fetch(url, options);
    this.config = await response.json();
  }
}

export interface Config {
  apiUrl: string;
  authClientId: string;
  authAuthority: string;
  authRedirectUrl: string;
  authScopes: string[];
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config: Config = { apiUrl:''};

  constructor() { }

  getApiBaseUrl(): string {
    return this.config.apiUrl;
  }

  async load() {
    const headers = new Headers();

    const options = {
      method: "GET",
      headers: headers,
    };

    const url = `config/app.config`;

    const response = await fetch(url, options);
    this.config = await response.json();
  }
}

export interface Config {
  apiUrl: string;
}

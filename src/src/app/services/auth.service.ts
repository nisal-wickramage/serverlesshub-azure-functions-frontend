import { Injectable } from '@angular/core';
import * as msal from "@azure/msal-browser";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly CLIENT_ID = '37c46fbc-7c3a-47cc-87ee-d57cafb873b7';
  private readonly REDIRECT_URI = 'http://localhost:4200'; // 'https://serverlessapiprepweb.z13.web.core.windows.net';
  private readonly SCOPES = ["https://serverlessapiprep.onmicrosoft.com/spaapp/api.read"];

  private readonly msalInstance: msal.PublicClientApplication;

  private accountId: string | undefined;
  private username: string | undefined;

  private loginRequest = {
    scopes: ["openid", ...this.SCOPES],
  };


  private apiConfig = {
    webApi: "https://serverlessapiprep.azurewebsites.net/api/helloworld?name=nisal"
  };

  constructor() {
    const msalConfig = {
      auth: {
        clientId: this.CLIENT_ID,
        authority: `https://serverlessapiprep.b2clogin.com/serverlessapiprep.onmicrosoft.com/B2C_1_serverlessapiprep`,
        // knownAuthorities: 'serverlessapiprep.b2clogin.com',
        redirectUri: this.REDIRECT_URI
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
      }
    };

    this.msalInstance = new msal.PublicClientApplication(msalConfig);
  }

  private selectAccount(): void {
    const currentAccounts = this.msalInstance.getAllAccounts();

    if (currentAccounts.length === 0) {
      return;
    } else if (currentAccounts.length > 1) {
      // Add your account choosing logic here
      console.log("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
      this.accountId = currentAccounts[0].homeAccountId;
      this.username = currentAccounts[0].username;
      this.welcomeUser(this.username);
    }
  }

  private welcomeUser(username: string | undefined): void {
    alert(`welcome ${username}`);
  }

  async signIn(): Promise<void> {
    try {
      const loginResponse = await this.msalInstance.loginPopup(this.loginRequest);
      if (loginResponse) {
        this.accountId = loginResponse.account?.homeAccountId;
        this.username = loginResponse.account?.username;
        this.welcomeUser(this.username);
      } else {
        this.selectAccount()
      }
    } catch (error) {
      console.log(error);
    }
  }

  async callApi(): Promise<void> {
    const account = this.msalInstance.getAccountByHomeId(this.accountId ? this.accountId : '');
    const tokenRequest = {
      scopes: [...this.SCOPES],
      forceRefresh: false,
      account: account ? account : undefined
    };
    const tokenResponse = await this.msalInstance.acquireTokenSilent(tokenRequest);
    await this.callApi2(tokenResponse.accessToken);
  }

  async callApi2(token: string): Promise<void> {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
      method: "GET",
      headers: headers
    };

    console.log('Calling Web API...');

    const response = await fetch(this.apiConfig.webApi, options);
  }

  async signOut(): Promise<void> {
    console.log('Sign-out');
  }


}

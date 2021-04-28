import { Injectable } from '@angular/core';
import * as msal from "@azure/msal-browser";
import { Config } from 'protractor';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly CLIENT_ID = 'a34afe18-b99a-44f3-b4b5-89dc0d41393c';
  private readonly REDIRECT_URI = 'https://serverlesshubtestwebapp.z13.web.core.windows.net/';//'http://localhost:4200'; // 'https://serverlessapiprepweb.z13.web.core.windows.net';
  private readonly SCOPES = ["https://serverlessapiprep.onmicrosoft.com/api/todo.crud"];

  private readonly msalInstance: msal.PublicClientApplication;

  private accountId: string | undefined;
  private isLoggedIn = false;

  private config: Config;

  constructor(private configService: ConfigService) {
    this.config = this.configService.settings;
    const msalConfig = {
      auth: {
        clientId: this.config.authClientId,
        authority: this.config.authAuthority,
        //`https://serverlessapiprep.b2clogin.com/serverlessapiprep.onmicrosoft.com/B2C_1_serverlessapiprep`,
        // `https://login.microsoftonline.com/2c8c1e59-3888-4b58-ba52-084bb3b9bcb9/`, //B2C_1_serverlessapiprep
        // knownAuthorities: 'serverlessapiprep.b2clogin.com',,
        redirectUri: this.config.authRedirectUrl
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
      this.isLoggedIn = true;
    }
  }

  async signIn(): Promise<void> {
    try {
      const loginRequest = {
        scopes: ["openid", ...this.config.authScopes],
      };

      const loginResponse = await this.msalInstance.loginPopup(loginRequest);
      if (loginResponse) {
        this.accountId = loginResponse.account?.homeAccountId;
        this.isLoggedIn = true;
      } else {
        this.selectAccount()
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getBearerToken(): Promise<string> {
    const account = this.msalInstance.getAccountByHomeId(this.accountId ? this.accountId : '');
    this.msalInstance.setActiveAccount(account);
    const tokenRequest = {
      scopes: [...this.config.authScopes],
      forceRefresh: false,
      account: account ? account : undefined
    };
    const tokenResponse = await this.msalInstance.acquireTokenSilent(tokenRequest);
    const bearer = `Bearer ${tokenResponse.accessToken}`;
    return bearer;
  }

  async signOut(): Promise<void> {
    this.msalInstance.logout();
  }

  get isAuthenticated() {
    return this.isLoggedIn;
  }
}

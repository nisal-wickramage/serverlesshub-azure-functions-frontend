import { Injectable } from '@angular/core';
import * as msal from "@azure/msal-browser";
import { Config } from 'protractor';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
      this.accountId = currentAccounts[0].homeAccountId;
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
    this.isLoggedIn = true;
    const bearer = `Bearer ${tokenResponse.accessToken}`;
    return bearer;
  }

  async signOut(): Promise<void> {
    await this.msalInstance.logout();
    this.isLoggedIn = false;
  }

  get isAuthenticated() {
    return this.isLoggedIn;
  }
}

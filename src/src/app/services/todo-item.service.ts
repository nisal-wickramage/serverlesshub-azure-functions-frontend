import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { NewTodoItem } from './new-todo-item';
import { TodoItem } from './todo-item';

@Injectable({
  providedIn: 'root'
})
export class TodoItemService {

  private apiBaseUrl: string

  private items: TodoItem[];

  constructor(
    private configService: ConfigService, 
    private authService: AuthService) { 
    this.items = [];
    this.apiBaseUrl = this.configService.settings.apiUrl;
  }

  private async getBearerToken(): Promise<string> {
    if(this.authService.isAuthenticated) {
      const accessToken = await this.authService.getBearerToken();
      return accessToken;
    }
    throw new Error('User is not authenticated.')
  }

  async save(item: NewTodoItem): Promise<void> {
    const headers = new Headers();
    const bearerToken = await this.getBearerToken()
    headers.append("Authorization",bearerToken);

    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(item)
    };

    const url = `${this.apiBaseUrl}/CreateTodoItem`;

    const response = await fetch(url, options);
    await response.json();
  }

  async edit(item: TodoItem): Promise<void> {
    const headers = new Headers();
    const bearerToken = await this.getBearerToken()
    headers.append("Authorization",bearerToken);

    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(item)
    };

    const url = `${this.apiBaseUrl}/EditTodoItem/${item.id}`;

    await fetch(url, options);
  }

  async saveAll(items: NewTodoItem[]): Promise<void> {
    const todoItems = items.map(item => {
      return {
        id: 'dummy',
        title: item.title,
        description: item.description
      } as TodoItem;
    });

    todoItems.forEach(item => {
      this.items.push(item);
    });
  }

  async delete(id: string): Promise<void> {

    const headers = new Headers();
    const bearerToken = await this.getBearerToken()
    headers.append("Authorization",bearerToken);

    const options = {
      method: "DELETE",
      headers: headers
    };

    const url = `${this.apiBaseUrl}/DeleteTodoItem/${id}`;

    await fetch(url, options);
    this.items = this.items.filter(item => item.id !== id);
  }

  async get(): Promise<TodoItem[]> {
    const headers = new Headers();
    const bearerToken = await this.getBearerToken()
    headers.append("Authorization",bearerToken);

    const options = {
      method: "GET",
      headers: headers
    };

    const url = `${this.apiBaseUrl}/GetTodoItems`;

    const response = await fetch(url, options);
    const items = await response.json();
    this.items = items;
    return items;
  }
}

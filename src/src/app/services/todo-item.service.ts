import { Injectable } from '@angular/core';
import { NewTodoItem } from './new-todo-item';
import { TodoItem } from './todo-item';

@Injectable({
  providedIn: 'root'
})
export class TodoItemService {

  private items: TodoItem[];

  constructor() { 
    this.items = [
      {title: 'Buy Grocery',description: 'Buy Grocery', createdDate: new Date('19-02-2021')},
      {title: 'Laundry',description: 'Do Laundry', createdDate: new Date('19-02-2021')}
    ];
  }

  async save(item: NewTodoItem): Promise<void> {
    this.items.push({...item, createdDate: new Date('19-02-2021')});
  }

  async saveAll(items: NewTodoItem[]): Promise<void> {
    const todoItems = items.map(item => {
      return {
        title: item.title,
        description: item.description,
        createdDate: new Date('19-02-2021')
      } as TodoItem;
    });

    todoItems.forEach(item => {
      this.items.push(item);
    });
  }

  async delete(uid: string): Promise<void> {
    this.items = this.items.filter(item => item.uid !== uid);
  }

  async get(): Promise<TodoItem[]> {
    return this.items;
  }

  async login(){
    console.log('login');
  }

  async logout(){
    console.log('logout');
  }
}

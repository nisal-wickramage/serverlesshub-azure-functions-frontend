import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewItemComponent } from '../new-item/new-item.component';
import { AuthService } from '../services/auth.service';
import { TodoItem } from '../services/todo-item';
import { TodoItemService } from '../services/todo-item.service';

@Component({
  selector: 'todo-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  @ViewChild('todoupload') 
  todoupload: ElementRef<HTMLInputElement> | undefined;

  items: TodoItem[];

  constructor(public dialog: MatDialog, 
    private todoService: TodoItemService,
    private authService: AuthService) {
    this.items = [];
   }

  ngOnInit(): void {
    if(this.authService.isAuthenticated){
      this.todoService.get().then(items => {this.items = items;});
    } else {
      this.authService.signIn().then(data => {
        this.todoService.get().then(items => {this.items = items;});
      });
    }
  }

  async signIn(): Promise<void> {
    console.log('start');
    await this.authService.signIn();
  }

  async callApi(): Promise<void> {
    
  }

  openFileUpload(): void {
    this.todoupload?.nativeElement.click();
  }
  
  onFileSelected(event: any): void {
    if(event.target.files && event.target.files.length === 1 && event.target.files[0].size < 1024*1024 ) {
      console.log(event.target.files[0].size);
    } else {
      alert("Please make sure you are only upload a single file and file size is less than 1 MB.");
    }
  }

  openNewItemDialog() {
    const dialogRef = this.dialog.open(NewItemComponent, {
      width: '250px',
      data: {title: '', description: ''}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result) {
        await this.todoService.save({...result});
        this.items = await this.todoService.get();
      }
    });
  }

  openEditItemDialog(todoItem: TodoItem) {
    const dialogRef = this.dialog.open(NewItemComponent, {
      width: '250px',
      data: todoItem
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result) {
        await this.todoService.edit({id:todoItem.id, ...result});
        this.items = await this.todoService.get();
      }
    });
  }

  handleEditItemEvent(todoItem: TodoItem): void {
    this.openEditItemDialog({...todoItem});
  }

}

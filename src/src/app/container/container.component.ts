import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewItemComponent } from '../new-item/new-item.component';
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

  constructor(public dialog: MatDialog, private todoService: TodoItemService) {
    this.items = [];
   }

  ngOnInit(): void {
    this.todoService.get().then(items => {this.items = items;});
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

  openDialog() {
    const dialogRef = this.dialog.open(NewItemComponent, {
      width: '250px',
      data: {title: '', description: ''}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result) {
        await this.todoService.save({...result, createdDate: new Date('19-02-2021')});
        this.items = await this.todoService.get();
      }
    });
  }

}

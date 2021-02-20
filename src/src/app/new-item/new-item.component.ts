import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewTodoItem } from '../services/new-todo-item';

@Component({
  selector: 'todo-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewTodoItem) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.data = { title: '', description: ''};
    this.dialogRef.close();
  }

}

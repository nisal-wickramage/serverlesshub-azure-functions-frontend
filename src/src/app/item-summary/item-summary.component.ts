import { Component, Input, OnInit } from '@angular/core';
import { TodoItem } from '../services/todo-item';

@Component({
  selector: 'todo-item-summary',
  templateUrl: './item-summary.component.html',
  styleUrls: ['./item-summary.component.css']
})
export class ItemSummaryComponent implements OnInit {

  @Input()
  items: TodoItem[];

  constructor() { 
    this.items = [];
  }

  ngOnInit(): void {
  }

}

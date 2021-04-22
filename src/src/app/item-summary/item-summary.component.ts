import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { TodoItem } from '../services/todo-item';
import { TodoItemService } from '../services/todo-item.service';

@Component({
  selector: 'todo-item-summary',
  templateUrl: './item-summary.component.html',
  styleUrls: ['./item-summary.component.css']
})
export class ItemSummaryComponent implements OnInit {

  @Input()
  items: TodoItem[];

  @Output()
  editItem: EventEmitter<TodoItem> = new EventEmitter<TodoItem>();

  constructor(private todoItemService: TodoItemService) { 
    this.items = [];
  }

  ngOnInit(): void {
  }

  async delete(id: string): Promise<void> {
    await this.todoItemService.delete(id);
    this.items = await this.todoItemService.get();
  }

  async edit(id: string): Promise<void> {
    const item = this.items.filter(i => i.id === id)[0];
    this.editItem.emit(item);
  }

}

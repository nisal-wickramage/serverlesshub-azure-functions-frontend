import { NewTodoItem } from "./new-todo-item";

export interface TodoItem extends NewTodoItem{
    uid? : string;
    createdDate: Date;
}

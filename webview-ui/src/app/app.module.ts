import { DragDropModule } from "@angular/cdk/drag-drop";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { TextArea } from "./shared/text-area.component";
import { TodoLabel } from "./shared/todo-label.component";
import { NewTodoComponent } from "./todo/new-todo/new-todo.component";
import { TodoList } from "./todo/todo-list/todo-list.component";
import { AutoAnimateDirective } from "./utilities/animate";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMenuModule } from "@angular/material/menu";
import { TodoItemComponent } from "./todo/todo-item/todo-item.component";
import { MarkdownModule } from "ngx-markdown";
import { HttpClientModule } from "@angular/common/http";

import "prismjs";
import "prismjs/components/prism-typescript.min.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-highlight/prism-line-highlight.js";

@NgModule({
	declarations: [
		AppComponent,
		TodoLabel,
		TodoList,
		TodoItemComponent,
		TextArea,
		NewTodoComponent,
		AutoAnimateDirective,
	],
	imports: [
		BrowserModule,
		FormsModule,
		DragDropModule,
		MatSnackBarModule,
		BrowserAnimationsModule,
		MatMenuModule,
		HttpClientModule, // HttpClientModule is required for ngx-markdown
		MarkdownModule.forRoot(),
	],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

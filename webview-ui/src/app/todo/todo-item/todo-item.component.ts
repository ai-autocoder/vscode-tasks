import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from "@angular/core";
import { Todo, TodoScope } from "../../../../../src/todo/todoTypes";
import { TodoService } from "../todo.service";

@Component({
	selector: "todo-item",
	templateUrl: "./todo-item.component.html",
	styleUrls: ["./todo-item.component.scss"],
})
export class TodoItemComponent {
	@Input() todo!: Todo;
	@Input() scope!: TodoScope;
	@Input() dragging = false;
	isEditable = false;
	footerActive?: boolean;
	previousText!: string;
	@Output() delete: EventEmitter<Todo> = new EventEmitter();
	private globalClickUnlistener?: () => void;

	constructor(
		private todoService: TodoService,
		private renderer: Renderer2,
		private elRef: ElementRef
	) {}

	saveEdit() {
		this.todoService.editTodo(this.scope, { id: this.todo.id, newText: this.todo.text.trim() });
		this.isEditable = false;
		this.removeGlobalClickListener();
	}

	cancelEdit() {
		this.todo.text = this.previousText;
		this.isEditable = false;
		this.removeGlobalClickListener();
	}

	toggleCompleted() {
		this.todoService.toggleTodo(this.scope, { id: this.todo.id });
	}

	edit(event?: MouseEvent) {
		// If clicked on a link don't edit
		if (event && (event.target as HTMLElement).tagName.toLowerCase() === "a") {
			return;
		}
		this.previousText = this.todo.text;
		this.isEditable = true;
		setTimeout(() => {
			this.globalClickUnlistener = this.renderer.listen("document", "click", (event) => {
				if (!this.elRef.nativeElement.contains(event.target) && event.target.id !== "cancel-button") {
					this.saveEdit();
				}
			});
		}, 0);
	}

	toggleMarkdown() {
		this.todoService.toggleMarkdown(this.scope, { id: this.todo.id });
	}

	toggleTodoNote() {
		this.todoService.toggleTodoNote(this.scope, { id: this.todo.id });
	}

	onDelete(todo: Todo): void {
		this.delete.emit(todo);
	}

	private removeGlobalClickListener(): void {
		if (this.globalClickUnlistener) {
			this.globalClickUnlistener();
		}
	}

	ngOnDestroy(): void {
		this.removeGlobalClickListener();
	}
}

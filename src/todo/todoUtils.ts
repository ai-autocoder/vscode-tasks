import { ExtensionContext } from "vscode";
import { Todo, TodoScope, TodoSlice } from "./todoTypes";
import { getConfig } from "../utilities/config";

/**
 * Calculate the number of incomplete todos in the given state.
 *
 * @param {TodoSlice} state - The state containing the todos.
 * @return {Object} todoCount - An object containing the number of todos in the workspace and for the user.
 */
export function getNumberOfTodos(state: TodoSlice): number {
	return state?.todos.filter((todo) => !todo.completed).length ?? 0;
}

/**
 * Persists the provided slice state to the extension context.
 */
export function persist(state: TodoSlice, context: ExtensionContext): void {
	state.scope === TodoScope.user
		? context.globalState.update("TodoData", state.todos)
		: context.workspaceState.update("TodoData", state.todos);
}

/**
 * Generates a unique ID for a todo, prefixed based on the todo scope ('1' for user, '2' for workspace).
 *
 * @param {TodoSlice} state - State containing todos.
 * @param {TodoScope} scope - Scope of the todo (user or workspace).
 * @return {number} Prefixed unique ID within safe integer range.
 */
export function generateUniqueId(state: TodoSlice, scope: TodoScope): number {
	const todos = state.todos;
	let newId: number;
	const maxRandom = Number.MAX_SAFE_INTEGER / 10;

	do {
		const randomPart = Math.floor(Math.random() * maxRandom);
		// Prefix the random part with '1' or '2' based on the scope
		newId = parseInt(`${scope === TodoScope.user ? 1 : 2}${randomPart}`);
	} while (todos.some((todo) => todo.id === newId));

	return newId;
}

/**
 * Sorts an array of todos according to the configuration.
 *
 * @param {Todo[]} todos - The array of todos and notes to be sorted.
 * @return {Todo[]} A new array of todos sorted according to the specified rules.
 */
export function sortTodosWithNotes(todos: Todo[]): Todo[] {
	const { taskSortingOptions } = getConfig();

	switch (taskSortingOptions) {
		case "disabled":
			return todos;
		case "sortType1":
			return sortType1(todos);
		case "sortType2":
			return sortType2(todos);
	}
}

/**
 * Sorts an array of todos by their completion status.
 */
function sortType1(todos: Todo[]) {
	return todos.slice().sort((a, b) => {
		const isACompleted = !a.isNote && a.completed;
		const isBCompleted = !b.isNote && b.completed;

		if (a.isNote && b.isNote) return 0; // Both are notes, maintain original order

		if (!a.isNote && !b.isNote) {
			// Both are non-notes
			if (isACompleted === isBCompleted) return 0; // Both completed or both non-completed, maintain original order
			if (isACompleted) return 1; // A is completed, B is not, A goes after B
			return -1; // B is completed, A is not, B goes after A
		}

		if (a.isNote) {
			// A is a note, B is a non-note
			if (!isBCompleted) return 0; // B is not completed, maintain original order
			return -1; // B is completed, note goes before
		}

		if (b.isNote) {
			// A is a non-note, B is a note
			if (!isACompleted) return 0; // A is not completed, maintain original order
			return 1; // A is completed, note goes before
		}

		return 0; // Fallback to maintain original order
	});
}

/**Sorts an array of todos by their completion status
 * within groups defined by note items.
 */
function sortType2(todos: Todo[]) {
	let currentGroup = 0;
	const mappedTodos = todos.map((todo, index) => ({
		originalIndex: index,
		todo,
		group: todo.isNote ? ++currentGroup : currentGroup,
	}));

	const sortedMappedTodos = mappedTodos.sort((a, b) => {
		if (a.group !== b.group) {
			return a.group - b.group;
		}
		if (!a.todo.isNote && !b.todo.isNote) {
			return Number(a.todo.completed) - Number(b.todo.completed);
		}
		return a.originalIndex - b.originalIndex;
	});

	return sortedMappedTodos.map((mappedItem) => mappedItem.todo);
}

import { userActions, workspaceActions } from "../todo/store";
import { StoreState, TodoScope, TodoSlice } from "../todo/todoTypes";
import { Config } from "../utilities/config";

type MessagePayload<T, L> = T extends
	| MessageActionsFromWebview.addTodo
	| MessageActionsFromWebview.editTodo
	| MessageActionsFromWebview.toggleTodo
	| MessageActionsFromWebview.deleteTodo
	| MessageActionsFromWebview.reorderTodo
	| MessageActionsFromWebview.toggleMarkdown
	| MessageActionsFromWebview.toggleTodoNote
	? Parameters<L extends TodoScope.user ? (typeof userActions)[T] : (typeof workspaceActions)[T]>[0]
	: T extends MessageActionsToWebview.syncData
		? TodoSlice
		: T extends MessageActionsToWebview.reloadWebview
			? StoreState
			: never;

export type Message<
	T extends MessageActionsFromWebview | MessageActionsToWebview,
	L extends TodoScope = never,
> = T extends MessageActionsToWebview.reloadWebview
	? {
			type: T;
			payload: MessagePayload<T, L>;
			config: Config;
		}
	: T extends MessageActionsToWebview.syncData
		? {
				type: T;
				payload: MessagePayload<T, L>;
			}
		: {
				type: T;
				scope: L;
				payload: MessagePayload<T, L>;
			};

export const enum MessageActionsFromWebview {
	addTodo = "addTodo",
	editTodo = "editTodo",
	toggleTodo = "toggleTodo",
	deleteTodo = "deleteTodo",
	reorderTodo = "reorderTodo",
	toggleMarkdown = "toggleMarkdown",
	toggleTodoNote = "toggleTodoNote",
}
export const enum MessageActionsToWebview {
	reloadWebview = "reloadWebview", // Send full data to webview when it reloads
	syncData = "syncData",
}

// Message creators from Webview to Extension
export const messagesFromWebview = {
	addTodo: <L extends TodoScope>(
		scope: L,
		payload: L extends TodoScope.user
			? Parameters<typeof userActions.addTodo>[0]
			: Parameters<typeof workspaceActions.addTodo>[0]
	): Message<MessageActionsFromWebview.addTodo, TodoScope> => ({
		type: MessageActionsFromWebview.addTodo,
		scope,
		payload,
	}),
	editTodo: <L extends TodoScope>(
		scope: L,
		payload: L extends TodoScope.user
			? Parameters<typeof userActions.editTodo>[0]
			: Parameters<typeof workspaceActions.editTodo>[0]
	): Message<MessageActionsFromWebview.editTodo, TodoScope> => ({
		type: MessageActionsFromWebview.editTodo,
		scope,
		payload,
	}),
	toggleTodo: <L extends TodoScope>(
		scope: L,
		payload: L extends TodoScope.user
			? Parameters<typeof userActions.toggleTodo>[0]
			: Parameters<typeof workspaceActions.toggleTodo>[0]
	): Message<MessageActionsFromWebview.toggleTodo, TodoScope> => ({
		type: MessageActionsFromWebview.toggleTodo,
		scope,
		payload,
	}),
	deleteTodo: <L extends TodoScope>(
		scope: L,
		payload: L extends TodoScope.user
			? Parameters<typeof userActions.deleteTodo>[0]
			: Parameters<typeof workspaceActions.deleteTodo>[0]
	): Message<MessageActionsFromWebview.deleteTodo, TodoScope> => ({
		type: MessageActionsFromWebview.deleteTodo,
		scope,
		payload,
	}),
	reorderTodo: <L extends TodoScope>(
		scope: L,
		payload: L extends TodoScope.user
			? Parameters<typeof userActions.reorderTodo>[0]
			: Parameters<typeof workspaceActions.reorderTodo>[0]
	): Message<MessageActionsFromWebview.reorderTodo, TodoScope> => ({
		type: MessageActionsFromWebview.reorderTodo,
		scope,
		payload,
	}),
	toggleMarkdown: <L extends TodoScope>(
		scope: L,
		payload: L extends TodoScope.user
			? Parameters<typeof userActions.toggleMarkdown>[0]
			: Parameters<typeof workspaceActions.toggleMarkdown>[0]
	): Message<MessageActionsFromWebview.toggleMarkdown, TodoScope> => ({
		type: MessageActionsFromWebview.toggleMarkdown,
		scope,
		payload,
	}),
	toggleTodoNote: <L extends TodoScope>(
		scope: L,
		payload: L extends TodoScope.user
			? Parameters<typeof userActions.toggleTodoNote>[0]
			: Parameters<typeof workspaceActions.toggleTodoNote>[0]
	): Message<MessageActionsFromWebview.toggleTodoNote, TodoScope> => ({
		type: MessageActionsFromWebview.toggleTodoNote,
		scope,
		payload,
	}),
};
export const messagesToWebview = {
	// Message creators from extension to UI
	reloadWebview: (
		payload: StoreState,
		config: Config
	): Message<MessageActionsToWebview.reloadWebview> => ({
		type: MessageActionsToWebview.reloadWebview,
		payload,
		config,
	}),
	syncData: (payload: TodoSlice): Message<MessageActionsToWebview.syncData> => ({
		type: MessageActionsToWebview.syncData,
		payload,
	}),
};

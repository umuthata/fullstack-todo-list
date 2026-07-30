import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import api from "../../services/api";

export interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
}
export type TodoFilter =
    | "all"
    | "completed"
    | "active";

interface CreateTodoData {
    title: string;
    description: string;
}

interface UpdateTodoData {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
}

interface TodosState {
    items: Todo[];
    loading: boolean;
    creating: boolean;
    updatingId: number | null;
    deletingId: number | null;
    filter: TodoFilter;
    error: string | null;
}

const initialState: TodosState = {
    items: [],
    loading: false,
    creating: false,
    updatingId: null,
    deletingId: null,
    filter: "all",
    error: null,
};

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ??
            "Todo işlemi başarısız oldu."
        );
    }

    return "Beklenmeyen bir hata oluştu.";
}

export const fetchTodos = createAsyncThunk<
    Todo[],
    void,
    { rejectValue: string }
>(
    "todos/fetchTodos",
    async (_, thunkApi) => {
        try {
            const response = await api.get<Todo[]>("/todos");

            return response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(
                getErrorMessage(error),
            );
        }
    },
);

export const createTodo = createAsyncThunk<
    Todo,
    CreateTodoData,
    { rejectValue: string }
>(
    "todos/createTodo",
    async (todoData, thunkApi) => {
        try {
            const response = await api.post<Todo>(
                "/todos",
                todoData,
            );

            return response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(
                getErrorMessage(error),
            );
        }
    },
);

export const updateTodo = createAsyncThunk<
    Todo,
    UpdateTodoData,
    { rejectValue: string }
>(
    "todos/updateTodo",
    async (todoData, thunkApi) => {
        try {
            const { id, ...requestBody } = todoData;

            const response = await api.put<Todo>(
                `/todos/${id}`,
                requestBody,
            );

            return response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(
                getErrorMessage(error),
            );
        }
    },
);
export const deleteTodo = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>(
    "todos/deleteTodo",
    async (id, thunkApi) => {
        try {
            await api.delete(`/todos/${id}`);

            return id;
        } catch (error) {
            return thunkApi.rejectWithValue(
                getErrorMessage(error),
            );
        }
    },
);

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        setFilter: (
            state,
            action: PayloadAction<TodoFilter>,
        ) => {
            state.filter = action.payload;
        },

        clearTodos: (state) => {
            state.items = [];
            state.filter = "all";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchTodos.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ?? "Todo listesi alınamadı.";
            })

            .addCase(createTodo.pending, (state) => {
                state.creating = true;
                state.error = null;
            })

            .addCase(createTodo.fulfilled, (state, action) => {
                state.creating = false;
                state.items.unshift(action.payload);
            })

            .addCase(createTodo.rejected, (state, action) => {
                state.creating = false;
                state.error =
                    action.payload ?? "Todo eklenemedi.";
            })

            .addCase(updateTodo.pending, (state, action) => {
                state.updatingId = action.meta.arg.id;
                state.error = null;
            })

            .addCase(updateTodo.fulfilled, (state, action) => {
                state.updatingId = null;

                const index = state.items.findIndex(
                    (todo) => todo.id === action.payload.id,
                );

                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })

            .addCase(updateTodo.rejected, (state, action) => {
                state.updatingId = null;
                state.error =
                    action.payload ?? "Todo güncellenemedi.";
            })
            .addCase(deleteTodo.pending, (state, action) => {
                state.deletingId = action.meta.arg;
                state.error = null;
            })

            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.deletingId = null;

                state.items = state.items.filter(
                    (todo) => todo.id !== action.payload,
                );
            })

            .addCase(deleteTodo.rejected, (state, action) => {
                state.deletingId = null;
                state.error =
                    action.payload ?? "Todo silinemedi.";
            });

    },
});
export const {
    setFilter,
    clearTodos,
} = todoSlice.actions;
export default todoSlice.reducer;
import {
    useEffect,
    useState,
    type FormEvent,
} from "react";
import { useNavigate } from "react-router";

import { logout } from "../features/auth/authSlice";

import {
    clearTodos,
    createTodo,
    deleteTodo,
    fetchTodos,
    setFilter,
    updateTodo,
    type Todo,
} from "../features/todos/todoSlice";

import api from "../services/api";

import {
    useAppDispatch,
    useAppSelector,
} from "../store/hooks";

import "../App.css";

interface MeResponse {
    username: string;
}

function TodoPage() {
    const [username, setUsername] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] =
        useState("");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const todos = useAppSelector(
        (state) => state.todos.items,
    );

    const loading = useAppSelector(
        (state) => state.todos.loading,
    );

    const creating = useAppSelector(
        (state) => state.todos.creating,
    );

    const updatingId = useAppSelector(
        (state) => state.todos.updatingId,
    );

    const deletingId = useAppSelector(
        (state) => state.todos.deletingId,
    );

    const filter = useAppSelector(
        (state) => state.todos.filter,
    );

    const error = useAppSelector(
        (state) => state.todos.error,
    );

    useEffect(() => {
        async function getCurrentUser() {
            try {
                const response =
                    await api.get<MeResponse>("/auth/me");

                setUsername(response.data.username);
            } catch {
                setUsername("");
            }
        }

        getCurrentUser();
        dispatch(fetchTodos());
    }, [dispatch]);

    async function handleCreateTodo(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        try {
            await dispatch(
                createTodo({
                    title: title.trim(),
                    description,
                }),
            ).unwrap();

            setTitle("");
            setDescription("");
        } catch {
            // Hata Redux state üzerinden gösteriliyor.
        }
    }

    async function handleToggleTodo(todo: Todo) {
        try {
            await dispatch(
                updateTodo({
                    id: todo.id,
                    title: todo.title,
                    description: todo.description,
                    completed: !todo.completed,
                }),
            ).unwrap();
        } catch {
            // Hata Redux state üzerinden gösteriliyor.
        }
    }

    async function handleDeleteTodo(todo: Todo) {
        const confirmed = window.confirm(
            `"${todo.title}" Todo kaydını silmek istediğine emin misin?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await dispatch(deleteTodo(todo.id)).unwrap();
        } catch {
            // Hata Redux state üzerinden gösteriliyor.
        }
    }

    function handleStartEdit(todo: Todo) {
        setEditingId(todo.id);
        setEditTitle(todo.title);
        setEditDescription(todo.description ?? "");
    }

    function handleCancelEdit() {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
    }

    async function handleSaveEdit(todo: Todo) {
        if (editTitle.trim().length === 0) {
            return;
        }

        try {
            await dispatch(
                updateTodo({
                    id: todo.id,
                    title: editTitle.trim(),
                    description: editDescription,
                    completed: todo.completed,
                }),
            ).unwrap();

            handleCancelEdit();
        } catch {
            // Hata Redux state üzerinden gösteriliyor.
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");

        dispatch(logout());
        dispatch(clearTodos());

        navigate("/login", {
            replace: true,
        });
    }

    const filteredTodos = todos.filter((todo) => {
        if (filter === "completed") {
            return todo.completed;
        }

        if (filter === "active") {
            return !todo.completed;
        }

        return true;
    });

    const firstLetter =
        username.charAt(0).toUpperCase();

    return (
        <main className="todo-page">
            <div className="todo-shell">
                <header className="todo-header">
                    <div>
            <span className="eyebrow">
              Günlük planlayıcı
            </span>

                        <h1>Todo Listesi</h1>
                    </div>

                    {username && (
                        <div className="header-actions">
                            <div className="user-badge">
                <span className="user-avatar">
                  {firstLetter}
                </span>

                                <span>
                  Hoş geldin, {username}
                </span>
                            </div>

                            <button
                                type="button"
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Çıkış Yap
                            </button>
                        </div>
                    )}
                </header>

                <div className="todo-grid">
                    <form
                        className="todo-form-card"
                        onSubmit={handleCreateTodo}
                    >
                        <h2>Yeni Todo</h2>

                        <p>
                            Yapman gereken yeni bir görev ekle.
                        </p>

                        <label htmlFor="todo-title">
                            Başlık
                        </label>

                        <input
                            id="todo-title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder="Örneğin: React çalış"
                            maxLength={255}
                            required
                        />

                        <label htmlFor="todo-description">
                            Açıklama
                        </label>

                        <textarea
                            id="todo-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Görev hakkında kısa bir açıklama..."
                            maxLength={1000}
                            rows={4}
                        />

                        <button
                            type="submit"
                            disabled={
                                creating || title.trim().length === 0
                            }
                        >
                            {creating
                                ? "Ekleniyor..."
                                : "Todo Ekle"}
                        </button>

                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}
                    </form>

                    <section className="todo-list-card">
                        <div className="section-heading">
                            <h2>Görevlerim</h2>

                            <span className="todo-count">
                {filteredTodos.length}
              </span>
                        </div>

                        <div className="filter-tabs">
                            <button
                                type="button"
                                className={
                                    filter === "all"
                                        ? "filter-button active"
                                        : "filter-button"
                                }
                                onClick={() =>
                                    dispatch(setFilter("all"))
                                }
                            >
                                Tümü
                            </button>

                            <button
                                type="button"
                                className={
                                    filter === "active"
                                        ? "filter-button active"
                                        : "filter-button"
                                }
                                onClick={() =>
                                    dispatch(setFilter("active"))
                                }
                            >
                                Tamamlanmayanlar
                            </button>

                            <button
                                type="button"
                                className={
                                    filter === "completed"
                                        ? "filter-button active"
                                        : "filter-button"
                                }
                                onClick={() =>
                                    dispatch(setFilter("completed"))
                                }
                            >
                                Tamamlananlar
                            </button>
                        </div>

                        {loading && (
                            <p className="loading-message">
                                Todo listesi yükleniyor...
                            </p>
                        )}

                        {!loading && todos.length === 0 && (
                            <p className="empty-state">
                                Henüz Todo kaydın bulunmuyor.
                            </p>
                        )}

                        {!loading &&
                            todos.length > 0 &&
                            filteredTodos.length === 0 && (
                                <p className="empty-state">
                                    Bu filtreye uygun Todo bulunmuyor.
                                </p>
                            )}

                        <ul className="todo-list">
                            {filteredTodos.map((todo) => (
                                <li
                                    key={todo.id}
                                    className={`todo-item ${
                                        todo.completed
                                            ? "is-completed"
                                            : ""
                                    }`}
                                >
                                    <span className="todo-status-dot" />

                                    {editingId === todo.id ? (
                                        <div className="todo-edit-form">
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(event) =>
                                                    setEditTitle(
                                                        event.target.value,
                                                    )
                                                }
                                                maxLength={255}
                                                autoFocus
                                            />

                                            <textarea
                                                value={editDescription}
                                                onChange={(event) =>
                                                    setEditDescription(
                                                        event.target.value,
                                                    )
                                                }
                                                maxLength={1000}
                                                rows={3}
                                            />

                                            <div className="edit-actions">
                                                <button
                                                    type="button"
                                                    className="save-button"
                                                    disabled={
                                                        updatingId === todo.id ||
                                                        editTitle.trim().length === 0
                                                    }
                                                    onClick={() =>
                                                        handleSaveEdit(todo)
                                                    }
                                                >
                                                    {updatingId === todo.id
                                                        ? "Kaydediliyor..."
                                                        : "Kaydet"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cancel-button"
                                                    disabled={
                                                        updatingId === todo.id
                                                    }
                                                    onClick={handleCancelEdit}
                                                >
                                                    İptal
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="todo-content">
                                                <strong className="todo-title">
                                                    {todo.title}
                                                </strong>

                                                {todo.description && (
                                                    <p className="todo-description">
                                                        {todo.description}
                                                    </p>
                                                )}

                                                <span className="todo-state">
                          {todo.completed
                              ? "Tamamlandı"
                              : "Tamamlanmadı"}
                        </span>
                                            </div>

                                            <div className="todo-actions">
                                                <button
                                                    type="button"
                                                    className="edit-button"
                                                    disabled={
                                                        updatingId === todo.id ||
                                                        deletingId === todo.id
                                                    }
                                                    onClick={() =>
                                                        handleStartEdit(todo)
                                                    }
                                                >
                                                    Düzenle
                                                </button>

                                                <button
                                                    type="button"
                                                    className="complete-button"
                                                    disabled={
                                                        updatingId === todo.id ||
                                                        deletingId === todo.id
                                                    }
                                                    onClick={() =>
                                                        handleToggleTodo(todo)
                                                    }
                                                >
                                                    {updatingId === todo.id
                                                        ? "Kaydediliyor..."
                                                        : todo.completed
                                                            ? "Geri Al"
                                                            : "Tamamla"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-button"
                                                    disabled={
                                                        deletingId === todo.id ||
                                                        updatingId === todo.id
                                                    }
                                                    onClick={() =>
                                                        handleDeleteTodo(todo)
                                                    }
                                                >
                                                    {deletingId === todo.id
                                                        ? "Siliniyor..."
                                                        : "Sil"}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default TodoPage;
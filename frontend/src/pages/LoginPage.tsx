import {
    useState,
    type FormEvent,
} from "react";
import axios from "axios";
import {
    Link,
    useNavigate,
} from "react-router";

import { setToken } from "../features/auth/authSlice";
import api from "../services/api";
import { useAppDispatch } from "../store/hooks";

import "../App.css";

interface LoginResponse {
    message: string;
    token: string;
}

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return (
            error.response?.data?.message ??
            "Giriş işlemi başarısız oldu."
        );
    }

    return "Beklenmeyen bir hata oluştu.";
}

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    async function handleLogin(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response =
                await api.post<LoginResponse>(
                    "/auth/login",
                    {
                        username: username.trim(),
                        password,
                    },
                );

            localStorage.setItem(
                "token",
                response.data.token,
            );

            dispatch(setToken(response.data.token));

            navigate("/todos", {
                replace: true,
            });
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-container">
                <section className="auth-brand-panel">
                    <div className="auth-brand-content">
                        <div className="auth-logo">
                            T
                        </div>

                        <span className="auth-eyebrow">
              Günlük planlayıcı
            </span>

                        <h1>
                            Görevlerini düzenle,
                            gününü kontrol et.
                        </h1>

                        <p>
                            Yapacaklarını ekle, tamamla ve
                            bütün görevlerini tek bir yerden
                            kolayca yönet.
                        </p>

                        <div className="auth-features">
                            <span>✓ Kişisel Todo listesi</span>
                            <span>✓ Güvenli kullanıcı hesabı</span>
                            <span>✓ Kolay görev yönetimi</span>
                        </div>
                    </div>
                </section>

                <section className="auth-form-panel">
                    <form
                        className="auth-form"
                        onSubmit={handleLogin}
                    >
                        <div className="auth-form-heading">
              <span className="auth-mobile-logo">
                T
              </span>

                            <h2>Tekrar hoş geldin</h2>

                            <p>
                                Todo listene ulaşmak için giriş
                                yap.
                            </p>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="login-username">
                                Kullanıcı adı
                            </label>

                            <input
                                id="login-username"
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                placeholder="Kullanıcı adını yaz"
                                autoComplete="username"
                                maxLength={50}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="login-password">
                                Şifre
                            </label>

                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Şifreni yaz"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        {error && (
                            <p className="auth-message auth-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="auth-submit-button"
                            disabled={
                                loading ||
                                username.trim().length === 0 ||
                                password.length === 0
                            }
                        >
                            {loading
                                ? "Giriş yapılıyor..."
                                : "Giriş Yap"}
                        </button>

                        <p className="auth-switch-text">
                            Henüz hesabın yok mu?

                            <Link to="/register">
                                Kayıt Ol
                            </Link>
                        </p>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default LoginPage;
import {
    useState,
    type FormEvent,
} from "react";
import axios from "axios";
import {
    Link,
    useNavigate,
} from "react-router";

import api from "../services/api";

import "../App.css";

interface RegisterResponse {
    message: string;
}

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return (
            error.response?.data?.message ??
            "Kayıt işlemi başarısız oldu."
        );
    }

    return "Beklenmeyen bir hata oluştu.";
}

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleRegister(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            await api.post<RegisterResponse>(
                "/auth/register",
                {
                    username: username.trim(),
                    email: email.trim(),
                    password,
                },
            );

            navigate("/login", {
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
              Hemen başla
            </span>

                        <h1>
                            Planlarını erteleme,
                            görevlerini tamamla.
                        </h1>

                        <p>
                            Ücretsiz hesabını oluştur ve
                            günlük görevlerini kişisel
                            listen üzerinden takip et.
                        </p>

                        <div className="auth-features">
                            <span>✓ Görev ekleme ve düzenleme</span>
                            <span>✓ Tamamlanan görevleri filtreleme</span>
                            <span>✓ Kullanıcıya özel güvenli veriler</span>
                        </div>
                    </div>
                </section>

                <section className="auth-form-panel">
                    <form
                        className="auth-form"
                        onSubmit={handleRegister}
                    >
                        <div className="auth-form-heading">
              <span className="auth-mobile-logo">
                T
              </span>

                            <h2>Hesap oluştur</h2>

                            <p>
                                Bilgilerini girerek Todo
                                uygulamasına katıl.
                            </p>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-username">
                                Kullanıcı adı
                            </label>

                            <input
                                id="register-username"
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                placeholder="Kullanıcı adı belirle"
                                autoComplete="username"
                                maxLength={50}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-email">
                                E-posta
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="ornek@mail.com"
                                autoComplete="email"
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-password">
                                Şifre
                            </label>

                            <input
                                id="register-password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Şifre belirle"
                                autoComplete="new-password"
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
                                email.trim().length === 0 ||
                                password.length === 0
                            }
                        >
                            {loading
                                ? "Hesap oluşturuluyor..."
                                : "Kayıt Ol"}
                        </button>

                        <p className="auth-switch-text">
                            Zaten hesabın var mı?

                            <Link to="/login">
                                Giriş Yap
                            </Link>
                        </p>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default RegisterPage;
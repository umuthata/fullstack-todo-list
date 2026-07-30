import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ??
        (import.meta.env.PROD
            ? "https://todo-app-backend-7pv4.onrender.com/api"
            : "http://localhost:8080/api"),

    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let redirectingToLogin = false;

api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;
        const token = localStorage.getItem("token");

        const requestUrl: string =
            error.config?.url ?? "";

        const isAuthRequest =
            requestUrl.includes("/auth/login") ||
            requestUrl.includes("/auth/register");

        const tokenIsInvalid =
            status === 401 || status === 403;

        if (
            tokenIsInvalid &&
            token &&
            !isAuthRequest &&
            !redirectingToLogin
        ) {
            redirectingToLogin = true;

            localStorage.removeItem("token");
            window.location.replace("/login");
        }

        return Promise.reject(error);
    },
);

export default api;
import { Navigate } from "react-router";
import type { ReactNode } from "react";

import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = useAppSelector(
        (state) => state.auth.isAuthenticated,
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface VerificationStep {
    key: string;
    path: string;
    condition?: (user: any) => boolean;
}

interface PrivateRouteProps {
    loginPath?: string;
    checks?: VerificationStep[];
    finalRedirectPath?: string; // Renombrado de defaultPath
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
    loginPath = "/login",
    checks = [],
    finalRedirectPath = "/",
}) => {
    const { getToken, getUser } = useAuth();
    const isAuthenticated = !!getToken();
    const user = getUser();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={loginPath} replace />;
    }

    // Filtra las verificaciones que aún no se han completado
    const pendingChecks = checks.filter(({ key, condition }) =>
        condition ? !condition(user) : !user?.[key]
    );

    const isOnVerificationPage = checks.some(({ path }) => location.pathname === path);

    if (pendingChecks.length > 0) {
        const nextCheck = pendingChecks[0]; // Toma la primera verificación pendiente
        if (location.pathname !== nextCheck.path) {
            return <Navigate to={nextCheck.path} replace />;
        }
    }
    // ✅ Solo redirigir a finalRedirectPath si el usuario estaba en una página de verificación
    else if (isOnVerificationPage && location.pathname !== finalRedirectPath) {
        return <Navigate to={finalRedirectPath} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;

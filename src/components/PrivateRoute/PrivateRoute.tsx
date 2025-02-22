import React, { useEffect, useState } from "react";
import { Location, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const useSafeLocation = () => {
    const [location, setLocation] = useState<Location | null>(null);

    useEffect(() => {
        try {
            setLocation(useLocation());
        } catch (error) {
            console.warn("useLocation() was used outside of a Router");
        }
    }, []);

    return location;
};


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
    const location: any = useSafeLocation();
    // ⚠️ **NO renderizar hasta que el Router esté disponible**
    if (!location) return null;
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

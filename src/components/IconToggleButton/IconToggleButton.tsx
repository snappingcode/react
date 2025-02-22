import React, { useState } from "react";
import { httpClient, HttpClient, securedHttpClient } from "../../httpClient";
import Loader from "../Loader/Loader";
import IconButton from "../buttons/IconButton/IconButton";


interface IconToggleButtonProps {
    value: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string; // Clase CSS opcional
    style?: React.CSSProperties; // Estilo en línea opcional
    apiBaseUrl?: string; // Base URL para el cliente HTTP
    endpoint: string; // Endpoint para la solicitud
    useSecureConnection?: boolean; // Define si se usa el cliente seguro
    onChangeSuccess?: (newValue: boolean) => void; // Callback en caso de éxito
    onChangeError?: (error: any) => void; // Callback en caso de error
    activeIcon: string; // Ícono cuando el valor es true
    inactiveIcon: string; // Ícono cuando el valor es false
    activeColor?: string; // Color del ícono cuando el valor es true
    inactiveColor?: string; // Color del ícono cuando el valor es false
}

const loaderSizeMap: Record<"xs" | "sm" | "md" | "lg" | "xl", number> = {
    xs: 16,
    sm: 20,
    md: 30,
    lg: 38,
    xl: 46,
};

const paddingMap: Record<"xs" | "sm" | "md" | "lg" | "xl", number> = {
    xs: 8,
    sm: 8,
    md: 7,
    lg: 7,
    xl: 7,
};

const IconToggleButton: React.FC<IconToggleButtonProps> = ({
    value,
    size = "md",
    className,
    style,
    apiBaseUrl,
    endpoint,
    useSecureConnection = false,
    onChangeSuccess,
    onChangeError,
    activeIcon,
    inactiveIcon,
    activeColor = "primary",
    inactiveColor = "text",
}) => {
    const [processing, setProcessing] = useState(false);

    // Selecciona el cliente HTTP adecuado
    const client: HttpClient = useSecureConnection ? securedHttpClient : httpClient;

    // Configura la base URL si está definida
    if (apiBaseUrl) {
        client.setBaseURL(apiBaseUrl);
    }

    const handleClick = async () => {
        setProcessing(true);
        try {
            // Simula una demora de 2 segundos
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // Alterna el valor y realiza la solicitud
            const newValue = !value;
            await client.post(endpoint, { value: newValue });

            // Callback de éxito
            if (onChangeSuccess) {
                onChangeSuccess(newValue);
            }

            setProcessing(false);
        } catch (error: any) {
            console.error("Error while toggling state:", error);

            // Callback de error
            if (onChangeError) {
                onChangeError(error);
            }

            setProcessing(false);
        }
    };

    return (
        <div
            className={`precooked-icon-toggle-button ${className || ""}`}
            style={{ ...style }}
        >
            {processing ? (
                <div
                    style={{
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingRight: paddingMap[size],
                        paddingLeft: paddingMap[size],
                    }}
                >
                    <Loader color="primary" size={loaderSizeMap[size]} />
                </div>
            ) : (
                <IconButton
                    type="clear"
                    hasShadow={false}
                    color={value ? activeColor : inactiveColor}
                    onClick={handleClick}
                    icon={value ? activeIcon : inactiveIcon}
                    size={size}
                />
            )}
        </div>
    );
};

export default IconToggleButton;

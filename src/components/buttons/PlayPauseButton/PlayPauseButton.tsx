import React, { useState } from "react";
import { httpClient, HttpClient, securedHttpClient } from "../../../httpClient";
import Loader from "../../Loader/Loader";
import IconButton from "../IconButton/IconButton";
import themeColors from "../../../config/themeColors";


interface PlayPauseButtonProps {
    value: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string; // Agregada la propiedad className opcional
    style?: React.CSSProperties; // Agregada la propiedad style opcional
    apiBaseUrl?: string; // Base URL para el cliente HTTP
    endpoint: string; // Endpoint para realizar la solicitud
    useInterceptor?: boolean; // Indica si debe usar interceptores para el cliente HTTP
    onChangeSuccess?: (newValue: boolean) => void; // Callback para manejar éxito
    onChangeError?: (error: any) => void; // Callback para manejar errores
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

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
    value = true,
    size = "md",
    className,
    style,
    apiBaseUrl,
    endpoint,
    useInterceptor = false,
    onChangeSuccess,
    onChangeError,
}) => {
    const [processing, setProcessing] = useState(false);

    // Selecciona el cliente HTTP adecuado
    const client: HttpClient = useInterceptor ? securedHttpClient : httpClient;

    // Configura la base URL si está definida
    if (apiBaseUrl) {
        client.setBaseURL(apiBaseUrl);
    }

    const handleClick = async () => {
        setProcessing(true);
        try {
            // Simula una demora de 2 segundos (2000 ms)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // Realiza la solicitud al endpoint
            const newValue = !value; // Alterna el valor
            await client.post(endpoint, { value: newValue }); // Envía el nuevo estado al servidor

            // Llama al callback de éxito si está definido
            if (onChangeSuccess) {
                onChangeSuccess(newValue);
            }

            setProcessing(false);
        } catch (error: any) {
            console.error("Error while toggling play/pause:", error);

            // Llama al callback de error si está definido
            if (onChangeError) {
                onChangeError(error);
            }

            setProcessing(false);
        }
    };

    return (
        <div className={`precooked-play-pause-button ${className}`} style={{ ...style }}>
            {processing ? (
                <div
                    style={{
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingRight: paddingMap[size],
                        paddingLeft: paddingMap[size],
                    }}
                >
                    <Loader color={"primary"} size={loaderSizeMap[size]} />
                </div>
            ) : (
                <IconButton
                    type="clear"
                    hasShadow={false}
                    color={value ? "primary" : themeColors.textTint}
                    onClick={handleClick}
                    icon={value ? "pause" : "play"}
                    size={size}
                />
            )}
        </div>
    );
};

export default PlayPauseButton;

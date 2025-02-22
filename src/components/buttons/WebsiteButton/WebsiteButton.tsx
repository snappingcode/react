import React from "react";
import Button from "../Button/Button";
import { themeColors } from "../../../config";

interface WebsiteButtonProps {
    url: string; // URL del sitio web
    title?: string; // Texto del botón
    style?: React.CSSProperties; // Estilos personalizados
    icon?: string; // Ícono para el botón
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    disabled?: boolean;
    borderRadius?: number;
    type?: "clear" | "outline" | "solid";
    color?: keyof typeof themeColors | string;
}

const WebsiteButton: React.FC<WebsiteButtonProps> = ({
    url,
    title = "Visitar sitio",
    style,
    icon = "world", // Usa un ícono relacionado desde tu configuración
    color = "primary",
    borderRadius = 4,
    type = "solid",
    disabled = false,
    size = "md",
}) => {
    const handleClick = () => {
        window.open(url, "_blank"); // Abrir el sitio en una nueva pestaña
    };

    return (
        <Button
            title={title}
            onClick={handleClick}
            startIcon={icon}
            style={style}
            color={color}
            borderRadius={borderRadius}
            type={type}
            disabled={disabled}
            size={size}
        />
    );
};

export default WebsiteButton;

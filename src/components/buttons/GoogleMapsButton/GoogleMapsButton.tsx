import React from "react";
import Button from "../Button/Button";
import { themeColors } from "../../../config";


interface GoogleMapsButtonProps {
    address: string; // Dirección o coordenadas (formato de texto)
    title?: string; // Texto del botón
    style?: React.CSSProperties; // Estilos personalizados
    icon?: string; // Ícono para el botón
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    disabled?: boolean;
    borderRadius?: number;
    type?: "clear" | "outline" | "solid";
    color?: keyof typeof themeColors | string;
}

const GoogleMapsButton: React.FC<GoogleMapsButtonProps> = ({
    address,
    title = "Cómo llegar",
    style,
    icon = "marker", // Usa un ícono relacionado desde tu configuración
    color = "info",
    borderRadius = 4,
    type = "solid",
    disabled = false,
    size = "md",
}) => {
    const handleClick = () => {
        const url = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
        window.open(url, "_blank"); // Abrir Google Maps en una nueva pestaña
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

export default GoogleMapsButton;

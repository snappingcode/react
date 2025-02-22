import React from "react";
import Button from "../Button/Button";
import { themeColors } from "../../../config";


interface WhatsAppButtonProps {
    phoneNumber: string; // Número al que enviar el mensaje (formato internacional sin '+')
    message: string; // Mensaje precargado
    title?: string; // Texto del botón
    style?: React.CSSProperties; // Estilos personalizados
    icon?: string; // Ícono para WhatsApp
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    disabled?: boolean;
    borderRadius?: number;
    type?: "clear" | "outline" | "solid";
    color?: keyof typeof themeColors | string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
    phoneNumber,
    message,
    title = "Enviar WhatsApp",
    style,
    icon = "whatsApp", // Usa un ícono relacionado desde tu configuración
    color = "success",
    borderRadius = 4,
    type = "solid",
    disabled = false,
    size = "md",
}) => {
    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank"); // Abrir en una nueva pestaña
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

export default WhatsAppButton;

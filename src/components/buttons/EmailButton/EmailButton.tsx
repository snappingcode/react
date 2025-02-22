import React from "react";
import Button from "../Button/Button";
import { themeColors } from "../../../config";


interface EmailButtonProps {
    email: string; // Dirección de correo electrónico
    subject?: string; // Asunto del correo
    body?: string; // Cuerpo del mensaje
    title?: string; // Texto del botón
    style?: React.CSSProperties; // Estilos personalizados
    icon?: string; // Ícono para el botón
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    disabled?: boolean;
    borderRadius?: number;
    type?: "clear" | "outline" | "solid";
    color?: keyof typeof themeColors | string;
}

const EmailButton: React.FC<EmailButtonProps> = ({
    email,
    subject = "",
    body = "",
    title = "Enviar correo",
    style,
    icon = "email", // Usa un ícono relacionado desde tu configuración
    color = "warning",
    borderRadius = 4,
    type = "solid",
    disabled = false,
    size = "md",
}) => {
    const handleClick = () => {
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = url; // Redirige al enlace de correo
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

export default EmailButton;

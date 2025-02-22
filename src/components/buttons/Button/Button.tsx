import React, { useState, forwardRef } from "react";

import TypingEffect from "../../TypingEffect/TypingEffect";
import { themeColors } from "../../../config";
import Icon from "../../Icon/Icon";
import DynamicIcon from "../../DynamicIcon/DynamicIcon";
import Touchable from "../../Touchable/Touchable";


const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};

const isDarkColor = (color: string) => {
    const rgb = hexToRgb(color);
    if (!rgb) return false;

    const { r, g, b } = rgb;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
};

const resolveIcon = (
    icon: string | undefined,
    paths?: any[],
    size?: number,
    color?: string,
    style?: React.CSSProperties
) => {

    if (icon) {
        return <div style={{ flex: 1 }}>
            <Icon name={icon} size={size} color={color} style={{
                position: 'relative',
                top: 1,
                ...style
            }} />
        </div>;
    } else if (paths) {
        return <div style={{ flex: 1 }}><DynamicIcon paths={paths} size={size} style={{
            position: 'relative',
            top: 1,
            ...style
        }} /></div>;
    }
    return null;
};

interface ButtonProps {
    title: string;
    onClick: () => void;
    color?: keyof typeof themeColors | string;
    borderRadius?: number;
    type?: "clear" | "outline" | "solid";
    disabled?: boolean;
    startIcon?: string;
    startIconPaths?: string[];
    startIconSize?: number;
    startIconStyle?: React.CSSProperties;
    startIconColor?: string;
    endIcon?: string;
    endIconPaths?: string[];
    endIconSize?: number;
    endIconStyle?: React.CSSProperties;
    endIconColor?: string;
    hasShadow?: boolean;
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string;
    animateTitle?: boolean;
    animationSpeed?: number; // Nueva prop
    onAnimationComplete?: () => void; // Nueva prop
}

const sizeStyles = {
    xs: { padding: "4px", fontSize: "10px", iconSize: 12 },
    sm: { padding: "6px", fontSize: "12px", iconSize: 16 },
    md: { padding: "10px", fontSize: "16px", iconSize: 24 },
    lg: { padding: "14px", fontSize: "18px", iconSize: 32 },
    xl: { padding: "18px", fontSize: "22px", iconSize: 40 },
};

const Button = forwardRef<HTMLDivElement, ButtonProps>(
    (props, ref) => {
        const {
            title,
            onClick,
            color = "primary",
            borderRadius = 4,
            type = "solid",
            disabled = false,
            startIcon,
            startIconPaths,
            startIconSize,
            startIconStyle,
            startIconColor,
            endIcon,
            endIconPaths,
            endIconSize,
            endIconStyle,
            endIconColor,
            hasShadow = true,
            style,
            titleStyle,
            size = "md",
            className = "button",
            animateTitle = false,
            animationSpeed = 50, // Velocidad predeterminada
            onAnimationComplete, // Callback opcional
        } = props;

        const [isPressed, setIsPressed] = useState(false);
        const [showEndIcon, setShowEndIcon] = useState(!animateTitle);

        const handlePressStart = () => {
            if (!disabled) {
                setIsPressed(true);
            }
        };

        const handlePressEnd = () => {
            if (!disabled) {
                setIsPressed(false);
            }
        };

        const handleAnimationComplete = () => {
            setShowEndIcon(true); // Mostrar el ícono derecho al completar la animación
            if (onAnimationComplete) {
                onAnimationComplete(); // Disparar el callback
            }
        };

        const iconSize = sizeStyles[size]?.iconSize;

        const resolvedColor = color in themeColors ? themeColors[color as keyof typeof themeColors] : color;

        const contentColor =
            type === "solid"
                ? isDarkColor(resolvedColor || "")
                    ? "#fff"
                    : themeColors.textShade
                : resolvedColor;

        const buttonStyle: React.CSSProperties = {
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            padding: sizeStyles[size]?.padding,
            borderRadius: `${borderRadius}px`,
            border: type === "outline" ? `2px solid ${resolvedColor}` : "none",
            backgroundColor: type === "solid" ? resolvedColor : "transparent",
            color: contentColor,
            boxShadow: hasShadow
                ? isPressed
                    ? "none"
                    : "0px 2px 0px rgba(0, 0, 0, 0.15)"
                : "none",
            transform: isPressed ? "scale(0.98)" : "scale(1)",
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.2s ease-in-out",
            opacity: disabled ? 0.6 : 1,
            boxSizing: "border-box",

            ...style,
        };

        const textStyle: React.CSSProperties = {
            fontSize: sizeStyles[size]?.fontSize,
            margin: "0 8px",
            color: contentColor,
            position: "relative",
            top: -1,
            ...titleStyle,
        };

        return (
            <Touchable className={className} onClick={onClick} style={buttonStyle} disabled={disabled}>
                <button
                    onClick={(e) => e.preventDefault()}
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    style={{
                        border: "none",
                        backgroundColor: "transparent",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "inherit",
                        outline: "none",
                        padding: 0
                    }}
                    disabled={disabled}
                >
                    {resolveIcon(
                        startIcon,
                        startIconPaths,
                        startIconSize ?? iconSize,
                        startIconColor ?? contentColor,
                        startIconStyle
                    )}
                    {animateTitle ? (
                        <TypingEffect
                            text={title}
                            speed={animationSpeed} // Usar la velocidad definida
                            style={textStyle}
                            showCursor={true}
                            onComplete={handleAnimationComplete}
                        />
                    ) : (
                        <span style={textStyle}>{title}</span>
                    )}
                    {showEndIcon &&
                        resolveIcon(
                            endIcon,
                            endIconPaths,
                            endIconSize ?? iconSize,
                            endIconColor ?? contentColor,
                            endIconStyle
                        )}
                </button>
            </Touchable>
        );

    }
)
export default Button;

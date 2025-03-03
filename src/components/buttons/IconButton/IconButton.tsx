import React, { useState, forwardRef } from "react";
import Icon from "../../Icon/Icon";
import DynamicIcon from "../../DynamicIcon/DynamicIcon";
import themeColors from "../../../config/themeColors";
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
    color?: string
) => {
    if (icon) {
        return <Icon name={icon} size={size} color={color} style={{
            display: 'block'
        }} />;
    } else if (paths) {
        return <DynamicIcon paths={paths} size={size} />;
    }
    return null;
};

interface IconButtonProps {
    onClick: () => void;
    color?: keyof typeof themeColors | string;
    borderRadius?: number;
    type?: "clear" | "outline" | "solid";
    disabled?: boolean;
    icon?: string;
    iconPaths?: any[];
    iconSize?: number;
    hasShadow?: boolean;
    style?: React.CSSProperties;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeStyle = {
    xs: { size: 32, iconSize: 16 },
    sm: { size: 36, iconSize: 18 },
    md: { size: 44, iconSize: 24 },
    lg: { size: 52, iconSize: 32 },
    xl: { size: 60, iconSize: 40 },
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
    onClick,
    color = "primary",
    borderRadius = 22,
    type = "solid",
    disabled = false,
    icon,
    iconPaths,
    iconSize,
    hasShadow = true,
    style,
    size = "md"
}, ref) => {
    const [isPressed, setIsPressed] = useState(false);

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

    const buttonSize = sizeStyle[size].size;
    const calculatedIconSize = iconSize ?? sizeStyle[size].iconSize;

    const resolvedColor = color in themeColors ? themeColors[color as keyof typeof themeColors] : color;
    const iconColor =
        type === "solid"
            ? isDarkColor(resolvedColor || "")
                ? "#fff"
                : themeColors.textShade
            : resolvedColor;

    const buttonStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        borderRadius: `${borderRadius}px`,
        border: type === "outline" ? `2px solid ${resolvedColor}` : "none",
        backgroundColor: type === "solid" ? resolvedColor : "transparent",
        // boxShadow: hasShadow
        //     ? isPressed
        //         ? "none"
        //         : "0px 2px 5px rgba(0, 0, 0, 0.2)"
        //     : "none",
        filter: hasShadow
            ? isPressed
                ? "none"
                : "drop-shadow(0 1.5px 0 #ccc)"
            : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease-in-out",
        opacity: disabled ? 0.6 : 1,
        position: "relative",
        boxSizing: "border-box",
        //flex: 1,
        ...style,
    };

    return (
        <Touchable onClick={onClick} style={buttonStyle}>
            <button
                ref={ref}
                onClick={(e) => e.preventDefault()}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                style={{
                    position: "absolute",
                    //width: "100%",
                    height: "100%",
                    border: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    outline: "none"
                }}
                disabled={disabled}
            >
                {resolveIcon(icon, iconPaths, calculatedIconSize, iconColor)}
            </button>
        </Touchable>
    );
});

IconButton.displayName = "IconButton";

export default IconButton;

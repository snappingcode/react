import React, { useState, forwardRef } from "react";
import Icon from "../../Icon/Icon";
import DynamicIcon from "../../DynamicIcon/DynamicIcon";
import themeColors from "../../../config/themeColors";
import Touchable from "../../Touchable/Touchable";
import { HttpClient, httpClient, securedHttpClient } from "../../../httpClient";
import Loader from "../../Loader/Loader";

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

interface ActionIconButtonProps {
    onClick: () => void;
    color?: keyof typeof themeColors | string;
    borderRadius?: number;
    type?: "clear" | "outline" | "solid";
    disabled?: boolean;
    icon?: string;
    iconPaths?: any[];
    iconSize?: number;
    hasShadow?: boolean;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    apiBaseUrl?: string;
    path?: string;
    useAuthToken?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    data?: Record<string, any>;

    spinnerColor?: string;
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
}

const sizeStyles = {
    xs: { size: 32, iconSize: 16, loaderSize: 16 },
    sm: { size: 36, iconSize: 18, loaderSize: 18 },
    md: { size: 44, iconSize: 24, loaderSize: 24 },
    lg: { size: 52, iconSize: 32, loaderSize: 32 },
    xl: { size: 60, iconSize: 40, loaderSize: 40 },
};

const ActionIconButton = forwardRef<HTMLButtonElement, ActionIconButtonProps>(({
    onClick,
    color = "primary",
    borderRadius = 22,
    type = "solid",
    disabled = false,
    icon,
    iconPaths,
    iconSize,
    hasShadow = true,
    containerStyle,
    buttonStyle,
    size = "md",
    apiBaseUrl,
    path,
    useAuthToken,
    method = "POST",
    data,
    onSuccess,
    onError,

    spinnerColor,
}, ref) => {
    const [processing, setProcessing] = useState(false);
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
    const handleClick = async () => {

        if (onClick) onClick();
        if (!path) return;

        try {
            setProcessing(true);
            const client = useAuthToken ? securedHttpClient : httpClient;
            if (apiBaseUrl) client.setBaseURL(apiBaseUrl);

            const methodKey = method.toLowerCase() as keyof Pick<HttpClient, 'get' | 'post' | 'put' | 'delete'>;

            const response = await client[methodKey](path, data);
            if (onSuccess) onSuccess(response);
        } catch (error) {
            console.log('data:' + JSON.stringify(data))
            if (onError) onError(error);
        } finally {
            setProcessing(false);
        }
    };
    const buttonSize = sizeStyles[size].size;
    const calculatedIconSize = iconSize ?? sizeStyles[size].iconSize;

    const resolvedColor = color in themeColors ? themeColors[color as keyof typeof themeColors] : color;
    const iconColor =
        type === "solid"
            ? isDarkColor(resolvedColor || "")
                ? "#fff"
                : themeColors.textShade
            : resolvedColor;

    //const buttonStyle: React.CSSProperties = ;

    return (
        <div style={{ ...containerStyle }}>
            {processing ? (
                <Loader color={spinnerColor || "primary"} size={sizeStyles[size]?.loaderSize} />
            ) :
                <Touchable onClick={handleClick} style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
                    borderRadius: `${borderRadius}px`,
                    border: type === "outline" ? `2px solid ${resolvedColor}` : "none",
                    backgroundColor: type === "solid" ? resolvedColor : "transparent",
                    boxShadow: hasShadow
                        ? isPressed
                            ? "none"
                            : "0px 2px 5px rgba(0, 0, 0, 0.2)"
                        : "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease-in-out",
                    opacity: disabled ? 0.6 : 1,
                    position: "relative",
                    boxSizing: "border-box",
                    //flex: 1,
                    ...buttonStyle,
                }}>
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
                            //cursor: "pointer",
                            cursor: disabled ? "not-allowed" : "pointer",
                            backgroundColor: "transparent",
                            outline: "none"
                        }}
                        disabled={disabled}
                    >
                        {resolveIcon(icon, iconPaths, calculatedIconSize, iconColor)}
                    </button>
                </Touchable>}

        </div>

    );
});

ActionIconButton.displayName = "ActionIconButton";

export default ActionIconButton;

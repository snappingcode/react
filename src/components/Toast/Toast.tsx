import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import themeColors from "../../config/themeColors";
import IconButton from "../buttons/IconButton/IconButton";

interface ToastProps {
    title?: string;
    message: string;
    color?: string;
    onClose?: () => void;
    duration?: number;
    isOpen: boolean;
    containerStyle?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    messageStyle?: React.CSSProperties;
}

const screenWidth = window.innerWidth;
const isMobile = screenWidth < 768;

const Toast: React.FC<ToastProps> = ({
    title,
    message,
    color,
    onClose,
    duration = 3000,
    isOpen,
    containerStyle,
    titleStyle,
    messageStyle,
}) => {
    const [show, setShow] = useState(isOpen);

    const keyframesShow = `
        @keyframes toastShow {
            from {
                transform: translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;

    const keyframesHide = `
        @keyframes toastHide {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100px);
                opacity: 0;
            }
        }
    `;

    const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>({
        animation: isOpen
            ? `toastShow 0.3s ease-in-out forwards`
            : `toastHide 0.3s ease-in forwards`,
    });

    useEffect(() => {
        if (isOpen) {
            setShow(true);
            setAnimationStyle({
                animation: `toastShow 0.3s ease-in-out forwards`,
            });
        } else {
            setAnimationStyle({
                animation: `toastHide 0.3s ease-in forwards`,
            });
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && duration > 0) {
            const timeout = setTimeout(() => onClose?.(), duration);
            return () => clearTimeout(timeout);
        }
    }, [isOpen, duration, onClose]);

    return show
        ? ReactDOM.createPortal(
            <>
                <style>
                    {keyframesShow}
                    {keyframesHide}
                </style>
                <div
                    style={{
                        ...animationStyle,
                        position: "fixed",
                        padding: "20px",
                        borderRadius: "5px",
                        backgroundColor: color || themeColors.primary,
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bottom: isMobile ? 20 : 50,
                        left: isMobile ? 20 : 50,
                        right: isMobile ? 20 : "auto",
                        zIndex: 1000,
                        width: isMobile ? "90%" : "auto",
                        boxSizing: "border-box",
                        ...containerStyle,
                    }}
                >
                    <div style={{}}>
                        {title && (
                            <strong
                                style={{
                                    color: themeColors.textShade,
                                    fontSize: "18px",
                                    ...titleStyle,
                                }}
                            >
                                {title}
                            </strong>
                        )}
                        <p
                            style={{
                                color: themeColors.textShade,
                                fontSize: "16px",
                                margin: 0,
                                ...messageStyle,
                            }}
                        >
                            {message}
                        </p>
                    </div>
                    {onClose && (

                        <IconButton
                            style={{
                                marginLeft: "10px",
                                //flex: 1,
                                //background: 'red'
                            }}
                            icon="close"
                            color={themeColors.textShade}

                            onClick={onClose}
                            type="clear"
                            size="xs"
                            hasShadow={false}
                        />


                    )}
                </div>
            </>,
            document.body
        )
        : null;
};

export default Toast;

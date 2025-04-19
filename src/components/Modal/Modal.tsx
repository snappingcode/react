import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom"; // Importa ReactDOM

import { themeColors } from "../../config";
import IconButton from "../buttons/IconButton/IconButton";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAnimationComplete?: () => void;
    children: React.ReactNode;
    backdropStyle?: React.CSSProperties;
    windowStyle?: React.CSSProperties;
    closeButtonStyle?: React.CSSProperties;
    closeIcon?: string;
    closeIconSize?: number;
    closeIconPaths?: any[];
    zIndex?: number;
    fullScreen?: boolean;
    showCloseButton?: boolean;
    id?: string;
}

const Modal: React.FC<ModalProps> = React.memo(({
    isOpen,
    onClose,
    onAnimationComplete,
    children,
    backdropStyle,
    windowStyle,
    closeButtonStyle,
    closeIconSize = 24,
    closeIcon = "close",
    closeIconPaths,
    zIndex = 1000,
    fullScreen = false,
    showCloseButton = true,
    id
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [opacity, setOpacity] = useState(0);
    const [translateY, setTranslateY] = useState(100);
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const root = document.createElement('div');
        root.id = id || 'modal-root';
        document.body.appendChild(root);
        setModalRoot(root);

        return () => {
            document.body.removeChild(root);
        };
    }, [id]);

    useEffect(() => {
        console.log(isOpen)
        let interval: NodeJS.Timeout | null = null;

        if (isOpen) {
            setIsVisible(true);
            interval = setInterval(() => {
                setOpacity((prev) => Math.min(prev + 0.1, 1));
                setTranslateY((prev) => Math.max(prev - 10, 0));
            }, 30);
            // setTimeout(() => {
            //     if (onAnimationComplete) onAnimationComplete();
            // }, 500);
        } else {
            interval = setInterval(() => {
                setOpacity((prev) => Math.max(prev - 0.1, 0));
                setTranslateY((prev) => Math.min(prev + 10, 100));
                if (opacity <= 0.1) {
                    clearInterval(interval!);
                }
            }, 30);
            setTimeout(() => {
                setIsVisible(false);
                //     if (onAnimationComplete) onAnimationComplete();
            }, 500);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }

        };
    }, [isOpen, opacity]);
    useEffect(() => {
        setTimeout(() => {
            if (onAnimationComplete) onAnimationComplete();
        }, 500);
    }, [isOpen])

    const handleClose = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    }, [onClose]);

    if (!isVisible || !modalRoot) return null;

    return ReactDOM.createPortal(
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: zIndex,
                opacity: opacity,
                ...backdropStyle,
            }}
            onClick={handleClose}
        >
            <div
                style={{
                    position: "relative",
                    backgroundColor: "white",
                    borderRadius: fullScreen ? 0 : 8,
                    padding: "0px",
                    width: "100%",
                    height: "100%",
                    maxWidth: fullScreen ? "none" : "500px",
                    maxHeight: fullScreen ? "none" : "80vh",
                    //overflow: "auto",
                    transform: `translateY(${translateY}px)`,
                    ...windowStyle,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {showCloseButton && (
                    <IconButton
                        icon={closeIcon}
                        iconSize={closeIconSize}
                        iconPaths={closeIconPaths}
                        style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            zIndex: 1,
                            ...closeButtonStyle
                        }}
                        type={'clear'}
                        hasShadow={false}
                        color={themeColors.text}
                        onClick={onClose}
                    />
                )}
                {children}
            </div>
        </div>,
        modalRoot
    );
});

export default Modal;
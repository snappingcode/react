import React, { useState, useEffect, useCallback, useRef } from "react";
import Portal from "../Portal/Portal";
import IconButton from "../buttons/IconButton/IconButton";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    backdropStyle?: React.CSSProperties;
    windowStyle?: React.CSSProperties;
    closeButtonStyle?: React.CSSProperties;
    closeIcon?: string;
    closeIconPaths?: any[];
    closeIconSize?: number;
    zIndex?: number;
    id?: string;
    fullScreen?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    backdropStyle,
    windowStyle,
    closeButtonStyle,
    closeIcon = "close",
    closeIconPaths,
    closeIconSize = 24,
    zIndex = 999,
    id,
    fullScreen = false,
}) => {
    const [isVisible, setIsVisible] = useState(isOpen);
    const backdropRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    // useEffect(() => {
    //     if (isOpen) {
    //         setIsVisible(true);
    //         document.addEventListener("keydown", handleKeyPress);
    //     } else {
    //         document.removeEventListener("keydown", handleKeyPress);
    //     }
    //     return () => document.removeEventListener("keydown", handleKeyPress);
    // }, [isOpen, handleKeyPress]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (backdropRef.current && windowRef.current) {
                    backdropRef.current.style.opacity = "1";
                    windowRef.current.style.transform = "translateY(0)";
                }
            }, 50);
        } else {
            if (backdropRef.current && windowRef.current) {
                backdropRef.current.style.opacity = "0";
                windowRef.current.style.transform = "translateY(100%)";
                setTimeout(() => setIsVisible(false), 300);
            }
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <Portal>
            <div
                ref={backdropRef}
                {...(id ? { id } : {})}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease-in-out",
                    zIndex: zIndex,
                    ...backdropStyle,
                }}
                onClick={onClose}
            >
                <div
                    ref={windowRef}
                    style={{
                        position: "relative",
                        backgroundColor: "#fff",
                        borderRadius: fullScreen ? "0px" : "8px",
                        padding: fullScreen ? "0" : "20px",
                        maxWidth: fullScreen ? "100%" : "500px",
                        width: fullScreen ? "100%" : "90%",
                        height: fullScreen ? "100%" : "auto",
                        boxShadow: fullScreen ? "none" : "0px 5px 15px rgba(0, 0, 0, 0.3)",
                        transform: "translateY(100%)",
                        transition: "transform 0.3s ease-in-out",
                        minHeight: fullScreen ? "100%" : "80%",
                        //...windowStyle,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <IconButton
                        onClick={onClose}
                        icon={closeIcon}
                        iconPaths={closeIconPaths}
                        iconSize={closeIconSize}
                        type="clear"
                        hasShadow={false}
                        color="text"
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            zIndex: 1,
                            ...closeButtonStyle,
                        }}
                    />
                    <div
                        style={{
                            overflowY: "auto",
                            position: "absolute",
                            top: "0",
                            left: "10px",
                            right: "10px",
                            bottom: "0",
                            ...windowStyle,
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default Modal;

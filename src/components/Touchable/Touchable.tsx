import React, { useState, useEffect } from "react";

interface TouchableProps {
    onClick?: () => void;
    style?: React.CSSProperties;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

const Touchable: React.FC<TouchableProps> = ({ onClick, children, style = {}, className, disabled = false, }) => {
    const [rippleStyle, setRippleStyle] = useState({});

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes ripple-effect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRippleStyle = {
            width: `${size}px`,
            height: `${size}px`,
            top: `${y}px`,
            left: `${x}px`,
            position: "absolute" as "absolute",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            transform: "scale(0)",
            animation: "ripple-effect 0.6s linear",
            pointerEvents: "none" as "none",
        };

        setRippleStyle(newRippleStyle);

        setTimeout(() => setRippleStyle({}), 500);
    };

    return (
        <div
            onClick={() => {
                !disabled && onClick ? onClick() : null
            }}
            onMouseDown={createRipple}
            style={{
                position: "relative",
                overflow: "hidden",
                display: "inline-block",
                ...style
            }}
            className={className}

        >
            {children}
            <span style={rippleStyle}></span>
        </div>
    );
};

export default Touchable;

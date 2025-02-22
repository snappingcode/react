import React, { useState, useEffect } from "react";
import TypingEffect from "../TypingEffect/TypingEffect";
import ButtonGroup from "../ButtonGroup/ButtonGroup";

interface ContentAnimatorProps {
    content: Array<{
        type: string;
        content?: string;
        url?: string;
        style?: React.CSSProperties;
        buttons?: Array<{
            title: string;
            color?: string;
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
            type?: "outline" | "clear" | "solid";
            size?: "xs" | "sm" | "md" | "lg" | "xl";
            style?: React.CSSProperties;
            titleStyle?: React.CSSProperties;
            onClick?: (data: any) => void;
        }>;
    }>;
    speed?: number;
    containerStyle?: React.CSSProperties;
    onComplete?: () => void; // Nueva prop para detectar cuando termina toda la animación
}

const ContentAnimator: React.FC<ContentAnimatorProps> = ({ content, speed = 50, containerStyle, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Manejo automático para "line-break"
        if (content[currentIndex]?.type === "lineBreak") {
            const timeout = setTimeout(() => {
                if (currentIndex < content.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                } else if (onComplete) {
                    onComplete(); // Llamar a onComplete al final
                }
            }, speed * 2);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, content, speed, onComplete]);

    const handleComplete = () => {
        if (currentIndex < content.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (onComplete) {
            onComplete(); // Llamar a onComplete al terminar el último ítem
        }
    };

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", ...containerStyle }}>
            {content.slice(0, currentIndex + 1).map((item, index) => {
                if (item.type === "text") {
                    return (
                        <TypingEffect
                            key={index}
                            text={item.content || ""}
                            speed={speed}
                            style={item.style}
                            showCursor={index === currentIndex}
                            onComplete={index === currentIndex ? handleComplete : undefined}
                        />
                    );
                } else if (item.type === "link") {
                    return (
                        <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ ...item.style, textDecoration: "none" }}
                        >
                            <TypingEffect
                                text={item.content || ""}
                                speed={speed}
                                showCursor={index === currentIndex}
                                onComplete={index === currentIndex ? handleComplete : undefined}
                            />
                        </a>
                    );
                } else if (item.type === "lineBreak") {
                    return <div key={index} style={{ flexBasis: "100%" }} />;
                } else if (item.type === "buttonGroup") {
                    return (
                        <ButtonGroup
                            key={index}
                            buttons={item.buttons || []}
                            containerStyle={item.style}
                            enableAnimation={true}
                            onAnimationComplete={index === currentIndex ? handleComplete : undefined}
                        />
                    );
                } else {
                    return null;
                }
            })}
        </div>
    );
};

export default ContentAnimator;

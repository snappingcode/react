import React, { useState, useEffect } from "react";

interface TypingEffectProps {
    text: string;
    speed?: number;
    loop?: boolean;
    style?: React.CSSProperties;
    showCursor?: boolean;
    onComplete?: () => void; // Function that is executed when you finish writing
}

const TypingEffect: React.FC<TypingEffectProps> = ({
    text,
    speed = 50,
    loop = false,
    style,
    showCursor = true,
    onComplete,
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[index]);
                setIndex((prev) => prev + 1);
            }, speed);

            return () => clearTimeout(timeout); // Clear timeout
        } else {
            setIsTyping(false);
            if (onComplete) {
                onComplete(); // Call function on completion
            }
            if (loop) {
                const timeout = setTimeout(() => {
                    setDisplayedText("");
                    setIndex(0);
                    setIsTyping(true);
                }, speed * 3); // Pause before restart

                return () => clearTimeout(timeout);
            }
        }
    }, [index, text, speed, loop]);

    return (
        <span style={style}>
            {displayedText}
            {showCursor && isTyping && <span className="blinking-cursor">|</span>}
        </span>
    );
};

export default TypingEffect;

import React, { useEffect, useState } from 'react';
import Button from "../buttons/Button/Button";
import { themeColors } from "../../config";

interface ButtonType {
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
    extraData?: any; // Nueva prop para información adicional
    onClick?: (extraData: any) => void; // Ahora retorna directamente `extraData`
}

interface ButtonGroupProps {
    buttons: ButtonType[];
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    enableAnimation?: boolean; // Enable or disable animation
    animationSpeed?: number; // Speed of the animation
    onAnimationComplete?: () => void; // Callback when animation completes
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
    buttons,
    containerStyle,
    buttonStyle,
    enableAnimation = false,
    animationSpeed = 20,
    onAnimationComplete,
}) => {
    // State to track the completion of each button's animation
    const [animationStates, setAnimationStates] = useState<Record<string, boolean>>(
        () => buttons.reduce((acc, item) => ({ ...acc, [item.title]: false }), {})
    );

    useEffect(() => {
        // Check if all animations are complete
        const allAnimationsComplete = Object.values(animationStates).every((state) => state);
        if (allAnimationsComplete) {
            onAnimationComplete?.();
        }
    }, [animationStates, onAnimationComplete]);

    const handleAnimationComplete = (title: string) => {
        setAnimationStates((prev) => ({
            ...prev,
            [title]: true, // Mark the animation as complete for this button
        }));
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            width: '100%',
            gap: "8px",
            ...containerStyle
        }}>
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    style={{
                        background: "#fff",
                        padding: 5,
                        ...buttonStyle,
                        ...button.style
                    }}
                    startIcon={button.startIcon}
                    startIconColor={button.startIconColor}
                    startIconSize={button.startIconSize}
                    onClick={() => {
                        if (button.onClick) button.onClick(button.extraData);
                    }}
                    title={button.title}
                    animateTitle={enableAnimation}
                    animationSpeed={animationSpeed}
                    onAnimationComplete={() => handleAnimationComplete(button.title)}
                    type={button.type}
                    size={button.size}
                    titleStyle={{
                        fontWeight: '600',
                        fontSize: 14,
                        color: themeColors.textShade,
                        ...button.titleStyle
                    }}
                    borderRadius={10}
                    color={themeColors.text}
                    hasShadow={true}
                    endIcon={button.endIcon}
                    endIconColor={button.endIconColor}
                    endIconSize={button.endIconSize}
                />
            ))}
        </div>
    );
};

export default ButtonGroup;

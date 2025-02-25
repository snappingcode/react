import React, { useEffect, useState } from 'react';
import Button from '../buttons/Button/Button';
import { themeColors } from '../../config';

// Define the interface for items in the navigator
interface NavigatorItem {
    name: string;
    label: string;
    icon?: string | null;
    color?: string;
    type: 'action' | 'group';
}

interface ActionGroupNavigatorProps {
    items: NavigatorItem[];
    onSelect: (item: NavigatorItem) => void;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    enableAnimation?: boolean; // Enable or disable animation
    animationSpeed?: number; // Speed of the animation
    //animationType?: 'simultaneous' | 'sequential'; // Animation mode
    onAnimationComplete?: () => void; // Callback when animation completes
}

const ActionGroupNavigator: React.FC<ActionGroupNavigatorProps> = ({
    items,
    onSelect,
    containerStyle,
    buttonStyle,
    enableAnimation = false,
    animationSpeed = 20,
    onAnimationComplete,
}) => {
    // State to track the completion of each button's animation
    const [animationStates, setAnimationStates] = useState<Record<string, boolean>>(
        () => items.reduce((acc, item) => ({ ...acc, [item.name]: false }), {})
    );

    useEffect(() => {
        // Check if all animations are complete
        const allAnimationsComplete = Object.values(animationStates).every((state) => state);
        if (allAnimationsComplete) {
            onAnimationComplete?.();
        }
    }, [animationStates, onAnimationComplete]);

    const handleAnimationComplete = (name: string) => {
        setAnimationStates((prev) => ({
            ...prev,
            [name]: true, // Mark the animation as complete for this button
        }));
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', ...containerStyle }}>
            {items.map((item) => (
                <Button
                    key={item.name}
                    style={{
                        background: "#fff",
                        ...buttonStyle,
                    }}
                    startIcon={item.icon || ''}
                    startIconColor={item.color}
                    onClick={() => onSelect(item)}
                    title={item.label}
                    animateTitle={enableAnimation}
                    animationSpeed={animationSpeed}
                    onAnimationComplete={() => handleAnimationComplete(item.name)}
                    type="clear"
                    size="md"
                    titleStyle={{
                        fontWeight: '600',
                        fontSize: 14,
                        color: themeColors.textShade,
                    }}
                    borderRadius={10}
                    color={themeColors.text}
                    hasShadow={false}
                    endIcon={item.type === 'group' ? 'chevronRightSm' : ''}
                />
            ))}
        </div>
    );
};

export default ActionGroupNavigator;

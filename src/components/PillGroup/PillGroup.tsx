import React from 'react';
import Pill from '../Pill/Pill';
import { themeColors } from '../../config';

interface PillGroupProps {
    pills: Array<{
        id: string | number; // Unique identifier for each pill
        text?: string; // Text to display inside the pill
        startIcon?: string; // Optional icon at the start of the pill
        endIcon?: string; // Optional icon at the end of the pill
        color?: string; // Background color of the pill
        textColor?: string; // Text and icon color
        containerStyle?: React.CSSProperties; // Custom styles for the pill
        textStyle?: React.CSSProperties; // Custom styles for the text
        startIconStyle?: React.CSSProperties; // Custom styles for the start icon
        endIconStyle?: React.CSSProperties; // Custom styles for the end icon
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Size of the pill
        onClick?: () => void; // Click handler for the pill
    }>;
    direction?: 'row' | 'column'; // Layout direction of the pill group
    gap?: number; // Gap between pills (in pixels)
    containerStyle?: React.CSSProperties; // Custom styles for the pill group container
    pillContainerStyle?: React.CSSProperties; // Global container styles for all pills
    pillTextStyle?: React.CSSProperties; // Global text styles for all pills
    pillColor?: string; // Global background color for all pills
    pillTextColor?: string; // Global text color for all pills
    pillSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Global size for all pills
    pillTextKey?: string; // Text to display inside the pill
}

const PillGroup: React.FC<PillGroupProps> = ({
    pills,
    direction = 'row',
    gap = 8,
    containerStyle,
    pillContainerStyle,
    pillTextStyle,
    pillColor,
    pillTextColor,
    pillSize,
    pillTextKey
}) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: direction,
                gap: `${gap}px`,
                flexWrap: direction === 'row' ? 'wrap' : 'nowrap', // Allow wrapping only for row direction
                ...containerStyle, // Apply custom styles for the group container
            }}
        >
            {pills.map((pill, index) => (
                <Pill
                    key={pill.id || index}
                    text={
                        pill.text ||
                        (pillTextKey ? String(pill[pillTextKey as keyof typeof pill] || '') : '')
                    }

                    startIcon={pill.startIcon}
                    endIcon={pill.endIcon}
                    // Global styles are overridden by specific pill styles
                    color={pill.color || pillColor || themeColors.primary}
                    textColor={pill.textColor || pillTextColor || themeColors.textShade}
                    containerStyle={{ ...pillContainerStyle, ...pill.containerStyle }}
                    textStyle={{ ...pillTextStyle, ...pill.textStyle }}
                    startIconStyle={pill.startIconStyle}
                    endIconStyle={pill.endIconStyle}
                    size={pill.size || pillSize}
                    onClick={pill.onClick}
                />
            ))}
        </div>
    );
};

export default PillGroup;

import React from 'react';

import { themeColors } from '../../config';
import Icon from '../Icon/Icon';

// Define the props interface for the Pill component
interface PillProps {
    text: string; // Text to display inside the pill
    startIcon?: string; // Optional icon to display at the start
    endIcon?: string; // Optional icon to display at the end
    color?: string; // Background color of the pill
    textColor?: string; // Text and icon color, defaults to white if not provided
    containerStyle?: React.CSSProperties; // Custom styles for the pill container
    textStyle?: React.CSSProperties; // Custom styles for the text
    startIconStyle?: React.CSSProperties; // Custom styles for the start icon
    endIconStyle?: React.CSSProperties; // Custom styles for the end icon
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Size of the pill
    onClick?: () => void; // Optional click handler for the pill
}

// Size mappings for padding and font size
const sizeStyles = {
    xs: { padding: '4px 8px', fontSize: '10px' },
    sm: { padding: '6px 10px', fontSize: '12px' },
    md: { padding: '8px 12px', fontSize: '14px' },
    lg: { padding: '10px 16px', fontSize: '16px' },
    xl: { padding: '12px 20px', fontSize: '18px' },
};

const Pill: React.FC<PillProps> = ({
    text,
    startIcon,
    endIcon,
    color = themeColors.primary,
    textColor = themeColors.text,
    containerStyle,
    textStyle,
    startIconStyle,
    endIconStyle,
    size = 'md',
    onClick,
}) => {
    const { padding, fontSize } = sizeStyles[size]; // Get styles based on size

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding,
                borderRadius: '16px',
                backgroundColor: color,
                color: textColor,
                cursor: onClick ? 'pointer' : 'default',
                fontSize,
                fontWeight: '500',
                whiteSpace: 'nowrap',
                alignSelf: 'flex-start',
                ...containerStyle, // Apply custom styles
            }}
            onClick={onClick}
        >
            {/* Render start icon if provided */}
            {startIcon && (
                <Icon
                    name={startIcon}
                    color={textColor} // Default to textColor
                    style={{
                        marginRight: '8px',
                        fontSize, // Match the font size of the pill
                        ...startIconStyle, // Apply custom styles for the start icon
                    }}
                />
            )}

            {/* Render the text */}
            <span style={{ ...textStyle }}>{text}</span>

            {/* Render end icon if provided */}
            {endIcon && (
                <Icon
                    name={endIcon}
                    color={textColor} // Default to textColor
                    style={{
                        marginLeft: '8px',
                        fontSize, // Match the font size of the pill

                        ...endIconStyle, // Apply custom styles for the end icon
                    }}
                />
            )}
        </div>
    );
};

export default Pill;

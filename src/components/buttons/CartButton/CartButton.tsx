import React from 'react';
import { themeColors } from '../../../config';
import IconButton from '../IconButton/IconButton';

interface CartButtonProps {
    onClick: () => void; // Action when button is clicked
    className?: string; // Additional CSS classes
    color?: keyof typeof themeColors | string;
    borderRadius?: number;
    type?: "clear" | "outline" | "solid";
    disabled?: boolean;
    icon?: string;
    iconPaths?: any[];
    iconSize?: number;
    totalItems: number;
    hasShadow?: boolean;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    badgeStyle?: React.CSSProperties;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const CartButton: React.FC<CartButtonProps> = ({
    onClick,
    className,
    color,
    borderRadius = 99,
    type = "solid",
    disabled,
    icon = 'cart',
    iconPaths,
    iconSize,
    hasShadow = false,
    containerStyle,
    buttonStyle,
    badgeStyle,
    size = "md",
    totalItems
}) => {
    const sizeStyles = {
        xs: { badgePadding: "4px", badgeFontSize: "10px", iconSize: 16 },
        sm: { badgePadding: "6px", badgeFontSize: "12px", iconSize: 24 },
        md: { badgePadding: "10px", badgeFontSize: "16px", iconSize: 28 },
        lg: { badgePadding: "14px", badgeFontSize: "18px", iconSize: 34 },
        xl: { badgePadding: "18px", badgeFontSize: "22px", iconSize: 40 },
    };
    return (
        <div
            className={`snapping-cart-button ${className || ''}`}
            style={{
                cursor: 'pointer',
                position: 'relative',
                ...containerStyle
            }}
            onClick={onClick}
        >
            {totalItems > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        background: themeColors.textShade,
                        color: "#fff",
                        padding: sizeStyles[size].badgePadding,
                        fontSize: sizeStyles[size].badgeFontSize,

                        borderRadius: 99,
                        lineHeight: 1,
                        fontWeight: '700',
                        zIndex: 1,
                        ...badgeStyle
                    }}
                    className="cart-badge"
                >{totalItems}</div>
            )}
            <IconButton
                onClick={() => { }}
                icon={icon}
                size={size}
                type={type}
                color={color}
                borderRadius={borderRadius}
                disabled={disabled}
                iconPaths={iconPaths}
                iconSize={iconSize || sizeStyles[size].iconSize}
                hasShadow={hasShadow}
                style={buttonStyle}

            />

        </div>
    );
};

export default CartButton;

// src/components/AlertMessage.tsx
import React, { useState } from 'react';
import { themeColors } from '../../config';

import TypingEffect from '../TypingEffect/TypingEffect';
import Icon from '../Icon/Icon';
import IconButton from '../buttons/IconButton/IconButton';

interface AlertMessageProps {
    type?: 'primary' | 'dark' | 'medium' | 'light' | 'danger' | 'warning' | 'success' | 'info';
    message: string;
    icon?: string;
    containerStyle?: React.CSSProperties;
    iconStyle?: React.CSSProperties;
    messageStyle?: React.CSSProperties;
    dismissible?: boolean;
    animateMessage?: boolean;
    animationSpeed?: number; // Nueva prop
    onAnimationComplete?: () => void; // Nueva prop
    onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
    type = 'primary',
    message,
    icon,
    containerStyle,
    iconStyle,
    messageStyle,
    dismissible = false,
    animateMessage = false,
    animationSpeed = 50,
    onAnimationComplete,
    onClose,

}) => {
    const backgroundColor = themeColors[type] || themeColors.primary;
    const [showEndButton, setShowEndButton] = useState(!animateMessage);
    const handleAnimationComplete = () => {
        setShowEndButton(true); // Mostrar el ícono derecho al completar la animación
        if (onAnimationComplete) {
            onAnimationComplete(); // Disparar el callback
        }
    };
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor,
                color: '#fff',
                minHeight: 56,
                ...containerStyle,

            }}
        >
            {/* Icon */}
            {icon && <Icon name={icon} style={{
                marginRight: 10,
                ...iconStyle
            }} />}

            {/* Message */}
            {animateMessage ? (
                <div style={{ flex: 1 }}>
                    <TypingEffect

                        text={message}
                        speed={animationSpeed}
                        style={{
                            position: 'relative',
                            top: -2,
                            ...messageStyle
                        }}
                        showCursor={true}
                        onComplete={handleAnimationComplete}
                    />
                </div>
            ) : (
                <div style={{ flex: 1, ...messageStyle }}>{message}</div>
            )}


            {/* Close Button */}
            {dismissible && showEndButton && (
                <IconButton
                    icon="close"
                    onClick={() => { onClose?.() }}
                    size='xs'
                    style={{ marginLeft: '8px', color: '#fff' }}
                    hasShadow={false}
                    type='clear'
                    color={themeColors.text}
                />
            )}
        </div>
    );
};

export default AlertMessage;

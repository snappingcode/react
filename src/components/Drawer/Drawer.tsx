import React, { CSSProperties } from 'react';
import { createPortal } from 'react-dom';

export interface DrawerProps {
    isOpen: boolean;
    anchor: 'left' | 'right' | 'top' | 'bottom';
    duration?: number; // Animation duration in ms
    onClose?: () => void;
    showOverlay?: boolean; // Show overlay
    children?: React.ReactNode;
    drawerStyle?: CSSProperties; // Custom styles for the drawer
    overlayStyle?: CSSProperties; // Custom styles for the overlay
    height?: number | string; // Height of the drawer
    width?: number | string; // Width of the drawer
    zIndex?: number;
}

const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    anchor,
    duration = 300,
    onClose,
    showOverlay = true,
    children,
    drawerStyle,
    overlayStyle,
    height,
    width,
    zIndex = 9999
}) => {
    // Compute position based on anchor
    const getTransform = (): string => {
        if (isOpen) return 'translate(0, 0)';
        switch (anchor) {
            case 'left':
                return 'translate(-100%, 0)';
            case 'right':
                return 'translate(100%, 0)';
            case 'top':
                return 'translate(0, -100%)';
            case 'bottom':
                return 'translate(0, 100%)';
            default:
                return 'translate(0, 0)';
        }
    };

    const defaultHeight = anchor === 'top' || anchor === 'bottom' ? (height || 200) : '100%';
    const defaultWidth = anchor === 'left' || anchor === 'right' ? (width || 200) : '100%';

    const drawerStyles: CSSProperties = {
        position: 'fixed',
        top: anchor === 'top' || anchor === 'left' || anchor === 'right' ? 0 : undefined,
        bottom: anchor === 'bottom' ? 0 : undefined,
        left: anchor === 'left' || anchor === 'top' || anchor === 'bottom' ? 0 : undefined,
        right: anchor === 'right' ? 0 : undefined,
        height: defaultHeight,
        width: defaultWidth,
        transform: getTransform(),
        transition: `transform ${duration}ms ease-in-out`,
        backgroundColor: '#fff',
        zIndex: zIndex + 1,
        ...drawerStyle,
    };

    const overlayStyles: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: `opacity ${duration}ms ease-in-out`,
        zIndex: zIndex + 1,
        cursor: "pointer",
        ...overlayStyle,
    };

    const drawerContent = (
        <>
            {showOverlay && (
                <div style={overlayStyles} onClick={onClose} />
            )}
            <div style={drawerStyles}>{children}</div>
        </>
    );

    return createPortal(drawerContent, document.body);
};

export default Drawer;

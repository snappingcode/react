import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface PopoverProps {
    content: React.ReactNode;
    anchorRef: React.RefObject<HTMLElement>;
    isOpen: boolean;
    onClose: () => void;
    containerStyle?: React.CSSProperties;
    backdropStyle?: React.CSSProperties;
    hasShadow?: boolean;
}

const Popover: React.FC<PopoverProps> = ({
    content,
    anchorRef,
    isOpen,
    onClose,
    containerStyle = {},
    backdropStyle = {},
    hasShadow = true
}) => {
    const [popoverPosition, setPopoverPosition] = useState<{ top: number; right: number } | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Detect Escape key to close Popover
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Set the position when the popover opens
    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPopoverPosition({
                top: rect.bottom + 10 + window.scrollY,
                right: window.innerWidth - rect.right - window.scrollX
            });
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen, anchorRef]);


    if (!isOpen || !popoverPosition) return null;

    return ReactDOM.createPortal(
        <>
            {/* Transparent background that takes up the entire screen */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 999,
                    ...backdropStyle
                }}
            />
            {/* Popover */}
            <div
                style={{
                    position: 'absolute',
                    top: popoverPosition.top,
                    right: popoverPosition.right,
                    zIndex: 1000,
                    background: '#fff',
                    borderRadius: 10,
                    boxSizing: "border-box",
                    padding: '10px',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
                    boxShadow: hasShadow ? "0px 4px 12px rgba(0, 0, 0, 0.15)" : "none",
                    ...containerStyle
                }}
            >
                {content}
            </div>
        </>,
        document.body
    );
};

export default Popover;

import React from 'react';

// Props interface for the Thumbnail component
interface ThumbnailProps {
    src: string; // URL of the image to display
    alt?: string; // Alternative text for accessibility
    size?: 'sm' | 'md' | 'lg'; // Size of the thumbnail
    shape?: 'circle' | 'square' | 'rounded'; // Shape of the thumbnail
    onClick?: () => void; // Click handler for the thumbnail
    overlayText?: string; // Optional text overlay on the image
    border?: 'none' | 'thin' | 'thick'; // Border style
    status?: 'online' | 'offline' | 'busy'; // Status indicator for user-related thumbnails
    className?: string; // Custom class name for additional styling
    style?: React.CSSProperties; // Inline styles for the component
}

// Default size mapping
const sizeMap = {
    sm: '40px',
    md: '60px',
    lg: '80px',
};

const Thumbnail: React.FC<ThumbnailProps> = ({
    src,
    alt = '',
    size = 'md',
    shape = 'circle',
    onClick,
    overlayText,
    border = 'none',
    status,
    className,
    style,
}) => {
    return (
        <div
            className={`thumbnail-container ${className || ''}`}
            style={{
                width: sizeMap[size],
                height: sizeMap[size],
                borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '0',
                border: border !== 'none' ? (border === 'thin' ? '1px solid #ccc' : '2px solid #000') : 'none',
                position: 'relative',
                overflow: 'hidden',
                ...style,
            }}
            onClick={onClick}
        >
            {/* Image element */}
            <img
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />

            {/* Optional overlay text */}
            {overlayText && (
                <span
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        width: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: '12px',
                        padding: '4px',
                    }}
                >
                    {overlayText}
                </span>
            )}

            {/* Status indicator */}
            {status && (
                <span
                    style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor:
                            status === 'online' ? 'green' : status === 'offline' ? 'gray' : 'orange',
                        border: '2px solid white',
                    }}
                ></span>
            )}
        </div>
    );
};

export default Thumbnail;

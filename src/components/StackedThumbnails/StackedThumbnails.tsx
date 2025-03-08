import React from "react";

interface StackedThumbnailsProps {
    thumbnails: { src: string; alt?: string }[];
    maxDisplayed?: number;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    spacing?: number;
    borderColor?: string;
    overflowStyle?: React.CSSProperties;
    overflowTextStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    onClick?: () => void;
}

const SIZE_MAP = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
};

const StackedThumbnails: React.FC<StackedThumbnailsProps> = ({
    thumbnails,
    maxDisplayed = 3,
    size = "md",
    spacing = -10,
    borderColor = "#f9f9f9",
    overflowStyle,
    overflowTextStyle,
    containerStyle,
    onClick,
}) => {
    const thumbnailSize = SIZE_MAP[size];
    const displayedThumbnails = thumbnails.slice(0, maxDisplayed).reverse(); // Invertimos el orden
    const overflowCount = thumbnails.length - maxDisplayed;
    const itemsCount = overflowCount > 0 ? maxDisplayed + 1 : thumbnails.length
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                cursor: onClick ? "pointer" : "default",
                //backgroundColor: 'blue',
                height: thumbnailSize,
                //width: itemsCount * (thumbnailSize + spacing) - (overflowCount > 0 ? spacing : 0),
                width: thumbnailSize + ((itemsCount - 1) * (thumbnailSize + spacing) - (overflowCount > 0 ? 0 : 0)),
                ...containerStyle,
            }}
            onClick={onClick}
        >
            {displayedThumbnails.map((thumb, index) => (
                <img
                    key={index}
                    src={thumb.src}
                    alt={thumb.alt || "Thumbnail"}
                    style={{
                        width: thumbnailSize,
                        height: thumbnailSize,
                        borderRadius: "50%",
                        border: `3px solid ${borderColor}`,
                        objectFit: "cover",
                        position: "absolute",
                        right: (itemsCount - (overflowCount > 0 ? 1 : 0) - index) * (spacing + thumbnailSize) - (overflowCount > 0 ? 0 : thumbnailSize + spacing), // Reajustamos la posición
                        zIndex: index + 1, // Ajustamos el zIndex para que el primero esté encima
                    }}
                />
            ))}

            {overflowCount > 0 && (
                <div
                    style={{
                        width: thumbnailSize,
                        height: thumbnailSize,
                        borderRadius: "50%",
                        backgroundColor: "#5A6B7B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        right: 0,
                        border: `3px solid ${borderColor}`,
                        //right: (displayedThumbnails.length - maxDisplayed) * (spacing + thumbnailSize), // Ubicamos el "+n" correctamente
                        zIndex: displayedThumbnails.length,
                        color: "#fff",
                        fontSize: thumbnailSize * .4,
                        fontWeight: "bold",
                        ...overflowStyle,
                    }}
                >
                    <span style={{
                        lineHeight: 1,
                        position: "relative",
                        top: -1,
                        ...overflowTextStyle
                    }}>+{overflowCount}</span>
                </div>
            )}
        </div>
    );
};

export default StackedThumbnails;

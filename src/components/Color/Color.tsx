import React from "react";
interface ColorProps {
    value: string;
    size?: number;
    borderRadius?: number;
    className?: string;
    style?: React.CSSProperties;
}
const Color: React.FC<ColorProps> = ({
    value,
    size = 40,
    borderRadius = 99,
    className,
    style
}) => {

    return <div className={`precooked-color ${className}`} style={{
        display: "block",
        width: size,
        height: size,
        borderRadius: borderRadius,
        background: value,
        ...style
    }}></div>;
};

export default Color;

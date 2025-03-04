import React from "react";

interface TextProps {
    style?: React.CSSProperties;
    maxLines?: number;
    content: string;
    showEllipsis?: boolean;
}

const Text: React.FC<TextProps> = ({ style, maxLines, content, showEllipsis = true }) => {
    const textStyles: React.CSSProperties = {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: maxLines, // Limits the number of lines
        overflow: "hidden",
        textOverflow: showEllipsis ? "ellipsis" : "clip",
        ...style,
    };

    return <p style={textStyles}>{content}</p>;
};

export default Text;

import React from "react";

interface TextProps {
    style?: React.CSSProperties;
    maxLines?: number;
    content: string;
    showEllipsis?: boolean;
}

const Text: React.FC<TextProps> = ({ style, maxLines, content, showEllipsis = true }) => {
    const textStyles: React.CSSProperties = {
        display: "block",
        overflow: "hidden",
        textOverflow: showEllipsis ? "ellipsis" : "clip",
        whiteSpace: maxLines ? "nowrap" : "normal",
        ...style,
    };

    return <p style={textStyles}>{content}</p>;
};

export default Text;

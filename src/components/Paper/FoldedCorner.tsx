import React from "react";

interface FoldedCornerProps {
    size?: "sm" | "md" | "lg";
    style?: React.CSSProperties;
}

const FoldedCorner: React.FC<FoldedCornerProps> = ({ size = "md", style }) => {
    const sizeStyles = {
        sm: { width: "20px", height: "20px" },
        md: { width: "30px", height: "30px" },
        lg: { width: "40px", height: "40px" },
    };

    return (
        <svg
            width={sizeStyles[size].width}
            height={sizeStyles[size].height}
            viewBox="0 0 30 30"
            style={style}
            fill="none"
        >
            <path
                fill="#ffffff"
                d="M 0.13022511,30.000013 0.11586153,29.107337 29.173158,0.02537753 29.979012,8.336367e-6 30,30.000013 Z"
            />
            <path
                fill="#cccccc"
                d="M 0.10149795,28.214661 C 9.3158048,21.655637 18.798953,15.249392 28.367304,0.05074673 L 29.979012,8.336367e-6 29.999995,17.926204 c 0.0062,5.27188 -5.479703,11.112835 -12.464149,12.062529 0,0 -11.6557651,-0.02819 -17.40562089,0.01128 z"
            />
            <path
                fill="#ffffff"
                d="M 0,28.255977 28.292646,0.12669324 28.160478,17.045933 c -0.03911,5.005947 -6.156172,11.151493 -11.052289,11.16454 z"
            />
        </svg>
    );
};

export default FoldedCorner;

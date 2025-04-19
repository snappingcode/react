import React, { ReactNode } from "react";
import FoldedCorner from "./FoldedCorner";

interface PaperProps {
    children: ReactNode;
    size?: "sm" | "md" | "lg";
    style?: React.CSSProperties;
}

const Paper: React.FC<PaperProps> = ({ children, size = "md", style }) => {
    const sizeStyles: Record<string, React.CSSProperties> = {
        sm: { width: "150px", minHeight: "200px" },
        md: { width: "200px", minHeight: "260px" },
        lg: { width: "250px", minHeight: "320px" },
    };

    const styles = createStyles(size); // Pasamos el tamaño actual para ajustar los estilos dinámicamente

    return (
        <div
            style={{
                ...styles.container,
                ...sizeStyles[size],
                ...style,
            }}
        >
            <div style={styles.topBar}></div>
            <FoldedCorner size={size} style={styles.foldedCorner} />
            {children}
        </div>
    );
};

const createStyles = (size: "sm" | "md" | "lg"): Record<string, React.CSSProperties> => {
    const sizeValues = {
        sm: 20,
        md: 30,
        lg: 40,
    };

    const dynamicValue = sizeValues[size]; // Obtiene el valor dinámico según el tamaño

    return {
        container: {
            position: "relative",
            backgroundColor: "#fff",
            borderRadius: "0 0 20px 20px",
            filter: "drop-shadow(0 2px 0 #ccc)",
            padding: "10px",
            paddingTop: "0px",
            boxSizing: "border-box",
            marginTop: `${dynamicValue}px`, // Valor dinámico
            display: "inline-block",
        },
        topBar: {
            position: "absolute",
            top: `-${dynamicValue}px`, // Valor dinámico
            left: `${dynamicValue}px`, // Valor dinámico
            right: "0",
            height: `${dynamicValue}px`, // Valor dinámico
            backgroundColor: "#fff",
            borderTopRightRadius: "20px",
        },
        foldedCorner: {
            position: "absolute",
            top: `-${dynamicValue}px`, // Valor dinámico
            left: 0,
        },
    };
};

export default Paper;

import React from "react";
import Lottie from "lottie-react";
import useIsMobile from "../../hooks/useIsMobile";


interface FooterAnimationProps {
    animationData: object; // Archivo JSON de la animación
    loop?: boolean; // Indica si la animación debe ser en bucle
}

const FooterAnimation: React.FC<FooterAnimationProps> = ({ animationData, loop = true }) => {
    const breakpoint = 768;
    const { isMobile } = useIsMobile(breakpoint);

    const containerStyle: React.CSSProperties = {
        position: "fixed",
        bottom: "0px",
        left: isMobile ? "-50%" : "0",
        width: isMobile ? "200%" : "100%",
    };

    const animationWrapperStyle: React.CSSProperties = {
        width: "100%",
        height: "0",
        paddingBottom: "24%",
        position: "relative",
    };

    const lottieStyle: React.CSSProperties = {
        position: "absolute",
        width: "100%",
        height: "100%",
    };

    return (
        <div style={containerStyle}>
            <div style={animationWrapperStyle}>
                <Lottie loop={loop} animationData={animationData} style={lottieStyle} />
            </div>
        </div>
    );
};

export default FooterAnimation;

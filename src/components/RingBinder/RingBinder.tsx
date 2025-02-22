import React, { useEffect, useState } from "react";

import horizontalConfig from "./configFiles/horizontal.json";
import viewedFromFrontConfig from "./configFiles/viewedFromFront.json";
import viewedFromTopConfig from "./configFiles/viewedFromTop.json";
import viewedFromSideConfig from "./configFiles/viewedFromSide.json";

import TextLines from "../TextLines/TextLines";
import { themeColors } from "../../config";
import adjustColor from "../../utils/adjustColor";


interface RingBinderProps {
    style?: React.CSSProperties;
    color?: string;
    type?: 'horizontal' | 'viewedFromFront' | 'viewedFromTop' | 'viewedFromSide';
    label: string;
    className?: string;
    onClick: () => void;
}
const RingBinder: React.FC<RingBinderProps> = ({
    style,
    color = "#9cb0be",
    type = "horizontal",
    label = "",
    className = "",
    onClick
}) => {

    const [config, setConfig] = useState(null as any);

    useEffect(() => {
        switch (type) {
            case "horizontal":
                setConfig(horizontalConfig);
                break;
            case "viewedFromFront":
                setConfig(viewedFromFrontConfig);
                break;
            case "viewedFromTop":
                setConfig(viewedFromTopConfig);
                break;
            case "viewedFromSide":
                setConfig(viewedFromSideConfig);
                break;
            default:
                setConfig(horizontalConfig);
                break;
        }
    }, [type]);

    const getColor = (colorKey: string) => {
        switch (colorKey) {
            case "mainColor":
                return color;
            case "darker":
                return adjustColor(color, -20);
            case "lighter":
                return adjustColor(color, 20);
            case "darkest":
                return adjustColor(color, -40);
            case "lightest":
                return adjustColor(color, 40);
            default:
                return colorKey; // for static colors like #fff, #ccc, etc.
        }
    };

    if (!config) return null;

    let labelTop = '30px';
    let labelLeft = '10px';
    switch (type) {
        case "horizontal":
            labelTop = '20px';
            labelLeft = '90px';
            break;
        case "viewedFromFront":
            labelTop = '30px';
            labelLeft = '17px';
            break;
        case "viewedFromTop":
            labelTop = '30px';
            labelLeft = '17px';
            break;
        case "viewedFromSide":
            labelTop = '30px';
            labelLeft = '10px';
            break;
        default:
            labelTop = '30px';
            labelLeft = '10px';
            break;
    }
    return (
        <>
            <a
                className={`ring-binder ${className}`}
                onClick={onClick}
                style={{
                    cursor: "pointer",
                    position: "relative",
                    display: "inline-block",
                    textAlign: "center"
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg" style={{ ...style, width: config?.width, height: config?.height }} viewBox={`0 0 ${config?.width} ${config?.height}`}>
                    {config.paths.map((path: any, index: number) => (
                        <path key={index} fill={getColor(path.color)} d={path.d} opacity={path.opacity} />
                    ))}
                </svg>
                {type !== 'horizontal' ? (

                    <TextLines
                        className="ring-binder-label vertical"
                        style={{
                            top: labelTop,
                            left: labelLeft,
                            position: 'absolute',
                            color: themeColors.text,
                            fontSize: "14px",
                            lineHeight: 1,
                            fontWeight: 600,
                            width: "60px",
                            height: "130px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                        }}
                        lineStyle={{
                            fontWeight: 400,
                            lineHeight: 1.2,
                            fontSize: ".9em",
                        }}
                        text={label}
                        maxCharsPerLine={config.maxCharsPerLine}
                        maxLines={3}
                    />
                ) : (

                    <TextLines
                        className="ring-binder-label horizontal"
                        style={{
                            top: labelTop,
                            left: labelLeft,
                            position: 'absolute',
                            color: themeColors.text,
                            fontSize: "14px",
                            lineHeight: 1,
                            fontWeight: 600,
                            width: "120px",
                            height: "50px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "left",
                            alignItems: "flex-start",
                        }}
                        lineStyle={{
                            fontWeight: 400,
                            lineHeight: 1.2,
                            fontSize: ".9em",
                        }}
                        text={label}
                        maxCharsPerLine={config.maxCharsPerLine}
                        maxLines={3}
                    />
                )}
            </a >

        </>

    );
};

export { RingBinder };

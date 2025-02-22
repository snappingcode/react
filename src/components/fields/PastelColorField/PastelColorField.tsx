import React, { useState, useRef, useEffect } from 'react';
import { themeColors } from '../../../config';
import Popover from '../../Popover/Popover';



interface PastelColorFieldProps {
    label?: string;
    description?: string;
    value: string;
    onChange: (color: string) => void;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    disablePrimary?: boolean;
    [key: string]: any;
}

const PastelColorField: React.FC<PastelColorFieldProps> = ({
    label,
    description,
    value,
    onChange,
    containerStyle,
    className,
    id,
    labelStyle,
    descriptionStyle,
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const colorPalette = [
        "#A597CC",
        "#94B7DF",
        "#83D7F1",
        "#68CDD4",
        "#4CC2B6",
        "#81CC9F",
        "#B5D687",
        "#DAD677",
        "#FFD567",
        "#FDBD68",
        "#FAA469",
        "#F59A8E",
        "#F08FB2",
    ];
    useEffect(() => {
        onChange(colorPalette[0]);
    }, [])
    const togglePopover = () => setIsPopoverOpen((prev) => !prev);
    const closePopover = () => setIsPopoverOpen(false);

    const handleSelectColor = (
        event: React.MouseEvent<HTMLButtonElement>,
        color: string,

    ) => {
        event.preventDefault();
        setIsPopoverOpen(false);
        onChange(color);
    };

    return (
        <>
            <div
                id={id}
                className={`pastel-color-field-container ${className}`}
                style={{
                    background: "#fff",
                    width: "100%",
                    borderColor: themeColors.medium,
                    borderWidth: "2px",
                    borderRadius: "10px",
                    borderStyle: "solid",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    position: "relative",
                    padding: "10px 5px 5px 5px",
                    marginTop: "10px",
                    ...containerStyle
                }}
            >
                <label style={{
                    position: "absolute",
                    top: "-13px",
                    left: "10px",
                    display: "inline-block",
                    padding: "0 5px",
                    background: "#fff",
                    fontWeight: "600",
                    color: themeColors.text,
                    ...labelStyle
                }}>{label}</label>

                <button
                    ref={buttonRef}
                    onClick={(e) => {
                        e.preventDefault();
                        togglePopover();
                    }}
                    style={{
                        backgroundColor: value || colorPalette[0],
                        border: "none",
                        cursor: "pointer",
                        outline: "none",
                        height: "30px",
                        borderRadius: "7px",
                        width: "100%",
                    }}
                ></button>
                <Popover
                    content={
                        <div>
                            <div style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                                maxWidth: "150px",
                            }}>

                                {colorPalette.map((color: string, index: number) => {
                                    return (
                                        <button
                                            key={index}
                                            onClick={(e) => handleSelectColor(e, color)}
                                            style={{
                                                backgroundColor: color,
                                                width: 40,
                                                height: 40,
                                                borderRadius: 99,
                                                display: "block",
                                                border: "none",
                                                cursor: "pointer",
                                                outline: "none", // Remove default button outline
                                                margin: 5
                                            }}
                                        ></button>
                                    );
                                })}


                            </div>

                        </div>
                    }
                    //anchorRef={buttonRef}
                    anchorRef={buttonRef as React.RefObject<HTMLElement>}
                    isOpen={isPopoverOpen}
                    onClose={closePopover}
                    hasShadow={true}
                    containerStyle={{ maxWidth: '600px' }}
                />
            </div>
            {description && <p style={{
                fontWeight: 300,
                fontStyle: "italic",
                display: "block",
                padding: "3px",
                margin: 0,
                color: themeColors.textTint,
                fontSize: ".9em",
                ...descriptionStyle
            }}>{description}</p>}
        </>

    );
};

export default PastelColorField;

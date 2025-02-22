import React, { useState, useRef } from 'react';
import { themeColors } from '../../../config';
import lightenDarkenColor from '../../../utils/lightenDarkenColor';
import Popover from '../../Popover/Popover';
import IconButton from '../../buttons/IconButton/IconButton';


interface ColorFieldProps {
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

const ColorField: React.FC<ColorFieldProps> = ({
    label,
    description,
    value,
    onChange,
    containerStyle,
    className,
    id,
    disablePrimary = false,
    labelStyle,
    descriptionStyle,
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [customColor, setCustomColor] = useState<string | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const colorPalette = [
        "#0046BF", "#00A7A7", "#00A700", "#A7A700", "#fa7121",
        "#A70000", "#A700A7", "#650086", "#222222", "#7f7f7f",
    ];

    const complementaryColors = [
        "#364750", "#4d6572", "#638192", "#7b98ad", "#f2f2f4"
    ];

    const semanticColors: { name: keyof typeof themeColors; label: string }[] = [
        { name: "primary", label: "Principal" },
        { name: "danger", label: "Peligro" },
        { name: "warning", label: "Advertencia" },
        { name: "success", label: "Éxito" },
        { name: "info", label: "Información" },
    ];

    const shadeLevels = [-0.4, -0.25, 0, 0.25, 0.4];

    const togglePopover = () => setIsPopoverOpen((prev) => !prev);
    const closePopover = () => setIsPopoverOpen(false);

    const handleSelectColor = (
        event: React.MouseEvent<HTMLButtonElement>,
        color: string,
        amount: number
    ) => {
        event.preventDefault();
        setIsPopoverOpen(false);
        onChange(lightenDarkenColor(color, amount));
    };

    const handleSelectSemanticColor = (
        event: React.MouseEvent<HTMLButtonElement>,
        colorName: string,
    ) => {
        if (disablePrimary && colorName === "primary") return;
        event.preventDefault();
        onChange(colorName);
    };

    const handleChangeCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomColor(e.target.value);
    };

    const handleSelectCustomColor = () => {
        if (customColor) {
            onChange(`#${customColor}`);
            setCustomColor(null);
            setIsPopoverOpen(false);
        }
    };

    return (
        <>
            <div
                id={id}
                className={`color-field-container ${className}`}
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
                        backgroundColor: (value in themeColors ? themeColors[value as keyof typeof themeColors] : value) || "#ccc",
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
                            <table style={{
                                borderCollapse: "separate",
                                width: "100%",
                                borderSpacing: "2px",
                            }}>
                                <tbody>
                                    {colorPalette.map((color, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {shadeLevels.map((amount, colIdx) => (
                                                <td key={colIdx}>
                                                    <button
                                                        onClick={(e) => handleSelectColor(e, color, amount)}
                                                        style={{
                                                            backgroundColor: lightenDarkenColor(color, amount),
                                                            width: "100%",
                                                            height: 25,
                                                            display: "block",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            outline: "none", // Remove default button outline
                                                        }}
                                                    ></button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    <tr>
                                        {complementaryColors.map((color, idx) => (
                                            <td key={idx}>
                                                <button
                                                    onClick={(e) => handleSelectColor(e, color, 0)}
                                                    style={{
                                                        backgroundColor: color,
                                                        width: "100%",
                                                        height: 25,
                                                        display: "block",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        outline: "none", // Remove default button outline
                                                    }}
                                                ></button>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        {semanticColors.map((color: any, idx) => (
                                            <td key={idx}>
                                                <button
                                                    onClick={(e) => handleSelectSemanticColor(e, color.name)}
                                                    style={{
                                                        backgroundColor: themeColors[color.name],
                                                        opacity:
                                                            disablePrimary && color.name === "primary" ? 0.5 : 1,
                                                        cursor:
                                                            disablePrimary && color.name === "primary"
                                                                ? "default"
                                                                : "pointer",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        height: 25,
                                                        fontWeight: "bold",
                                                        color: "#fff",
                                                        textAlign: "center",
                                                        border: "none",
                                                        width: "100%",
                                                        outline: "none", // Remove default button outline
                                                    }}
                                                >
                                                    {/* {color.label} */}
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "5px",
                                flexWrap: "nowrap",
                            }}>
                                <span
                                    style={{
                                        backgroundColor: `#${customColor || ""}`,
                                        height: 30,
                                        display: "block",
                                        width: 40,
                                        border: "1px solid #ccc",
                                        marginRight: "5px",
                                    }}
                                ></span>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0px",
                                    flexWrap: "nowrap",
                                    marginLeft: "10",
                                    borderColor: themeColors.medium,
                                    borderWidth: "2px",
                                    borderRadius: "99px",
                                    borderStyle: "solid",
                                    boxSizing: "border-box",


                                }}>
                                    <strong style={{
                                        fontSize: "1.3em",
                                        paddingLeft: "5px",
                                    }}>#</strong>
                                    <input
                                        type="text"
                                        value={customColor || ""}
                                        onChange={handleChangeCustomColor}
                                        style={{
                                            borderRadius: 99,
                                            width: "100%",
                                            height: "25px",
                                            lineHeight: "25px",
                                            border: "none",
                                            fontSize: ".9em",
                                            padding: "5px",
                                            color: themeColors.text,
                                            fontWeight: 500,
                                            outline: "none",
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleSelectCustomColor}
                                        disabled={
                                            customColor?.length !== 3 && customColor?.length !== 6
                                        }
                                        icon="check"
                                        hasShadow={false}
                                        size="xs"
                                        borderRadius={10}
                                        type='clear'
                                    />
                                </div>
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

export default ColorField;

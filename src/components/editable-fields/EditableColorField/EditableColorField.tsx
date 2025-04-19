import React, { useEffect, useRef, useState } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';
import { themeColors } from '../../../config';
import lightenDarkenColor from '../../../utils/lightenDarkenColor';
import Popover from '../../Popover/Popover';
import IconButton from '../../buttons/IconButton/IconButton';
import Icon from '../../Icon/Icon';

interface EditableColorFieldProps {
    label?: string;
    description?: string;
    name: string;
    value: string;
    onChange?: (newValue?: string | null) => void;
    onEditStart?: () => void;
    onEditSuccess?: (updatedValue: any) => void;
    onEditError?: (error: any) => void;
    onEditCancel?: () => void;
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    savePath: string;
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    editIcon?: string;
    saveIcon?: string;
    cancelIcon?: string;
    disablePrimary?: boolean;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
}

const EditableColorField: React.FC<EditableColorFieldProps> = ({
    label,
    description,
    name,
    value = "",
    onChange,
    onEditStart,
    onEditSuccess,
    onEditError,
    onEditCancel,
    containerStyle,
    labelStyle,
    descriptionStyle,
    savePath,
    apiBaseUrl,
    useAuthToken = false,
    editIcon = "pencil",
    saveIcon = "check",
    cancelIcon = "close",
    disablePrimary,
    headerStyle,
    bodyStyle,

}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value as any);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [customColor, setCustomColor] = useState<string | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);


    //const initialValue = useRef(value);

    const handleEditStart = () => {
        setIsEditing(true);
        onEditStart?.();
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        //setTempValue(initialValue.current);
        setTempValue(value);
        onEditCancel?.();
    };

    const handleEditError = (error: any) => {
        setIsEditing(false);
        //setTempValue(value);
        //setTempValue(initialValue.current);
        setTempValue(value);
        if (onEditError) onEditError(error);
    };

    const handleEditSuccess = (updatedValue: string) => {
        setIsEditing(false);
        setTempValue(updatedValue);
        onChange?.(updatedValue);
        onEditSuccess?.(updatedValue);
    };
    useEffect(() => {
        setTempValue(value);
    }, [value])

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
        setTempValue(lightenDarkenColor(color, amount));
        //onChange(lightenDarkenColor(color, amount));
    };

    const handleSelectSemanticColor = (
        event: React.MouseEvent<HTMLButtonElement>,
        colorName: string,
    ) => {
        if (disablePrimary && colorName === "primary") return;
        event.preventDefault();
        setIsPopoverOpen(false);
        setTempValue(colorName);
        //onChange(colorName);
    };

    const handleChangeCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomColor(e.target.value);
    };

    const handleSelectCustomColor = () => {
        if (customColor) {
            //onChange(`#${customColor}`);
            setTempValue(`#${customColor}`);
            setCustomColor(null);
            setIsPopoverOpen(false);
        }
    };


    return (
        <FieldContainer
            label={label}
            labelStyle={{
                ...labelStyle
            }}
            name={name}
            value={value}
            tempValue={tempValue}
            description={description}
            descriptionStyle={descriptionStyle}
            showEditFieldControls
            onEditStart={handleEditStart}
            onEditSuccess={handleEditSuccess}
            onEditError={handleEditError}
            onEditCancel={handleEditCancel}
            savePath={savePath}
            apiBaseUrl={apiBaseUrl}
            useAuthToken={useAuthToken}
            editIcon={editIcon}
            saveIcon={saveIcon}
            cancelIcon={cancelIcon}
            containerStyle={{
                ...containerStyle,
            }}
            headerStyle={{
                ...headerStyle
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    //cursor: 'pointer',
                }}
            > <div
                className={'field-body'}
                style={{
                    padding: '5px 10px 10px 10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...bodyStyle,
                }}
            >

                    {
                        isEditing ?

                            <div style={{
                                height: "80px",
                                width: "80px",
                                position: "relative",

                            }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (tempValue) {
                                        setTempValue(null);
                                        //onChange(null);
                                    } else {
                                        togglePopover();
                                    }

                                }}>
                                {
                                    tempValue ? <div style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: 99,
                                        background: "#fff",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        position: "absolute",
                                        top: -15,
                                        right: -15,
                                        cursor: "pointer",
                                        border: `4px solid ${themeColors.light}`
                                    }}>
                                        <Icon
                                            name={'close'}
                                            size={15}
                                            color={themeColors.danger}
                                            style={{

                                            }}
                                        />
                                    </div> : <></>
                                }
                                <button
                                    ref={buttonRef}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 10,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        border: tempValue ? "none" : `2px dashed ${themeColors.medium}`,
                                        backgroundColor: tempValue,
                                        cursor: "pointer"
                                    }}
                                >
                                    {
                                        !tempValue ? <>
                                            <Icon name='tap' size={35} />
                                            <span style={{
                                                textAlign: "center",
                                                fontWeight: "400",
                                                fontSize: 14,
                                                color: themeColors.text
                                            }}>Seleccionar color</span></> : <></>
                                    }
                                </button>
                            </div>

                            :

                            <div style={{
                                height: "80px",
                                width: "80px",
                                position: "relative",

                            }}>
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 10,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        border: tempValue ? "none" : `2px dashed ${themeColors.medium}`,
                                        backgroundColor: tempValue,
                                        cursor: "pointer"
                                    }}
                                >
                                    {
                                        !tempValue ? <>
                                            <Icon name='tap' size={35} />
                                            <span style={{
                                                textAlign: "center",
                                                fontWeight: "400",
                                                fontSize: 14,
                                                color: themeColors.text
                                            }}>Seleccionar color</span></> : <></>
                                    }
                                </div>
                            </div>

                    }
                </div>

            </div>
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
                                                    //backgroundColor: themeColors[color.name],
                                                    backgroundColor: (color.name in themeColors ? themeColors[color.name as keyof typeof themeColors] : color.name) || "#ccc",
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
        </FieldContainer>

    )
}

export default EditableColorField
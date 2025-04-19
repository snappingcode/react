import React, { useEffect, useRef, useState } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';
import { themeColors } from '../../../config';
import lightenDarkenColor from '../../../utils/lightenDarkenColor';
import Popover from '../../Popover/Popover';
import IconButton from '../../buttons/IconButton/IconButton';
import Icon from '../../Icon/Icon';

interface EditablePastelColorFieldProps {
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

    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
}

const EditablePastelColorField: React.FC<EditablePastelColorFieldProps> = ({
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
    headerStyle,
    bodyStyle,

}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value as any);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleEditStart = () => {
        setIsEditing(true);
        onEditStart?.();
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setTempValue(value);
        onEditCancel?.();
    };

    const handleEditError = (error: any) => {
        setIsEditing(false);
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

    const togglePopover = () => setIsPopoverOpen((prev) => !prev);
    const closePopover = () => setIsPopoverOpen(false);

    const handleSelectColor = (
        event: React.MouseEvent<HTMLButtonElement>,
        color: string,

    ) => {
        event.preventDefault();
        setIsPopoverOpen(false);
        setTempValue(color);
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
        </FieldContainer>

    )
}

export default EditablePastelColorField
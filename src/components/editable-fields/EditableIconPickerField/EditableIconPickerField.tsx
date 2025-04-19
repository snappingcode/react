import React, { useEffect, useState } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';

import IconPickerField from '../../fields/IconPickerField/IconPickerField';
import Icon from '../../Icon/Icon';

interface EditableIconPickerFieldProps {
    label?: string;
    description?: string;
    name: string;
    value: string;
    onChange?: (newValue?: string) => void;
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

}

const EditableIconPickerField: React.FC<EditableIconPickerFieldProps> = ({
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

}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value as any);
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
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    //cursor: 'pointer',
                }}
            >

                {
                    isEditing ?
                        <div>

                            <IconPickerField
                                value={tempValue}
                                onChange={(value) => {
                                    setTempValue(value);

                                }}
                                containerStyle={{
                                    padding: 0,
                                    position: 'relative',
                                    top: -5
                                }}
                                bodyStyle={{
                                    padding: 2.5,
                                }}
                            />
                        </div> :

                        <div

                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 10,
                                background: "#fff",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                filter: "drop-shadow(0 1.5px 0 #ccc)",
                                position: "relative",
                                marginTop: 7.5,
                                marginBottom: 7.5
                            }}
                        >
                            {
                                tempValue ?
                                    <Icon
                                        name={tempValue}
                                        size={50}
                                        style={{

                                        }}
                                    /> : <>Sin ícono</>
                            }


                        </div>

                }

            </div>
        </FieldContainer>

    )
}

export default EditableIconPickerField
import React, { useEffect, useState } from "react";

import EditFieldControls from "../../EditFieldControls/EditFieldControls";
import TextField from "../../fields/TextField/TextField";


interface EditableTextFieldProps {
    label?: string;
    description?: string;
    placeholder?: string;
    name: string;
    value: string;
    onChange?: (newValue: string) => void;
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

const EditableTextField: React.FC<EditableTextFieldProps> = ({
    label,
    description,
    placeholder,
    name,
    value = "",
    onChange,
    onEditStart,
    onEditSuccess,
    onEditError,
    onEditCancel,
    containerStyle,
    inputStyle,
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
    const [tempValue, setTempValue] = useState(value);

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
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            position: 'relative',
            ...containerStyle
        }}>

            <TextField
                label={label}
                description={description}
                placeholder={placeholder}
                value={tempValue}
                onChange={(value) => setTempValue(value)}
                disabled={!isEditing}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                descriptionStyle={descriptionStyle}
                containerStyle={{
                    paddingRight: isEditing ? 80 : 30,

                }}
            />
            <EditFieldControls
                initialValue={value}
                editedValue={tempValue}
                fieldName={name}
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
                    position: 'absolute',
                    right: 0,
                    top: 0
                }}
            />
        </div>
    );
};

export default EditableTextField;

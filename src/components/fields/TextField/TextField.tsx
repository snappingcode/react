import React, { useState } from 'react';
import { themeColors } from '../../../config';

interface TextFieldProps {
    label?: string;
    description?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave?: (value: string) => void;
    onCancel?: () => void;
    placeholder?: string;
    mode?: 'create' | 'edit' | 'readOnly';
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    [key: string]: any;
}

const TextField: React.FC<TextFieldProps> = ({
    label,
    description,
    value,
    onChange,
    onSave,
    onCancel,
    placeholder,
    mode = 'create',
    containerStyle,
    labelStyle,
    inputStyle,
    descriptionStyle,
    className,
    id,
    ...props
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleSave = () => {
        if (onSave) onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
        if (onCancel) onCancel();
    };

    const renderInput = () => {
        if (mode === 'readOnly') {
            return (
                <span
                    style={{
                        display: 'inline-block',
                        padding: '5px',
                        color: themeColors.text,
                        background: 'transparent',
                        ...inputStyle,
                    }}
                >
                    {value || '-'}
                </span>
            );
        }

        if (mode === 'edit' && !isEditing) {
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        id={id}
                        disabled
                        style={{
                            outline: 'none',
                            //backgroundColor: 'transparent',
                            border: 'none',
                            width: '100%',
                            color: themeColors.text,

                            ...inputStyle,
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        style={{
                            marginLeft: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: themeColors.primary,
                        }}
                    >
                        ✏️
                    </button>
                </div>
            );
        }

        return (
            <input
                type="text"
                value={isEditing ? tempValue : value}
                onChange={(e) => {
                    const newValue = e.target.value;
                    setTempValue(newValue);
                    if (!isEditing) onChange(e);
                }}
                placeholder={placeholder}
                id={id}
                disabled={mode === 'edit' && !isEditing}
                style={{
                    outline: 'none',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    color: themeColors.text,
                    padding: '10px',
                    boxSizing: 'border-box',
                    lineHeight: 1.2,
                    borderRadius: '10px',
                    ...inputStyle,
                }}
                {...props}
            />
        );
    };

    const renderEditControls = () => {
        if (mode === 'edit' && isEditing) {
            return (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                    <button
                        type="button"
                        onClick={handleSave}
                        style={{
                            background: themeColors.success,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            marginRight: '5px',
                        }}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            background: themeColors.danger,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div
                className={`text-field-container ${className}`}
                style={{
                    background: '#fff',
                    width: '100%',
                    borderColor: themeColors.medium,
                    borderWidth: '2px',
                    borderRadius: '10px',
                    borderStyle: 'solid',
                    boxSizing: 'border-box',
                    backgroundColor: '#fff',
                    position: 'relative',
                    //padding: '10px',
                    //marginTop: '10px',
                    ...containerStyle,
                }}
            >
                {label && (
                    <label
                        style={{
                            position: 'absolute',
                            top: '-13px',
                            left: '10px',
                            display: 'inline-block',
                            padding: '0 5px',
                            background: '#fff',
                            fontWeight: '600',
                            color: themeColors.text,
                            ...labelStyle,
                        }}
                    >
                        {label}
                    </label>
                )}

                {renderInput()}
                {renderEditControls()}
            </div>
            {description && (
                <p
                    style={{
                        fontWeight: 300,
                        fontStyle: 'italic',
                        display: 'block',
                        padding: '3px',
                        margin: 0,
                        color: themeColors.textTint,
                        fontSize: '.9em',
                        ...descriptionStyle,
                    }}
                >
                    {description}
                </p>
            )}
        </>
    );
};

export default TextField;

import React, { useEffect, useRef, useState } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';
import { themeColors } from '../../../config';

interface EditableRadioFieldProps {
    label?: string;
    description?: string;
    name: string;
    value: string;
    onChange?: (newValue: string) => void;
    onEditStart?: () => void;
    onEditSuccess?: (updatedValue: any) => void;
    onEditError?: (error: any) => void;
    onEditCancel?: () => void;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    savePath: string;
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    editIcon?: string;
    saveIcon?: string;
    cancelIcon?: string;
    options: any[];
    renderOption?: (option: any, isClickable?: boolean, index?: number, isActive?: boolean) => React.ReactNode; // Nueva prop
}

const EditableRadioField: React.FC<EditableRadioFieldProps> = ({
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
    options = [],
    renderOption, // Nueva prop
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    //const initialValue = useRef(value);

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
        //setTempValue(value);
        setTempValue(value);
        if (onEditError) onEditError(error);
    };

    const handleEditSuccess = (updatedValue: string) => {
        setIsEditing(false);
        setTempValue(updatedValue);
        onChange?.(updatedValue);
        onEditSuccess?.(updatedValue);

    };

    const handleClick = (index: number) => {
        //onChange?.(options[index]['value']);
        setTempValue(options[index]['value']);
    };
    useEffect(() => {
        if (JSON.stringify(value) !== JSON.stringify(tempValue)) {
            console.log('change value', value);
            setTempValue(value);
        }
    }, [value]);
    function getLabelByValue(value: string) {
        const option = options.find((option: any) => option.value === value);
        return option ? option?.label : null;
    }
    function getCurrentOption(value: string) {
        const option = options.find((option: any) => option.value === value);
        return option ? option : null;
    }
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
                    cursor: 'pointer',
                }}
            >

                {
                    isEditing ?
                        <div>
                            {options.map((option: any, index: number) => {
                                const isActive = tempValue === option.value;

                                // Usar `renderOption` si está definido
                                if (renderOption) {
                                    return (
                                        <div
                                            key={index}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleClick(index);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    handleClick(index);
                                                }
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                display: 'inline-block',
                                                margin: '3px',
                                            }}
                                        >
                                            {renderOption(option, true, index, isActive)}
                                        </div>
                                    );
                                }

                                // Fallback: Diseño predeterminado
                                return (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleClick(index);
                                        }}
                                        className={isActive ? 'active' : ''}
                                        style={{
                                            display: 'inline-block',
                                            borderRadius: '99px',
                                            border: `2px solid ${themeColors.primary}`,
                                            padding: '5px 10px',
                                            fontWeight: isActive ? 500 : 300,
                                            color: isActive ? '#fff' : themeColors.primary,
                                            fontSize: '.9em',
                                            margin: '3px',
                                            cursor: 'pointer',
                                            backgroundColor: isActive
                                                ? themeColors.primary
                                                : 'transparent',
                                        }}
                                    >
                                        <span>{option?.label}</span>
                                    </button>
                                );
                            })}
                        </div> :
                        <div>
                            {
                                renderOption ? renderOption(getCurrentOption(tempValue), false) : getLabelByValue(tempValue)
                            }
                        </div>
                }

            </div>
        </FieldContainer>

    )
}

export default EditableRadioField
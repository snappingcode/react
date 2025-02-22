import React from 'react';
import { themeColors } from '../../../config';

interface RadioFieldProps {
    label?: string;
    description?: string;
    value: string;
    onChange: (optionName: string) => void;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    options: any[];
    renderOption?: (option: any, index: number, isActive: boolean) => React.ReactNode; // Nueva prop
    [key: string]: any;
}

const RadioField: React.FC<RadioFieldProps> = ({
    label,
    description,
    value,
    onChange,
    containerStyle,
    headerStyle,
    bodyStyle,
    labelStyle,
    descriptionStyle,
    className,
    id,
    options = [],
    renderOption, // Nueva prop
    ...props
}) => {
    const handleClick = (index: number) => {
        onChange(options[index]['value']);
    };

    return (
        <>
            <div
                className={`radio-field-container ${className}`}
                style={{
                    backgroundColor: themeColors.light,
                    borderRadius: '10px',
                    padding: 10,
                    position: 'relative',
                    ...containerStyle,
                }}
            >
                <div
                    className={'field-header'}
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        position: 'relative',
                        boxSizing: 'border-box',
                        ...headerStyle,
                    }}
                >
                    <label
                        style={{
                            fontWeight: '600',
                            color: themeColors.text,
                            ...labelStyle,
                        }}
                    >
                        {label}
                    </label>
                </div>
                <div
                    className={'field-body'}
                    style={{
                        padding: '5px 10px 10px 10px',
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'nowrap',
                        alignItems: 'center',
                        cursor: 'pointer',
                        ...bodyStyle,
                    }}
                >
                    <div>
                        {options.map((option: any, index: number) => {
                            const isActive = value === option.value;

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
                                        {renderOption(option, index, isActive)}
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
                    </div>
                </div>
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

export default RadioField;

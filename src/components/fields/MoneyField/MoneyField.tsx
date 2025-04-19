import React from 'react';
import { themeColors } from '../../../config';

interface MoneyFieldProps {
    label?: string;
    description?: string;
    value?: number;
    onChange: (value: number) => void;
    decimalPlaces?: number; // Número de decimales permitidos
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    currencySymbol?: string;
    symbolPosition?: "start" | "end";
    symbolStyle?: React.CSSProperties;
}

const MoneyField: React.FC<MoneyFieldProps> = ({
    label,
    description,
    value = 0,
    onChange,
    decimalPlaces = 0,
    min,
    max,
    step,
    containerStyle,
    inputStyle,
    labelStyle,
    descriptionStyle,
    className,
    id,
    currencySymbol = "$",
    symbolPosition = "start",
    symbolStyle,
    placeholder
}) => {
    // Calcula el paso si no está definido
    const calculatedStep = step || (decimalPlaces > 0 ? 1 / Math.pow(10, decimalPlaces) : 1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedValue = parseFloat(e.target.value);
        if (!isNaN(parsedValue)) {
            onChange(parsedValue);
        }
    };

    return (
        <>
            <div
                id={id}
                className={`number-field-container ${className}`}
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
                <div style={{ display: "flex", alignItems: "center", ...containerStyle }}>
                    {symbolPosition === "start" && (
                        <span style={{
                            marginRight: 4,
                            color: themeColors.text,
                            fontWeight: 'bold',
                            padding: 5,
                            ...symbolStyle
                        }}>
                            {currencySymbol}
                        </span>
                    )}

                    <input
                        type="number"
                        value={value}
                        step={calculatedStep}
                        min={min}
                        max={max}
                        onChange={handleChange}
                        placeholder={placeholder}
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
                    />
                    {symbolPosition === "end" && (
                        <span style={{
                            marginLeft: 4,
                            color: themeColors.text,
                            fontWeight: 'bold',
                            padding: 5,
                            ...symbolStyle
                        }}>
                            {currencySymbol}
                        </span>
                    )}
                </div>
            </div>
            {description && (
                <p
                    style={{
                        fontStyle: 'italic',
                        fontSize: '0.9em',
                        ...descriptionStyle,
                    }}
                >
                    {description}
                </p>
            )}
        </>

    );
};

export default MoneyField;

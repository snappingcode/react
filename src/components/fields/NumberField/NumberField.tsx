import React from 'react';

interface NumberFieldProps {
    label?: string;
    description?: string;
    value?: number;
    onChange: (value: number) => void;
    decimalPlaces?: number; // Número de decimales permitidos
    min?: number;
    max?: number;
    step?: number;
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({
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
        <div
            id={id}
            className={`number-field-container ${className}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                ...containerStyle,
            }}
        >
            {label && (
                <label
                    style={{
                        fontWeight: 'bold',
                        ...labelStyle,
                    }}
                >
                    {label}
                </label>
            )}
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
            <input
                type="number"
                value={value}
                step={calculatedStep}
                min={min}
                max={max}
                onChange={handleChange}
                style={{
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    ...inputStyle,
                }}
            />
        </div>
    );
};

export default NumberField;

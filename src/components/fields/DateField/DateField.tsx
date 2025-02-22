import React from 'react';

interface DateFieldProps {
    label?: string;
    description?: string;
    value?: string; // Formato ISO (YYYY-MM-DD)
    onChange: (value: string) => void;
    minDate?: string; // Fecha mínima (YYYY-MM-DD)
    maxDate?: string; // Fecha máxima (YYYY-MM-DD)
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
}

const DateField: React.FC<DateFieldProps> = ({
    label,
    description,
    value,
    onChange,
    minDate,
    maxDate,
    containerStyle,
    inputStyle,
    labelStyle,
    descriptionStyle,
    className,
    id,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value); // Devuelve el valor de la fecha seleccionada
    };

    return (
        <div
            id={id}
            className={`date-field-container ${className}`}
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
                type="date"
                value={value}
                min={minDate}
                max={maxDate}
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

export default DateField;

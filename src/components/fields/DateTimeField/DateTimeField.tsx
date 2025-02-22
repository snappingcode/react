import React from 'react';

interface DateTimeFieldProps {
    label?: string;
    description?: string;
    value?: string; // Formato ISO (YYYY-MM-DDTHH:mm:ss)
    onChange: (value: string) => void;
    minDateTime?: string; // Fecha y hora mínima (YYYY-MM-DDTHH:mm)
    maxDateTime?: string; // Fecha y hora máxima (YYYY-MM-DDTHH:mm)
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
}

const DateTimeField: React.FC<DateTimeFieldProps> = ({
    label,
    description,
    value,
    onChange,
    minDateTime,
    maxDateTime,
    containerStyle,
    inputStyle,
    labelStyle,
    descriptionStyle,
    className,
    id,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value); // Devuelve el valor seleccionado como string ISO
    };

    return (
        <div
            id={id}
            className={`date-time-field-container ${className}`}
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
                type="datetime-local"
                value={value}
                min={minDateTime}
                max={maxDateTime}
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

export default DateTimeField;

import React from 'react';

interface TimeFieldProps {
    label?: string;
    description?: string;
    value?: string; // Formato HH:mm o HH:mm:ss
    onChange: (value: string) => void;
    step?: number; // Intervalo en segundos entre opciones (p.ej., 60 para intervalos de un minuto)
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
}

const TimeField: React.FC<TimeFieldProps> = ({
    label,
    description,
    value,
    onChange,
    step,
    containerStyle,
    inputStyle,
    labelStyle,
    descriptionStyle,
    className,
    id,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value); // Devuelve el valor seleccionado como string en formato HH:mm o HH:mm:ss
    };

    return (
        <div
            id={id}
            className={`time-field-container ${className}`}
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
                type="time"
                value={value}
                step={step}
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

export default TimeField;

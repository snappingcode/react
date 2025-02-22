import React from 'react';

interface YearFieldProps {
    label?: string;
    description?: string;
    value?: number; // Año seleccionado
    onChange: (value: number) => void;
    minYear?: number; // Año mínimo permitido
    maxYear?: number; // Año máximo permitido
    step?: number; // Incremento/decremento por paso
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
}

const YearField: React.FC<YearFieldProps> = ({
    label,
    description,
    value,
    onChange,
    minYear,
    maxYear,
    step = 1,
    containerStyle,
    inputStyle,
    labelStyle,
    descriptionStyle,
    className,
    id,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const year = parseInt(e.target.value, 10);
        if (!isNaN(year)) {
            onChange(year); // Devuelve el valor seleccionado como número
        }
    };

    return (
        <div
            id={id}
            className={`year-field-container ${className}`}
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
                value={value || ''}
                min={minYear}
                max={maxYear}
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

export default YearField;

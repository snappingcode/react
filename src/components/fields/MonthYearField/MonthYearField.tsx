import React from 'react';

interface MonthYearFieldProps {
    label?: string;
    description?: string;
    value?: string; // Formato YYYY-MM
    onChange: (value: string) => void;
    minMonthYear?: string; // Mes y año mínimo permitido (YYYY-MM)
    maxMonthYear?: string; // Mes y año máximo permitido (YYYY-MM)
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
}

const MonthYearField: React.FC<MonthYearFieldProps> = ({
    label,
    description,
    value,
    onChange,
    minMonthYear,
    maxMonthYear,
    containerStyle,
    inputStyle,
    labelStyle,
    descriptionStyle,
    className,
    id,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value); // Devuelve el valor seleccionado como string en formato YYYY-MM
    };

    return (
        <div
            id={id}
            className={`month-year-field-container ${className}`}
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
                type="month"
                value={value}
                min={minMonthYear}
                max={maxMonthYear}
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

export default MonthYearField;

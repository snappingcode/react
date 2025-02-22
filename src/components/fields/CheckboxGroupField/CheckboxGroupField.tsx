import React from 'react';

interface CheckboxOption {
    label: string;
    value: string | number | boolean;
}

interface CheckboxGroupFieldProps {
    label?: string;
    description?: string;
    options: CheckboxOption[];
    selectedValues: (string | number | boolean)[];
    onChange: (values: (string | number | boolean)[]) => void;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    optionContainerStyle?: React.CSSProperties;
    optionLabelStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    renderOption?: (
        option: CheckboxOption,
        index: number,
        isChecked: boolean
    ) => React.ReactNode; // Nueva prop
}

const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
    label,
    description,
    options,
    selectedValues,
    onChange,
    containerStyle,
    labelStyle,
    descriptionStyle,
    optionContainerStyle,
    optionLabelStyle,
    className,
    id,
    renderOption, // Nueva prop
}) => {
    const handleOptionChange = (value: string | number | boolean) => {
        const updatedValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        onChange(updatedValues);
    };

    return (
        <div
            id={id}
            className={`checkbox-group-field-container ${className}`}
            style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                padding: '10px',
                ...containerStyle,
            }}
        >
            {label && (
                <label
                    style={{
                        fontWeight: 'bold',
                        marginBottom: '5px',
                        display: 'block',
                        color: '#333',
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
                        color: '#666',
                        fontSize: '0.9em',
                        marginBottom: '10px',
                        ...descriptionStyle,
                    }}
                >
                    {description}
                </p>
            )}
            <div>
                {options.map((option, index) => {
                    const isChecked = selectedValues.includes(option.value);

                    // Usar `renderOption` si está definido
                    if (renderOption) {
                        return (
                            <div
                                key={index}
                                onClick={() => handleOptionChange(option.value)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleOptionChange(option.value);
                                    }
                                }}
                                style={{
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                }}
                            >
                                {renderOption(option, index, isChecked)}
                            </div>
                        );
                    }

                    // Fallback: Diseño predeterminado
                    return (
                        <div
                            key={index}
                            className="checkbox-group-option"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '8px',
                                cursor: 'pointer',
                                ...optionContainerStyle,
                            }}
                            onClick={() => handleOptionChange(option.value)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleOptionChange(option.value);
                                }
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleOptionChange(option.value)}
                                style={{ marginRight: '8px' }}
                            />
                            <span
                                style={{
                                    color: '#333',
                                    fontSize: '0.95em',
                                    ...optionLabelStyle,
                                }}
                            >
                                {option.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckboxGroupField;

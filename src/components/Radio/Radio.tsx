import React from 'react';
import { themeColors } from '../../config';

interface RadioProps {
    value: string;
    onChange: (optionName: string) => void;
    containerStyle?: React.CSSProperties;
    options: any[];
    className?: string;
    renderOption?: (option: any, isClickable?: boolean, index?: number, isActive?: boolean) => React.ReactNode; // Nueva prop
}

const Radio: React.FC<RadioProps> = ({
    value,
    onChange,
    containerStyle,
    options = [],
    className,
    renderOption,
}) => {
    const handleClick = (index: number) => {
        onChange(options[index]['value']);
    };

    return (
        <div
            className={className}
            style={{
                padding: '5px 10px 10px 10px',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'nowrap',
                alignItems: 'center',
                cursor: 'pointer',
                ...containerStyle,
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
                                padding: '10px 10px',
                                fontWeight: isActive ? 500 : 400,
                                color: isActive ? '#fff' : themeColors.primary,
                                fontSize: '.9em',
                                margin: '3px',
                                cursor: 'pointer',
                                lineHeight: 1,
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
    );
};

export default Radio;

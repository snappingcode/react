import React, { useEffect, useState } from 'react';
import { themeColors } from '../../config';
import IconButton from '../buttons/IconButton/IconButton';


interface CounterProps {
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    inputClassName?: string;
    onValueChange?: (value: number) => void;
    defaultValue?: number;
    maxValue?: number;
    minValue?: number;
    step?: number;
    disabled?: boolean;
    readOnly?: boolean;
}

const Counter: React.FC<CounterProps> = ({
    containerStyle,
    inputStyle,
    buttonStyle,
    onValueChange,
    defaultValue = 0,
    maxValue = Infinity,
    minValue = -Infinity,
    step = 1,
    disabled = false,
    readOnly = false,
    inputClassName,
}) => {
    const [value, setValue] = useState<number>(defaultValue);

    const handleChange = (newValue: number) => {
        if (newValue >= minValue && newValue <= maxValue) {
            setValue(newValue);
            onValueChange && onValueChange(newValue);
        }
    };

    const increment = () => {
        if (!disabled) handleChange(value + step);
    };

    const decrement = () => {
        if (!disabled) handleChange(value - step);
    };
    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue])
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: 5,
            ...containerStyle
        }}>
            {/* Decrement Button */}

            <IconButton
                style={{
                    background: themeColors.light,
                    ...buttonStyle
                }}
                type='clear'
                onClick={decrement}
                size={'xs'}
                icon='minus'
                disabled={disabled}
                hasShadow={false}
                color={themeColors.textShade}
            />

            {/* Input Field */}
            <input
                type="number"
                value={value}
                readOnly={readOnly}
                className={`${inputClassName} no-spinner`}
                style={{
                    textAlign: 'right',
                    width: '40px',
                    border: 'none',
                    ...inputStyle
                }}
                onChange={(e) => handleChange(Number(e.target.value))}
                disabled={disabled}
            />

            {/* Increment Button */}
            <IconButton
                type='clear'
                onClick={increment}
                size={'xs'}
                icon='plus'
                disabled={disabled}
                style={{
                    background: themeColors.light,
                    ...buttonStyle
                }}
                hasShadow={false}
                color={themeColors.textShade}
            />

        </div>
    );
};

export default Counter;

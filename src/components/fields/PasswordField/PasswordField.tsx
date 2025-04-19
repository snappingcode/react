import React, { useState, useRef } from 'react';
import { themeColors } from '../../../config';
import IconButton from '../../buttons/IconButton/IconButton';

interface PasswordFieldProps {
    label?: string;
    description?: string;
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    autoComplete?: 'off' | 'current-password' | 'new-password';
    toggleButtonSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    toggleButtonColor?: string;
    [key: string]: any;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    label,
    description,
    value,
    onChange,
    placeholder,
    containerStyle,
    labelStyle,
    inputStyle,
    descriptionStyle,
    className,
    id,
    autoComplete = 'off',
    toggleButtonSize,
    toggleButtonColor,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
        if (inputRef.current) {
            inputRef.current.type = showPassword ? 'password' : 'text';
        }
    };

    return (
        <>
            <div
                className={`text-field-container ${className}`}
                style={{
                    background: "#fff",
                    width: "100%",
                    borderColor: themeColors.medium,
                    borderWidth: "2px",
                    borderRadius: "10px",
                    borderStyle: "solid",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    position: "relative",
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    ...containerStyle
                }}
            >
                {label && (
                    <label
                        style={{
                            position: "absolute",
                            top: "-13px",
                            left: "10px",
                            display: "inline-block",
                            padding: "0 5px",
                            background: "#fff",
                            fontWeight: "600",
                            color: themeColors.text,
                            ...labelStyle
                        }}
                    >
                        {label}
                    </label>
                )}

                <input
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    //onChange={onChange}
                    onChange={(e) => {
                        const newValue = e.target.value;

                        if (onChange) onChange(newValue);
                    }}
                    placeholder={placeholder}
                    id={id}
                    autoComplete={autoComplete}
                    style={{
                        outline: "none",
                        backgroundColor: "transparent",
                        padding: "10px",
                        border: "none",
                        width: "100%",
                        color: themeColors.text,
                        boxSizing: "border-box",
                        lineHeight: 1.2,
                        borderRadius: '10px',
                        ...inputStyle
                    }}
                    {...props}
                />

                <IconButton
                    icon={showPassword ? 'hide' : 'show'}
                    size={toggleButtonSize || 'sm'}
                    type="clear"
                    color={toggleButtonColor || themeColors.text}
                    hasShadow={false}
                    onClick={toggleShowPassword}
                    style={{ marginRight: 5 }}
                />
            </div>

            {description && (
                <p
                    style={{
                        fontWeight: 300,
                        fontStyle: "italic",
                        display: "block",
                        padding: "3px",
                        margin: 0,
                        color: themeColors.textTint,
                        fontSize: ".9em",
                        ...descriptionStyle
                    }}
                >
                    {description}
                </p>
            )}
        </>
    );
};

export default PasswordField;

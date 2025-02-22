import React from 'react';
import { themeColors } from '../../../config';

interface LongTextFieldProps {
    label?: string;
    description?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number; // Number of lines
    resizable?: boolean; // Defines whether the field is expandable or not
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    [key: string]: any; // For additional props
}

const LongTextField: React.FC<LongTextFieldProps> = ({
    value,
    onChange,
    placeholder,
    rows = 3,
    resizable = true,
    label,
    description,
    containerStyle,
    labelStyle,
    descriptionStyle,
    className,
    id, ...props }) => {
    return (
        <>
            <div
                className={`long-text-field ${className}`}
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
                    padding: "10px",
                    marginTop: "10px",
                    ...containerStyle
                }}
                id={id}
            >
                <label style={{
                    position: "absolute",
                    top: "-13px",
                    left: "10px",
                    display: "inline-block",
                    padding: "0 5px",
                    background: "#fff",
                    fontWeight: "600",
                    color: themeColors.text,
                    ...labelStyle
                }}>{label}</label>

                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    style={{
                        resize: resizable ? 'both' : 'none',
                        outline: "none",
                        backgroundColor: "transparent",
                        border: "none",
                        width: "100%",
                        color: themeColors.text,
                    }} // Control de expansión
                    {...props}
                />
            </div>
            {description && <p style={{
                fontWeight: 300,
                fontStyle: "italic",
                display: "block",
                padding: "3px",
                margin: 0,
                color: themeColors.textTint,
                fontSize: ".9em",
                ...descriptionStyle
            }}>{description}</p>}
        </>

    );
};

export default LongTextField;

import React from "react";
import TextField from "../../fields/TextField/TextField";

interface ReadOnlyTextFieldProps {
    label?: string;
    description?: string;
    placeholder?: string;

    value: string;
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
}

const ReadOnlyTextField: React.FC<ReadOnlyTextFieldProps> = ({
    label,
    description,
    placeholder,

    value,
    containerStyle,
    inputStyle,
    labelStyle,
    descriptionStyle,
}) => {
    return (
        <div style={{ display: "flex", alignItems: "center", ...containerStyle }}>
            <TextField
                label={label}
                description={description}
                placeholder={placeholder}

                value={value}
                disabled
                inputStyle={{
                    backgroundColor: "#f5f5f5",
                    cursor: "not-allowed",
                    ...inputStyle,
                }}
                labelStyle={labelStyle}
                descriptionStyle={descriptionStyle}
            />
        </div>
    );
};

export default ReadOnlyTextField;

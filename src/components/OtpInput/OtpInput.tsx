import React, { useState, useRef, useEffect } from "react";

interface OtpInputProps {
    length?: number;
    onChange: (code: string) => void;
    onComplete?: (code: string) => void;
    autoFocus?: boolean;
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    inputClassName?: string;
    containerClassName?: string;
    type?: "number" | "text";
    disabled?: boolean;
    error?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
    length = 4,
    onChange,
    onComplete,
    autoFocus = false,
    containerStyle,
    inputStyle,
    inputClassName,
    containerClassName,
    type = "number",
    disabled = false,
    error = false,
}) => {
    const [values, setValues] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    // Handle input change
    const handleChange = (index: number, value: string) => {
        if (type === "number" && !/^\d*$/.test(value)) return; // Allow only numbers

        const newValues = [...values];
        newValues[index] = value.slice(-1); // Only allow one character per input
        setValues(newValues);
        onChange(newValues.join(""));

        // Move to the next input if value is entered
        if (value && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    // Handle backspace navigation
    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !values[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    // Handle pasting full OTP
    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pasteData = event.clipboardData.getData("text").slice(0, length);
        if (!/^\d*$/.test(pasteData)) return; // Allow only numbers

        const newValues = pasteData.split("").concat(Array(length).fill("")).slice(0, length);
        setValues(newValues);
        onChange(newValues.join(""));

        // Focus last filled input
        const nextEmptyIndex = newValues.findIndex((char) => char === "");
        if (nextEmptyIndex !== -1) {
            inputsRef.current[nextEmptyIndex]?.focus();
        } else {
            inputsRef.current[length - 1]?.blur();
        }
    };

    // Trigger onComplete when all fields are filled
    useEffect(() => {
        if (values.every((char) => char !== "") && onComplete) {
            onComplete(values.join(""));
        }
    }, [values, onComplete]);

    return (
        <div style={containerStyle} className={containerClassName}>
            {values.map((value, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputsRef.current[index] = el;
                    }}
                    type={type === "number" ? "tel" : "text"}
                    value={value}
                    maxLength={1}
                    disabled={disabled}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste} // Handle full OTP pasting
                    style={{
                        width: "40px",
                        height: "40px",
                        textAlign: "center",
                        fontSize: "18px",
                        border: `2px solid ${error ? "red" : "#ccc"}`,
                        borderRadius: "6px",
                        margin: "0 5px",
                        outline: "none",
                        ...inputStyle,
                    }}
                    className={inputClassName}
                    autoFocus={autoFocus && index === 0}
                />
            ))}
        </div>
    );
};

export default OtpInput;

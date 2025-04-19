import React, { useMemo } from "react";

export interface MoneyProps {
    amount: number;
    currencySymbol?: string;
    symbolPosition?: "start" | "end";
    decimalSeparator?: "." | "," | undefined;
    thousandsSeparator?: "." | "," | undefined;
    decimalPlaces?: number;
    containerStyle?: React.CSSProperties;
    symbolStyle?: React.CSSProperties;
    amountStyle?: React.CSSProperties;
    color?: string;
    fontSize?: number;
    fontWeight?: React.CSSProperties["fontWeight"];
}

const Money: React.FC<MoneyProps> = ({
    amount,
    currencySymbol = "$",
    symbolPosition = "start",
    decimalSeparator = ",",
    thousandsSeparator = ".",
    decimalPlaces = 2,
    containerStyle,
    symbolStyle,
    amountStyle,
    color,
    fontSize,
    fontWeight,
}) => {
    const formattedNumber = useMemo(() => {
        const [integerPart, decimalPart] = amount
            .toFixed(decimalPlaces)
            .split(".");

        const formattedInteger = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            thousandsSeparator
        );

        return `${formattedInteger}${decimalSeparator}${decimalPart}`;
    }, [amount, decimalSeparator, thousandsSeparator, decimalPlaces]);

    const sharedTextStyle: React.CSSProperties = {
        color,
        fontSize,
        fontWeight,
    };

    return (
        <div style={{ display: "flex", alignItems: "center", ...containerStyle }}>
            {symbolPosition === "start" && (
                <span style={{ marginRight: 4, ...sharedTextStyle, ...symbolStyle }}>
                    {currencySymbol}
                </span>
            )}
            <span style={{ ...sharedTextStyle, ...amountStyle }}>
                {formattedNumber}
            </span>
            {symbolPosition === "end" && (
                <span style={{ marginLeft: 4, ...sharedTextStyle, ...symbolStyle }}>
                    {currencySymbol}
                </span>
            )}
        </div>
    );
};

export default Money;

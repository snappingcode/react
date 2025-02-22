import React, { useState } from "react";
import themeColors from "../../../config/themeColors";
import AnimatedNumber from "../../AnimatedNumber/AnimatedNumber";
import Icon from "../../Icon/Icon";


interface DataPoint {
    period: string; // Período (e.g., "2024-12-07")
    displayPeriod: string; // Período legible para el usuario (e.g., "7 Dic. 2024")
    total: number; // Total del período
}

interface SummaryIndicatorProps {
    data: DataPoint[]; // Datos para el indicador
    decimalPlaces?: number; // Number of decimal places (default: 0)
    thousandSeparator?: string; // Separator for thousands (e.g., ",")
    decimalSeparator?: string; // Separator for decimals (e.g., ".")
}

const SummaryIndicator: React.FC<SummaryIndicatorProps> = ({
    data,
    decimalPlaces = 0,
    thousandSeparator = ',',
    decimalSeparator = '.',
}) => {
    const [currentIndex, setCurrentIndex] = useState(data.length - 1); // Último periodo por defecto

    // Obtiene el total del periodo actual
    const currentTotal = data[currentIndex].total;

    // Calcula la variación absoluta y porcentual
    const previousTotal = currentIndex > 0 ? data[currentIndex - 1].total : null;
    const absoluteVariation = previousTotal !== null ? currentTotal - previousTotal : null;
    const percentageVariation =
        previousTotal !== null ? ((absoluteVariation! / previousTotal) * 100).toFixed(0) : null;

    // Determina el color y el ícono de la variación
    const isPositive = absoluteVariation !== null && absoluteVariation >= 0;
    const variationColor = isPositive ? themeColors.success : themeColors.danger;
    const variationIcon = isPositive ? "upArrow" : "downArrow";

    // // Navega al periodo anterior
    // const handlePrevious = () => {
    //     if (currentIndex > 0) {
    //         setCurrentIndex(currentIndex - 1);
    //     }
    // };

    // // Navega al siguiente periodo
    // const handleNext = () => {
    //     if (currentIndex < data.length - 1) {
    //         setCurrentIndex(currentIndex + 1);
    //     }
    // };
    const formatValue = (value: number): string => {
        const parts = value.toFixed(decimalPlaces).split('.');
        const integerPart = parts[0]
            .replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator); // Apply thousand separator
        const decimalPart = parts[1] ? `${decimalSeparator}${parts[1]}` : '';
        return `${integerPart}${decimalPart}`;
    };
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    position: "relative",
                    flex: 1,
                    height: 100,
                    //backgroundColor: "#ccc"

                }}
            >


                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    {/* Número animado */}
                    <AnimatedNumber
                        from={0}
                        to={currentTotal}
                        duration={500}
                        decimalPlaces={decimalPlaces}
                        thousandSeparator={thousandSeparator}
                        decimalSeparator={decimalSeparator}
                        style={{
                            fontSize: "27px",
                            fontWeight: "900",
                            color: themeColors.textShade
                        }}
                    />

                    {/* Variación */}
                    {absoluteVariation !== null && percentageVariation !== null && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            top: -7
                            //gap: "5px"
                        }}>
                            <Icon name={variationIcon} color={variationColor} size={17} />
                            <div style={{ color: variationColor, fontSize: "14px" }}>
                                {absoluteVariation > 0 ? "+" : ""}
                                {formatValue(absoluteVariation)} ({percentageVariation}%)
                            </div>
                        </div>
                    )}
                </div>

            </div>
            {/* <div>
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    style={{
                        background: currentIndex === 0 ? "#ccc" : "#007bff",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                        borderRadius: "4px",
                    }}
                >
                    {"<"}
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === data.length - 1}
                    style={{
                        background: currentIndex === data.length - 1 ? "#ccc" : "#007bff",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        cursor: currentIndex === data.length - 1 ? "not-allowed" : "pointer",
                        borderRadius: "4px",
                    }}
                >
                    {">"}
                </button>
            </div> */}

        </div>

    );
};

export default SummaryIndicator;

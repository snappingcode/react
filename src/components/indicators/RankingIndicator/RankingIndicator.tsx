import React from "react";
import themeColors from "../../../config/themeColors";
import Thumbnail from "../../Thumbnail/Thumbnail";


interface RankingValue {
    label: string; // Nombre del ítem (e.g., "Fernet")
    value: number; // Valor del ítem
    color: string; // Color asociado
    thumbnailSrc?: string; // Imagen en miniatura (opcional)
}

interface RankingIndicatorProps {
    data: RankingValue[]; // Datos para el ranking
    maxItemsToShow?: number; // Máximo número de ítems para mostrar (default: 10)
}

const RankingIndicator: React.FC<RankingIndicatorProps> = ({
    data,
    maxItemsToShow = 10,
}) => {
    const sortedData = data.slice(0, maxItemsToShow);

    return (
        <div style={{ width: "100%", padding: "0px", boxSizing: "border-box" }}>
            <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
                {sortedData.map((item, index) => (
                    <li
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "3px",
                            padding: "3px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "6px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        {/* Número de posición */}
                        <span
                            style={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                marginRight: "4px",
                                color: themeColors.text,
                            }}
                        >
                            {index + 1}.
                        </span>

                        {/* Miniatura (si está disponible) */}
                        {item.thumbnailSrc && (
                            <Thumbnail
                                src={item.thumbnailSrc}
                                alt={item.label}
                                // size="sm"
                                shape="circle"
                                border="thin"
                                style={{
                                    marginRight: "3px",
                                    width: 25,
                                    height: 25,
                                    borderWidth: 0
                                }}
                            />
                        )}

                        {/* Label */}
                        <div style={{
                            height: 32,
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}>
                            <span style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "400",
                                lineHeight: 1.1
                            }}>
                                {item.label}
                            </span>
                        </div>


                        {/* Valor */}
                        <span
                            style={{
                                fontWeight: "900",
                                fontSize: "13px",
                                color: themeColors.primary,
                                paddingLeft: 3
                                //color: item.color,
                            }}
                        >
                            {item.value}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RankingIndicator;

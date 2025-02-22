import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Value {
    label: string; // Nombre del segmento (e.g., "Ventas", "Gastos")
    value: number; // Valor del segmento
    color: string; // Color del segmento
}

interface DataPoint {
    period: string; // Período (e.g., "2024-12-07")
    displayPeriod: string; // Período legible para el usuario (e.g., "7 Dic. 2024")
    values: Value[]; // Valores dentro del gráfico
}

interface MiniPieChartProps {
    data: DataPoint[]; // Datos para el gráfico
    width?: number | string; // Ancho del gráfico
    height?: number; // Alto del gráfico
    onPeriodChange?: (periodIndex: number, periodData: DataPoint) => void; // Callback al cambiar de periodo
    onSliceClick?: (sliceIndex: number, value: Value) => void; // Callback al seleccionar una porción
}

const MiniPieChart: React.FC<MiniPieChartProps> = ({
    data,
    width = "100%",
    height = 150,
    onPeriodChange,
    onSliceClick,
}) => {
    const [currentIndex, setCurrentIndex] = useState(data.length - 1); // Comienza en el último periodo
    const [chartData, setChartData] = useState<ChartData<"pie", number[], string>>({
        labels: [],
        datasets: [],
    });

    // Configuración de opciones para Chart.js
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                // callbacks: {
                //     label: (context: any) => {
                //         return `${context.label}: ${context.raw}`;
                //     },
                // },
            },
        },
        onClick: (event: any, elements: any) => {
            if (elements.length > 0) {
                const sliceIndex = elements[0].index;
                const selectedValue = data[currentIndex].values[sliceIndex];
                if (onSliceClick) onSliceClick(sliceIndex, selectedValue);
            }
        },
    };

    // Adapta los datos al formato requerido por Chart.js
    const adaptDataForChart = (dataPoint: DataPoint): ChartData<"pie", number[], string> => {
        return {
            labels: dataPoint.values.map((item) => item.label),
            datasets: [
                {
                    data: dataPoint.values.map((item) => item.value),
                    backgroundColor: dataPoint.values.map((item) => item.color),
                    borderWidth: 1,
                },
            ],
        };
    };

    // Actualiza los datos del gráfico cuando cambia el índice
    useEffect(() => {
        const adaptedData = adaptDataForChart(data[currentIndex]);
        setChartData(adaptedData);
        if (onPeriodChange) onPeriodChange(currentIndex, data[currentIndex]);
    }, [currentIndex]);

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

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                {/* <button
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
                </button> */}
                <div style={{ position: "relative", width, height }}>
                    <Pie data={chartData} options={chartOptions} />
                </div>

                {/* <button
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
                </button> */}
            </div>
        </div>
    );
};

export default MiniPieChart;

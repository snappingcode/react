import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import themeColors from "../../../config/themeColors";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataPoint {
    period: string;
    displayPeriod?: string;
    total?: number;
}

interface MiniBarChartProps {
    data: DataPoint[]; // Datos para el gráfico
    width?: number | string; // Ancho del gráfico
    height?: number; // Alto del gráfico
    barColor?: string; // Color de las barras
    barBorderWidth?: number; // Grosor del borde de las barras
    barBorderColor?: string; // Color del borde de las barras
    highlightIndex?: number; // Índice de la barra destacada
    highlightColor?: string; // Color de la barra destacada
    decimalPrecision?: number; // Precisión decimal
    onBarClick?: (dataPoint: DataPoint, index: number) => void; // Evento de clic en una barra
}

const MiniBarChart: React.FC<MiniBarChartProps> = ({
    data,
    width = "100%",
    height = 70,
    barColor = themeColors.medium,
    barBorderWidth = 0,
    barBorderColor = "transparent",
    highlightIndex,
    highlightColor = themeColors.primary,
    decimalPrecision = 2,
    onBarClick,
}) => {
    const [currentIndex, setCurrentIndex] = useState(highlightIndex ?? data.length - 1);
    const [chartData, setChartData] = useState<ChartData<"bar", number[], string>>({
        labels: [],
        datasets: [],
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: { display: false }, // Ocultar eje X
            y: { display: false }, // Ocultar eje Y
        },
        onClick: (event: any, elements: any) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                setCurrentIndex(index);
                if (onBarClick) onBarClick(data[index], index);
            }
        },
    };

    const adaptDataForChart = (data: DataPoint[]): ChartData<"bar", number[], string> => {
        const labels = data.map((item) => item.displayPeriod || item.period);
        const values = data.map((item) => parseFloat((item.total ?? 0).toFixed(decimalPrecision)));

        return {
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: data.map((_, index) =>
                        index === currentIndex ? highlightColor : barColor
                    ),
                    borderColor: barBorderColor,
                    borderWidth: barBorderWidth,
                },
            ],
        };
    };

    useEffect(() => {
        const adaptedData = adaptDataForChart(data);
        setChartData(adaptedData);
    }, [data, currentIndex]);

    return (
        <div style={{ position: "relative", width, height }}>
            <Bar options={chartOptions} data={chartData} />
        </div>
    );
};

export default MiniBarChart;

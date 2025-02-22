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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Value {
    label: string; // Nombre del sub-bar (e.g., "Ventas", "Gastos")
    value: number; // Valor del sub-bar
    color: string; // Color del sub-bar
}

interface DataPoint {
    period: string; // Período (e.g., "2024-12-07")
    displayPeriod: string; // Período legible para el usuario (e.g., "7 Dic. 2024")
    values: Value[]; // Sub-bars dentro del grupo
}

interface MiniGroupedBarChartProps {
    data: DataPoint[]; // Datos para el gráfico
    width?: number | string; // Ancho del gráfico
    height?: number; // Alto del gráfico
    groupSpacing?: number; // Espaciado entre grupos de barras
    barSpacing?: number; // Espaciado entre barras dentro del grupo
    onSubBarClick?: (value: Value, index: number, group: DataPoint) => void; // Evento al hacer clic en un sub-bar
}

const MiniGroupedBarChart: React.FC<MiniGroupedBarChartProps> = ({
    data,
    width = "100%",
    height = 80,
    groupSpacing = 0.3, // Espaciado entre grupos
    barSpacing = 0.2, // Espaciado entre barras dentro del grupo
    onSubBarClick,
}) => {
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
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
        onClick: (event: any, elements: any) => {
            if (elements.length > 0) {
                const datasetIndex = elements[0].datasetIndex;
                const index = elements[0].index;
                const group = data[index];
                const value = group.values[datasetIndex];
                if (onSubBarClick) onSubBarClick(value, datasetIndex, group);
            }
        },
    };

    // Adapt data for Chart.js
    const adaptDataForChart = (data: DataPoint[]): ChartData<"bar", number[], string> => {
        const labels = data.map((item) => item.displayPeriod);
        const datasets = data[0].values.map((value, datasetIndex) => ({
            label: value.label,
            data: data.map((item) => item.values[datasetIndex].value),
            backgroundColor: value.color,
            barPercentage: 1 - barSpacing,
            categoryPercentage: 1 - groupSpacing, // Reduce el ancho de cada grupo para crear margen
        }));

        return { labels, datasets };
    };

    useEffect(() => {
        const adaptedData = adaptDataForChart(data);
        setChartData(adaptedData);
    }, [data, groupSpacing, barSpacing]);

    return (
        <div style={{ position: "relative", width, height }}>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default MiniGroupedBarChart;

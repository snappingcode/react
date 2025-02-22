import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import themeColors from "../../../config/themeColors";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataPoint {
    period: string;
    displayPeriod?: string;
    total?: number;
}

interface MiniLineChartProps {
    data: DataPoint[];
    width?: number | string;
    height?: number;
    lineColor?: string;
    lineWidth?: number;
    showMarkers?: boolean;
    markerStyle?: React.CSSProperties;
    highlightIndex?: number;
    highlightColor?: string;
    decimalPrecision?: number;
    onMarkerClick?: (dataPoint: DataPoint, index: number) => void;
}

const MiniLineChart: React.FC<MiniLineChartProps> = ({
    data,
    width = "100%",
    height = 70,
    lineColor = themeColors.medium,
    lineWidth = 2,
    showMarkers = true,
    markerStyle = { fill: themeColors.medium, stroke: "#ffffff", strokeWidth: 2 },
    highlightIndex,
    highlightColor = themeColors.primary,
    decimalPrecision = 2,
    onMarkerClick,
}) => {
    const [currentIndex, setCurrentIndex] = useState(highlightIndex ?? data.length - 1);
    const [chartData, setChartData] = useState<ChartData<"line", number[], string>>({
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
            x: { display: false },
            y: { display: false },
        },
        onClick: (event: any, elements: any) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                setCurrentIndex(index);
                if (onMarkerClick) onMarkerClick(data[index], index);
            }
        },
    };

    const adaptDataForChart = (data: DataPoint[]): ChartData<"line", number[], string> => {
        const labels = data.map((item) => item.displayPeriod || item.period);
        const values = data.map((item) => parseFloat((item.total ?? 0).toFixed(decimalPrecision)));

        return {
            labels,
            datasets: [
                {
                    data: values,
                    borderColor: lineColor,
                    borderWidth: lineWidth,
                    pointBackgroundColor: showMarkers
                        ? data.map((_, index) => (index === currentIndex ? highlightColor : markerStyle.fill || "transparent"))
                        : "transparent",
                    pointBorderColor: markerStyle.stroke || "transparent",
                    pointBorderWidth: 0,
                    pointRadius: showMarkers ? 4 : 0,
                    tension: 0.3,
                    fill: false,
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
            <Line options={chartOptions} data={chartData} />
        </div>
    );
};

export default MiniLineChart;

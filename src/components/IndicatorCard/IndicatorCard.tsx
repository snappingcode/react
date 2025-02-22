import React, { useState, CSSProperties } from 'react';
import AnimatedNumber from '../AnimatedNumber/AnimatedNumber';
import themeColors from '../../config/themeColors';

import MiniGroupedBarChart from '../miniCharts/MiniGroupedBarChart/MiniGroupedBarChart';
import MiniStackedBarChart from '../miniCharts/MiniStackedBarChart/MiniStackedBarChart';
import MiniPieChart from '../miniCharts/MiniPieChart/MiniPieChart';


import RankingIndicator from '../indicators/RankingIndicator/RankingIndicator';
import MiniLineChart from '../miniCharts/MiniLineChart/MiniLineChart';
import MiniBarChart from '../miniCharts/MiniBarChart/MiniBarChart';
import IconButton from '../buttons/IconButton/IconButton';
import SummaryIndicator from '../indicators/SummaryIndicator/SummaryIndicator';

// Represents a single value in 'values' (used in disaggregated and composite indicators)
interface Value {
    label: string; // Name of the value or category (e.g., "North", "Income")
    value: number; // Numerical value
    color?: string; // Associated color (optional)
}

// Data structure for a period in a simple or summary indicator
interface SimpleData {
    period: string; // Time period (e.g., "2024-01")
    displayPeriod?: string; // User-friendly display of the period
    total: number; // Total value for the period
}

// Data structure for a period in a disaggregated indicator
interface DisaggregatedData extends SimpleData {
    values: Value[]; // Breakdown of the total into categories
}

// Data structure for a period in a composite indicator
interface CompositeData {
    period: string; // Time period (e.g., "2024-01")
    displayPeriod?: string; // User-friendly display of the period
    values: Value[]; // Independent metrics for the period
}

// Data structure for a ranking indicator
interface RankingData {
    period: string; // Time period (e.g., "2024-01")
    displayPeriod?: string; // User-friendly display of the period
    values: Value[]; // Ranked items for the period
}

// Defines the type for the 'data' prop, supporting all indicator types
type IndicatorData = SimpleData[] | DisaggregatedData[] | CompositeData[] | RankingData[];

// Props for the IndicatorCard component
interface IndicatorCardProps {
    type: 'simple' | 'disaggregated' | 'composite' | 'summary' | 'ranking'; // Type of the indicator
    title: string; // Indicator title
    measurementUnit: string; // Unit of measurement (e.g., %, Unid)
    //decimalPrecision: number; // Number of decimal places
    chartType?: 'line' | 'bar' | 'groupedBar' | 'stackedBar' | 'pie' | 'multiLine' | 'lineBarCombo'; // Chart type
    data: IndicatorData; // Data for the indicator
    containerStyle?: CSSProperties; // Custom styles for the card container
    titleStyle?: CSSProperties; // Custom styles for the title
    valueStyle?: CSSProperties; // Custom styles for the value
    periodStyle?: CSSProperties; // Custom styles for the period
    labelStyle?: CSSProperties; // Custom styles for the selected label
    measurementUnitStyle?: CSSProperties; // Custom styles for the unit text
    decimalPlaces?: number; // Number of decimal places (default: 0)
    thousandSeparator?: string; // Separator for thousands (e.g., ",")
    decimalSeparator?: string; // Separator for decimals (e.g., ".")
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({
    type,
    title,
    measurementUnit,
    //decimalPrecision,
    chartType,
    data,
    containerStyle,
    titleStyle,
    valueStyle,
    periodStyle,
    labelStyle,
    measurementUnitStyle,
    decimalPlaces = 0,
    thousandSeparator = ',',
    decimalSeparator = '.',
}) => {
    // Get the latest period
    const latestPeriod = data[data.length - 1];
    const [currentColor, setCurrentColor] = useState<string | undefined>(
        type === 'disaggregated' || type === 'composite'
            ? (latestPeriod as DisaggregatedData | CompositeData).values[0].color
            : themeColors.primary
    );
    const [currentPeriod, setCurrentPeriod] = useState<string>(
        latestPeriod.displayPeriod || latestPeriod.period
    );
    const [currentValue, setCurrentValue] = useState<number>(
        type === 'simple' || type === 'summary'
            ? (latestPeriod as SimpleData).total
            : (latestPeriod as DisaggregatedData | CompositeData | RankingData).values[0].value
    );
    const [currentLabel, setCurrentLabel] = useState<string | undefined>(
        type === 'disaggregated' || type === 'composite'
            ? (latestPeriod as DisaggregatedData | CompositeData).values[0].label
            : undefined
    );

    // Default styles
    const defaultContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '5px',
        padding: '5px',
        width: '150px',
        height: '225px',
        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    };

    const defaultTitleStyle: CSSProperties = {
        fontSize: 14,
        fontWeight: 700,
        margin: 0,
        padding: 0,
        textAlign: 'center',
        lineHeight: 1.1,
        marginBottom: 7,
        color: themeColors.text,

    };
    const defaultPeriodStyle: CSSProperties = {
        fontSize: 15,
        color: themeColors.text,
        fontWeight: 900,
        marginBottom: 0
    };
    const defaultValueStyle: CSSProperties = {
        fontSize: chartType == 'pie' ? 16 : 22,
        color: themeColors.primary,
        fontWeight: 900,

    };

    const defaultLabelStyle: CSSProperties = {
        padding: 0,
        margin: 0,
        fontSize: '14px',
        color: chartType == 'pie' ? currentColor : themeColors.primary,
        position: 'relative',
        top: -7,
        //color: '#666',
        fontStyle: 'italic',
    };

    const defaultMeasurementUnitStyle: CSSProperties = {
        fontSize: 14,
        color: themeColors.textTint,
        marginLeft: '4px',
    };

    // Formats numerical values to the specified decimal precision
    //const formatValue = (value: number): string => value.toFixed(decimalPrecision);

    // Dynamically renders the chart based on the specified chart type
    const renderChart = () => {
        if (type === 'summary' || type === 'ranking') return null; // No charts for these types
        switch (chartType) {
            case 'line':
                return <div style={{
                    width: "100%",
                    marginTop: 10
                }}>
                    <MiniLineChart
                        data={data}
                        height={80}
                        onMarkerClick={((data: any, index) => {
                            console.log(data);
                            setCurrentPeriod(data.displayPeriod);
                            setCurrentValue(data.total);
                        })}
                    //width={100}
                    />
                </div>;
            case 'bar':
                return <div style={{
                    width: "100%",
                    marginTop: 10
                }}>
                    <MiniBarChart
                        data={data}
                        height={80}
                        onBarClick={((data: any, index) => {
                            console.log(data);
                            setCurrentPeriod(data.displayPeriod);
                            setCurrentValue(data.total);
                        })}
                    //width={100}
                    />
                </div>;
            case 'groupedBar':
                // Asegurarnos de que el tipo de datos sea CompositeData[]
                const groupedBarData: any = (data as CompositeData[]).filter((item) => item.values && item.values.length > 0);
                return (
                    <div
                        style={{
                            width: "100%",
                            //marginTop: 10,
                        }}
                    >
                        <MiniGroupedBarChart
                            data={groupedBarData}
                            height={80}
                            onSubBarClick={(value, index, group) => {
                                console.log(value, group);
                                setCurrentPeriod(group.displayPeriod || group.period);
                                setCurrentValue(value.value);
                                setCurrentLabel(value.label);
                                setCurrentColor(value.color);
                            }}
                        />
                    </div>
                );

            case 'stackedBar':
                const stackedBarData: any = (data as CompositeData[]).filter((item) => item.values && item.values.length > 0);
                return (
                    <div
                        style={{
                            width: "100%",
                            //marginTop: 10,
                        }}
                    >
                        <MiniStackedBarChart
                            data={stackedBarData}
                            height={80}
                            onSubBarClick={(value, index, group) => {
                                console.log(value, group);
                                setCurrentPeriod(group.displayPeriod || group.period);
                                setCurrentValue(value.value);
                                setCurrentLabel(value.label);
                                setCurrentColor(value.color);
                            }}
                        />
                    </div>
                );
            case 'pie':
                const pieBarData: any = (data as CompositeData[]).filter((item) => item.values && item.values.length > 0);
                return (
                    <div
                        style={{
                            width: "100%",
                            //marginTop: 10,
                        }}
                    >
                        <MiniPieChart
                            data={pieBarData}
                            height={90}
                            width={90}
                            onSliceClick={(index, value) => {
                                console.log(value, value);
                                //setCurrentPeriod(group.displayPeriod || group.period);
                                setCurrentValue(value.value);
                                setCurrentLabel(value.label);
                                setCurrentColor(value.color);
                            }}
                        />
                    </div>
                );
            case 'multiLine':
                return <div>/* Multi-line chart */</div>;
            case 'lineBarCombo':
                return <div>/* Line and bar combination chart */</div>;
            default:
                return null;
        }
    };

    const summaryData: any = data;
    const rankingData: any = data;
    return (
        <div className={'precooked-indicator-card'} style={{ ...defaultContainerStyle, ...containerStyle }}>
            {/* Indicator title */}
            <div
                className={'precooked-indicator-card-header'}
                style={{
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}>
                <h3 style={{ ...defaultTitleStyle, ...titleStyle }}>{title}</h3>
            </div>

            <div
                className={'precooked-indicator-card-body'}
                style={{

                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    flex: 1,
                    marginBottom: 5
                }}
            >
                {/* Selected period */}
                <div style={{ ...defaultPeriodStyle, ...periodStyle }}>{currentPeriod}</div>

                {/* Current value */}
                {
                    type !== 'ranking' && type !== "summary" &&
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 5
                    }}>
                        <AnimatedNumber
                            style={{ ...defaultValueStyle, ...valueStyle, color: currentColor }}
                            from={0} to={currentValue}
                            duration={500}
                            decimalPlaces={decimalPlaces}
                            thousandSeparator={thousandSeparator}
                            decimalSeparator={decimalSeparator}
                        />
                        {
                            measurementUnit && <span style={{ ...defaultMeasurementUnitStyle, ...measurementUnitStyle }}>({measurementUnit})</span>
                        }

                    </div>
                }
                {type === 'composite' && currentLabel && (
                    <p style={{ ...defaultLabelStyle, ...labelStyle }}>{currentLabel}</p>
                )}
                {
                    type !== 'ranking' && type !== 'summary' && renderChart()
                }
                {
                    type === 'summary' &&
                    <SummaryIndicator
                        data={summaryData}
                        decimalPlaces={decimalPlaces}
                        thousandSeparator={thousandSeparator}
                        decimalSeparator={decimalSeparator}
                    />
                }
                {
                    type === 'ranking' &&
                    <div
                        style={{
                            position: 'relative',
                            top: 0
                        }}>
                        <RankingIndicator
                            data={rankingData[data.length - 1]?.values}
                            maxItemsToShow={3}

                        />
                    </div>

                }
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                position: 'relative',
                top: type === 'ranking' ? -2 : 0
            }}>
                <IconButton
                    icon="chevronLeftSm"
                    type={'clear'}
                    hasShadow={false}
                    size='xs'
                    color={themeColors.text}
                    onClick={() => { }}
                />
                <IconButton
                    icon="chevronRightSm"
                    type={'clear'}
                    hasShadow={false}
                    size='xs'
                    color={themeColors.text}
                    onClick={() => { }}
                />
                <IconButton
                    icon="fullscreen"
                    type={'clear'}
                    hasShadow={false}
                    size='xs'
                    color={themeColors.text}
                    onClick={() => { }}
                />

            </div>
        </div>
    );
};

export default IndicatorCard;

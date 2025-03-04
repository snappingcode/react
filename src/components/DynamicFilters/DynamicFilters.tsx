import React, { useCallback, useState, useEffect } from "react";

import { themeColors } from "../../config";
import NumberField from "../fields/NumberField/NumberField";
import DateField from "../fields/DateField/DateField";
import DateTimeField from "../fields/DateTimeField/DateTimeField";
import MonthYearField from "../fields/MonthYearField/MonthYearField";
import YearField from "../fields/YearField/YearField";
import TextField from "../fields/TextField/TextField";
import ExpandablePanel from "../ExpandablePanel/ExpandablePanel";
import RadioField from "../fields/RadioField/RadioField";
import Button from "../buttons/Button/Button";

interface Filter {
    type: "date" | "dateTime" | "monthYear" | "year" | "number" | "text" | "boolean";
    displayType: string;
    name: string;
    label: string;
    operator: string;
    value: any;
    isActive: boolean;
}

interface DynamicFiltersProps {
    filters: Filter[];
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    footerStyle?: React.CSSProperties;
    onChange: (filters: Filter[]) => void;
    onApply?: (filters: Filter[]) => void;
    onReset?: () => void;
}

// 🔹 Operadores generales
const COMMON_OPERATORS = [
    { label: "Igual a", value: "equal" },
    { label: "Diferente de", value: "notEqual" },
    { label: "Mayor que", value: "greaterThan" },
    { label: "Mayor o igual", value: "greaterThanOrEqual" },
    { label: "Menor que", value: "lessThan" },
    { label: "Menor o igual", value: "lessThanOrEqual" },
    { label: "Entre", value: "between" },
];

// 🔹 Mapeo de operadores por tipo de filtro
const OPERATOR_OPTIONS: Record<Filter["type"], { label: string; value: string }[]> = {
    date: COMMON_OPERATORS,
    dateTime: COMMON_OPERATORS,
    monthYear: COMMON_OPERATORS,
    year: COMMON_OPERATORS,
    number: COMMON_OPERATORS,
    text: [
        { label: "Contiene", value: "like" },
        { label: "No contiene", value: "notLike" },
        { label: "Igual a", value: "equal" },
        { label: "Diferente de", value: "notEqual" },
    ],
    boolean: [
        { label: "Verdadero", value: "true" },
        { label: "Falso", value: "false" },
    ],
};

// 🔹 Verifica si un filtro debe estar activo
const isFilterActive = (filter: Filter): boolean => {
    if (filter.operator === "between") {
        const [val1, val2] = filter.value || [null, null];
        return val1 !== null && val2 !== null && val2 > val1;
    }
    return filter.value !== null && filter.value !== "";
};

const DynamicFilters: React.FC<DynamicFiltersProps> = ({
    filters,
    containerStyle,
    headerStyle,
    bodyStyle,
    footerStyle,
    onApply,
    onReset,
    onChange
}) => {
    // 📌 Estado local para manejar los filtros
    const [localFilters, setLocalFilters] = useState<Filter[]>(filters);

    // 📌 Sincroniza el estado interno si la prop `filters` cambia externamente
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // 📌 Maneja el cambio de operador
    const handleOperatorChange = useCallback((filterName: string, newOperator: string) => {
        setLocalFilters((prevFilters) => {
            const updatedFilters = prevFilters.map((filter) =>
                filter.name === filterName
                    ? {
                        ...filter,
                        operator: newOperator,
                        value: newOperator === "between" ? [null, null] : null,
                        isActive: false // Reseteamos isActive al cambiar de operador
                    }
                    : filter
            );
            onChange(updatedFilters);
            return updatedFilters;
        });
    }, [onChange]);

    // 📌 Maneja el cambio de valor
    const handleValueChange = useCallback((filterName: string, newValue: any, index?: number) => {
        setLocalFilters((prevFilters) => {
            const updatedFilters = prevFilters.map((filter) => {
                if (filter.name === filterName) {
                    let updatedValue = newValue;
                    if (filter.operator === "between") {
                        updatedValue = [...(filter.value || [null, null])];
                        updatedValue[index!] = newValue;
                    }
                    return {
                        ...filter,
                        value: updatedValue,
                        isActive: isFilterActive({ ...filter, value: updatedValue })
                    };
                }
                return filter;
            });
            onChange(updatedFilters);
            return updatedFilters;
        });
    }, [onChange]);

    const renderInputField = (filter: Filter, index?: number) => {
        const fieldProps = {
            value: index !== undefined ? filter.value?.[index] || "" : filter.value || "",
            onChange: (value: any) => handleValueChange(filter.name, value, index),
        };

        switch (filter.type) {
            case "number":
                return <NumberField {...fieldProps} />;
            case "date":
                return <DateField {...fieldProps} />;
            case "dateTime":
                return <DateTimeField {...fieldProps} />;
            case "monthYear":
                return <MonthYearField {...fieldProps} />;
            case "year":
                return <YearField {...fieldProps} />;
            default:
                return <TextField {...fieldProps} />;
        }
    };

    return (
        <div style={{ padding: 10, ...containerStyle }}>
            <div style={{ ...headerStyle }}>
                <h2>Filtros</h2>
            </div>
            <div style={{ marginTop: 10, marginBottom: 10, ...bodyStyle }}>
                {localFilters.map((filter) => (
                    <ExpandablePanel
                        key={filter.name}
                        containerStyle={{
                            borderBottom: "1px solid #ccc",
                            paddingBottom: 10,
                        }}
                        renderHeader={() => (
                            <span style={{ fontWeight: "bold", fontSize: "1.1rem", color: filter.isActive ? "green" : "black" }}>
                                {filter.label} {filter.isActive && "✔️"}
                            </span>
                        )}
                        renderBody={() => (
                            <>
                                <RadioField
                                    options={OPERATOR_OPTIONS[filter.type]}
                                    value={filter.operator}
                                    onChange={(newOperator) => handleOperatorChange(filter.name, newOperator)}
                                />

                                {filter.operator === "between" ? (
                                    <div style={{ display: "flex", gap: 8 }}>
                                        {renderInputField(filter, 0)}
                                        {renderInputField(filter, 1)}
                                    </div>
                                ) : (
                                    renderInputField(filter)
                                )}
                            </>
                        )}
                    />
                ))}
            </div>

            {/* Footer con botones */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 5,
                    marginTop: 10,
                    ...footerStyle
                }}
            >
                <Button
                    title="Limpiar"
                    color={themeColors.light}
                    onClick={() => {
                        if (onReset) {
                            onReset();
                        } else {
                            setLocalFilters(filters.map(f => ({ ...f, value: null, isActive: false }))); // Resetea valores
                            onChange(filters.map(f => ({ ...f, value: null, isActive: false })));
                        }
                    }}
                />
                <Button
                    title="Aplicar"
                    onClick={() => {
                        if (onApply) {
                            onApply(localFilters);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default DynamicFilters;

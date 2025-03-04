import React from 'react'
import Icon from '../Icon/Icon';
import IconButton from '../buttons/IconButton/IconButton';
interface Filter {
    type: "date" | "dateTime" | "monthYear" | "year" | "number" | "text" | "boolean";
    displayType: string;
    name: string;
    label: string;
    operator: string;
    value: any;
    isActive: boolean;
}
interface ActiveFiltersProps {
    filters: Filter[];
    containerStyle?: React.CSSProperties;
    pillStyle?: React.CSSProperties;
    onRemoveFilter: (index: number, filter: Filter) => void;

}
const ActiveFilters: React.FC<ActiveFiltersProps> = ({
    filters,
    containerStyle,
    pillStyle,
    onRemoveFilter
}) => {
    const operatorTranslations: any = {
        equal: "igual a",
        notEqual: "diferente de",
        greaterThan: "mayor que",
        greaterThanOrEqual: "mayor o igual que",
        lessThan: "menor que",
        lessThanOrEqual: "menor o igual",
        between: "entre",
        like: "contiene"
    }

    const renderPillText = (filter: Filter) => {
        switch (filter.type) {
            case "text":
                return (
                    <>
                        <b>{filter?.label}</b>{" "}
                        {operatorTranslations[filter.operator]} {filter.value}
                    </>
                );
            case "date":
                switch (filter.operator) {
                    case "between":
                        return (
                            <>
                                <b>{filter?.label}</b> desde {filter.value[0]} hasta{" "}
                                {filter.value[1]}
                            </>
                        );
                    default:
                        return (
                            <>
                                <b>{filter?.label}</b>{" "}
                                {operatorTranslations[filter.operator]}{" "}
                                {filter.value}
                            </>
                        );
                }

            case "number":
                switch (filter.operator) {
                    case "between":
                        return (
                            <>
                                <b>{filter?.label}</b> desde {filter.value[0]} hasta{" "}
                                {filter.value[1]}
                            </>
                        );
                    default:
                        return (
                            <>
                                <b>{filter?.label}</b>{" "}
                                {operatorTranslations[filter.operator]}{" "}
                                {filter.value}
                            </>
                        );
                }

            //   case "multiSelect":
            //     return (
            //       <>
            //         <b>{filter?.label}:</b>{" "}
            //         {filter.value
            //           .map((item: any) => item[filter.primaryKey])
            //           .join(", ")}
            //       </>
            //     );

            //   case "tags":
            //     return (
            //       <>
            //         <b>{filter?.label}:</b>{" "}
            //         {filter.value.map((tag: any) => tag.name).join(", ")}
            //       </>
            //     );
            //   case "statuses":
            //     return (
            //       <>
            //         <b>{filter?.label}:</b>{" "}
            //         {filter.value.map((item: any) => item.displayName).join(", ")}
            //       </>
            //     );
            case "boolean":
                return (
                    <>
                        <b>{filter?.label}</b> {filter.value == "yes" ? "Si" : "No"}
                    </>
                );
            default:
                return filter?.label;
        }
    };
    const handleRemove = (index: number) => {
        const updatedFilter = { ...filters[index], isActive: false, value: null };
        onRemoveFilter(index, updatedFilter);
    };


    return (
        <div style={{
            padding: 10,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 5,
            ...containerStyle
        }}>
            {filters.map((filter: any, index: number) => {
                if (filter.isActive) {
                    return (
                        <div
                            key={index}
                            style={{
                                padding: '2px 2px 2px 8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 3,
                                background: '#fff',
                                borderRadius: 99,
                                fontSize: 13,
                                filter: "drop-shadow(0 1.5px 0 #ccc)",
                                ...pillStyle
                            }}>
                            <Icon size={16} name="filters" />
                            <span style={{
                                position: "relative",
                                top: -1,
                            }}>{renderPillText(filter)}</span>

                            <IconButton
                                size={"xs"}
                                color="danger"
                                type='clear'
                                icon='close'
                                hasShadow={false}
                                onClick={() => {
                                    handleRemove(index)
                                }} />
                        </div>
                    );
                }
                return null;
            })}
        </div>
    )
}

export default ActiveFilters
import React, { } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';

interface ReadOnlyRadioFieldProps {
    label?: string;
    description?: string;
    value: string;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    options: any[];
    renderOption?: (option: any, isClickable?: boolean, index?: number, isActive?: boolean) => React.ReactNode; // Nueva prop
}

const ReadOnlyRadioField: React.FC<ReadOnlyRadioFieldProps> = ({
    label,
    description,
    value = "",
    containerStyle,
    labelStyle,
    descriptionStyle,
    options = [],
    renderOption, // Nueva prop
}) => {

    function getLabelByValue(value: string) {
        const option = options.find((option: any) => option.value === value);
        return option ? option?.label : null;
    }
    function getCurrentOption(value: string) {
        const option = options.find((option: any) => option.value === value);
        return option ? option : null;
    }
    return (
        <FieldContainer
            label={label}
            labelStyle={{
                ...labelStyle
            }}

            value={value}
            description={description}
            descriptionStyle={descriptionStyle}
            containerStyle={{
                ...containerStyle,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                }}
            >
                {
                    renderOption ? renderOption(getCurrentOption(value), false) : getLabelByValue(value)
                }
            </div>
        </FieldContainer>

    )
}

export default ReadOnlyRadioField
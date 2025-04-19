import React, { useEffect } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';
import Radio from '../../Radio/Radio';

interface RadioFieldProps {
    label?: string;
    description?: string;
    value: string;
    onChange: (optionName: string) => void;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    //id?: string;
    options: any[];
    renderOption?: (option: any, isClickable?: boolean, index?: number, isActive?: boolean) => React.ReactNode; // Nueva prop
}

const RadioField: React.FC<RadioFieldProps> = ({
    label,
    description,
    value,
    onChange,
    containerStyle,
    headerStyle,
    bodyStyle,
    labelStyle,
    descriptionStyle,
    className,
    //id,
    options = [],
    renderOption, // Nueva prop
}) => {

    useEffect(() => {
        console.log('value', value);
    }, [value])
    return (
        <>
            <FieldContainer
                label={label}
                labelStyle={{

                    ...labelStyle,
                }}
                description={description}
                descriptionStyle={descriptionStyle}
                containerStyle={{
                    ...containerStyle,
                }}
                headerStyle={{
                    ...headerStyle
                }}
                className={className}
            >
                <Radio
                    containerStyle={bodyStyle}
                    className='field-body'
                    options={options}
                    renderOption={renderOption}
                    onChange={onChange}
                    value={value}
                />

            </FieldContainer>
        </>
    );
};

export default RadioField;

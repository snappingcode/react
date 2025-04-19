import React, { useEffect, useId, useState } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';

import IconPickerModal from '../../modals/IconPickerModal/IconPickerModal';
import { themeColors } from '../../../config';
import Icon from '../../Icon/Icon';

interface IconPickerFieldProps {
    label?: string;
    description?: string;
    value: string;
    onChange: (optionName?: string) => void;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    //id?: string;
}

const IconPickerField: React.FC<IconPickerFieldProps> = ({
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
}) => {
    const [iconPickerModalIsOpen, setIconPickerModalIsOpen] = useState(false);
    const modalId = useId();
    const safeModalId = `icon-picker-modal${modalId.replace(/:/g, '-')}`.replace(/^-|-$/g, '');
    //const safeModalId = `icon-picker-modal${modalId.replace(/:/g, '-')}`;
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
                <div
                    className={'field-body'}
                    style={{
                        padding: '5px 10px 10px 10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...bodyStyle,
                    }}
                >
                    {
                        value ?
                            <a
                                onClick={() => {
                                    onChange()
                                }}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 10,
                                    background: "#fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    filter: "drop-shadow(0 1.5px 0 #ccc)",
                                    cursor: "pointer",
                                    position: "relative"
                                }}
                            >
                                <Icon
                                    name={value}
                                    size={50}
                                    style={{

                                    }}
                                />
                                <div style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 15,
                                    background: "#fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "absolute",
                                    top: -7,
                                    right: -7
                                }}>
                                    <Icon
                                        name={'close'}
                                        size={15}
                                        color={themeColors.danger}
                                        style={{

                                        }}
                                    />
                                </div>
                            </a>
                            :
                            <a
                                onClick={() => {
                                    setIconPickerModalIsOpen(true);
                                }}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 10,
                                    //background: "#fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    border: `2px dashed ${themeColors.medium}`,
                                    cursor: "pointer"
                                }}
                            >
                                <Icon name='tap' size={35} />
                                <span style={{
                                    textAlign: "center",
                                    fontWeight: "400",
                                    fontSize: 14
                                }}>Seleccionar ícono</span>
                            </a>

                    }
                </div>
                <IconPickerModal
                    id={`${safeModalId}`}
                    //title={""}
                    isOpen={iconPickerModalIsOpen}
                    onClose={(icon: any) => {
                        setIconPickerModalIsOpen(false);
                        if (icon) onChange(icon.name);
                    }}
                    fullScreen={true}
                />
            </FieldContainer>
        </>
    );
};

export default IconPickerField;

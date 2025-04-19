import React, { Fragment } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';
import { themeColors } from '../../../config';

import useIsMobile from '../../../hooks/useIsMobile';
import IconButton from '../../buttons/IconButton/IconButton';
import Button from '../../buttons/Button/Button';
import * as ev from "expr-eval";
import RadioField from '../RadioField/RadioField';
import ObjectField from '../ObjectField/ObjectField';
interface Slot {
    type: string;
    name: string;
    label?: string;
    config?: Record<string, any>;
}

interface DynamicListFieldProps {
    label?: string;
    description?: string;
    value: any[];
    onChange: (items: any[]) => void;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    disablePrimary?: boolean;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    slots: Slot[];
    itemStyle?: React.CSSProperties;
    breakpoint?: number;
    canAddItems?: boolean;
    canRemoveItems?: boolean;
    forceMobileView?: boolean;
    [key: string]: any;
}

const DynamicListField: React.FC<DynamicListFieldProps> = ({
    label,
    description,
    value = [],
    onChange,
    containerStyle,
    headerStyle,
    bodyStyle,
    labelStyle,
    descriptionStyle,
    className,
    itemStyle,
    breakpoint = 800,
    slots,
    canAddItems = true,
    canRemoveItems = true,
    forceMobileView = false
}) => {
    const { isMobile } = useIsMobile(breakpoint);

    const handleInputChange = (newValue: any, itemIndex: number, slotName: string) => {
        const newItems = [...value];
        newItems[itemIndex] = {
            ...newItems[itemIndex],
            [slotName]: newValue,
        };
        onChange(newItems);
    };

    const handleAddItem = () => {
        const newItem: Record<string, any> = {};
        slots.forEach((slot) => {
            switch (slot.type) {
                case 'radio':
                    newItem[slot.name] = slot?.config?.options?.[0]?.value ?? '';
                    break;
                case 'text':
                case 'longText':
                    newItem[slot.name] = '';
                    break;
                case 'number':
                    newItem[slot.name] = 0;
                    break;
                case 'boolean':
                    newItem[slot.name] = false;
                    break;
                case 'array':
                    newItem[slot.name] = [];
                    break;
                case 'object':
                    newItem[slot.name] = {};
                    break;
                default:
                    newItem[slot.name] = '';
            }
        });
        onChange([...value, newItem]);
    };

    const handleDeleteItem = (index: number) => {
        const newItems = value.filter((_, i) => i !== index);
        onChange(newItems);
    };

    const handleMoveItemUp = (index: number) => {
        if (index === 0) return;
        const newItems = [...value];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        onChange(newItems);
    };

    const handleMoveItemDown = (index: number) => {
        if (index === value.length - 1) return;
        const newItems = [...value];
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        onChange(newItems);
    };

    const shouldShowCell: any = (exp: any, context: any) => {
        if (!exp) return true;
        try {
            return exp ? ev.Parser.evaluate(exp, context) : false;
        } catch (error) {
            return false;
        }
    };

    const resolveSlotComponent = (slot: Slot, item: any, index: number) => {
        switch (slot.type) {
            case 'text':
                return (
                    <input
                        value={item[slot.name] ?? ''}
                        placeholder={slot?.config?.placeholder}
                        style={{
                            outline: 'none',
                            backgroundColor: 'transparent',
                            border: 'none',
                            width: '100%',
                            color: themeColors.text,
                            padding: '5px',
                            boxSizing: 'border-box',
                            lineHeight: 1.2,
                            borderRadius: '10px',
                            background: '#fff',
                            borderColor: themeColors.medium,
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            fontWeight: '400',
                            fontSize: 13,
                            ...slot?.config?.inputStyle,
                        }}
                        onChange={(e) => {
                            const value = e.target.value;
                            handleInputChange(value, index, slot.name);
                        }}
                    />
                );
            case 'longText':
                return (
                    <textarea
                        value={item[slot.name] ?? ''}
                        placeholder={slot?.config?.placeholder}
                        style={{
                            outline: 'none',
                            backgroundColor: 'transparent',
                            border: 'none',
                            width: '100%',
                            color: themeColors.text,
                            padding: '5px',
                            boxSizing: 'border-box',
                            lineHeight: 1.2,
                            borderRadius: '10px',
                            background: '#fff',
                            borderColor: themeColors.medium,
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            fontWeight: '400',
                            fontSize: 13,
                            ...slot?.config?.inputStyle,
                        }}
                        onChange={(e) => {
                            const value = e.target.value;
                            handleInputChange(value, index, slot.name);
                        }}
                    />
                );
            case 'radio':
                return (
                    <RadioField
                        label={slot?.config?.label}
                        options={slot?.config?.options}
                        //value={item[slot.name] || slot?.config?.options[0]?.value}
                        value={item[slot.name]}
                        onChange={(value) => {
                            handleInputChange(value, index, slot.name);
                        }}
                    />
                );
            case 'object':
                return (
                    <ObjectField
                        label={slot?.config?.label}
                        value={item[slot.name]}
                        onChange={(value) => {
                            handleInputChange(value, index, slot.name);
                        }}
                    />
                );
            default:
                return null;
        }
    };

    const renderItem = (item: any, index: number) => (
        <div
            key={`item-${index}`}
            className="snapping-dynamic-list-field-item"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: (forceMobileView || isMobile) ? 'column' : 'row',
                padding: '5px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                marginBottom: '10px',
                marginTop: '5px',
                //filter: 'drop-shadow(0 1.5px 0 #ccc)',
                gap: 5,
                //flexDirection: forceMobileView ? 'column' : 'row',
                ...itemStyle,
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                flexDirection: (forceMobileView || isMobile) ? 'column' : 'row',
                flex: 1,
                width: (forceMobileView || isMobile) ? '100%' : 'default',
            }}>
                {slots.map((slot, slotIndex) => (
                    <div
                        key={slotIndex}
                        style={{
                            padding: 5,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            width: (forceMobileView || isMobile) ? '100%' : 'default',
                        }}
                    >
                        {
                            ((slot?.config?.showIf && shouldShowCell(slot?.config?.showIf, item)) ||
                                !slot?.config?.showIf) && (
                                resolveSlotComponent(slot, item, index)
                            )
                        }

                    </div>
                ))}
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
            }}>
                <IconButton icon="upArrow" size={'sm'} type={'clear'} hasShadow={false} color={themeColors.primary} disabled={index == 0} onClick={() => handleMoveItemUp(index)} />
                <IconButton icon="downArrow" size={'sm'} type={'clear'} hasShadow={false} color={themeColors.primary} disabled={index >= value?.length - 1} onClick={() => handleMoveItemDown(index)} />
                {canRemoveItems && <IconButton icon="delete" size={'sm'} type={'clear'} hasShadow={false} color={themeColors.danger} onClick={() => handleDeleteItem(index)} />}
            </div>
        </div>
    );

    return (
        <FieldContainer
            label={label}
            labelStyle={{ ...labelStyle }}
            description={description}
            descriptionStyle={descriptionStyle}
            containerStyle={{ ...containerStyle }}
            headerStyle={{ ...headerStyle }}
            className={className}
        >
            <div
                className="field-body"
                style={{
                    padding: '5px 10px 10px 10px',
                    ...bodyStyle,
                }}
            >
                {canAddItems &&
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10
                    }}>
                        <Button
                            startIcon="add"
                            title="Agregar item"
                            size={'md'}
                            type={'clear'}
                            hasShadow={false}
                            onClick={handleAddItem}
                            startIconSize={20}
                        />
                    </div>
                }
                <div>
                    {value?.map((item: any, index: number) => (
                        <Fragment key={index}>{renderItem(item, index)}</Fragment>
                    ))}
                </div>
            </div>
        </FieldContainer>
    );
};

export default DynamicListField;

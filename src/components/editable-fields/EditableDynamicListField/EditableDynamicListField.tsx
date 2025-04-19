import React, { Fragment, useEffect, useRef, useState } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';
import { themeColors } from '../../../config';
import useIsMobile from '../../../hooks/useIsMobile';
import * as ev from "expr-eval";
import RadioField from '../../fields/RadioField/RadioField';
import ObjectField from '../../fields/ObjectField/ObjectField';
import IconButton from '../../buttons/IconButton/IconButton';
import Button from '../../buttons/Button/Button';

interface Slot {
    type: string;
    name: string;
    label?: string;
    config?: Record<string, any>;
}
interface EditableDynamicListFieldProps {
    label?: string;
    description?: string;
    name: string;
    value: any;
    onChange?: (items: any[]) => void;
    onEditStart?: () => void;
    onEditSuccess?: (updatedValue: any) => void;
    onEditError?: (error: any) => void;
    onEditCancel?: () => void;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    savePath: string;
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    editIcon?: string;
    saveIcon?: string;
    cancelIcon?: string;
    slots: Slot[];
    breakpoint?: number;
    canAddItems?: boolean;
    canRemoveItems?: boolean;
    forceMobileView?: boolean;

}

const EditableDynamicListField: React.FC<EditableDynamicListFieldProps> = ({
    label,
    description,
    name,
    value = [],
    onChange,
    onEditStart,
    onEditSuccess,
    onEditError,
    onEditCancel,
    containerStyle,
    headerStyle,
    bodyStyle,
    labelStyle,
    descriptionStyle,
    savePath,
    apiBaseUrl,
    useAuthToken = false,
    editIcon = "pencil",
    saveIcon = "check",
    cancelIcon = "close",
    breakpoint = 800,
    slots,
    itemStyle,
    canAddItems = true,
    canRemoveItems = true,
    forceMobileView = false
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    //const initialValue = useRef(value);
    const { isMobile } = useIsMobile(breakpoint);

    const handleEditStart = () => {
        setIsEditing(true);
        onEditStart?.();
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setTempValue(value);
        onEditCancel?.();
    };

    const handleEditError = (error: any) => {
        setIsEditing(false);
        setTempValue(value);
        if (onEditError) onEditError(error);
    };

    const handleEditSuccess = (updatedValue: any) => {
        setIsEditing(false);
        setTempValue(updatedValue);
        onChange?.(updatedValue);
        onEditSuccess?.(updatedValue);
    };

    const handleInputChange = (newValue: any, itemIndex: number, slotName: string) => {
        const newItems: any = [...tempValue];
        newItems[itemIndex] = {
            ...newItems[itemIndex],
            [slotName]: newValue,
        };
        //onChange?.(newItems);
        setTempValue(newItems);
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
        //onChange?.([...tempValue, newItem]);
        setTempValue([...tempValue, newItem]);
    };

    const handleDeleteItem = (index: number) => {
        const newItems = tempValue.filter((_: any, i: number) => i !== index);
        //onChange?.(newItems);
        setTempValue(newItems);
    };

    const handleMoveItemUp = (index: number) => {
        if (index === 0) return;
        const newItems = [...tempValue];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        //onChange?.(newItems);
        setTempValue(newItems);
    };

    const handleMoveItemDown = (index: number) => {
        if (index === tempValue.length - 1) return;
        const newItems = [...tempValue];
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        //onChange?.(newItems);
        setTempValue(newItems);
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

    const renderEditableItem = (item: any, index: number) => (
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
                <IconButton icon="downArrow" size={'sm'} type={'clear'} hasShadow={false} color={themeColors.primary} disabled={index >= tempValue?.length - 1} onClick={() => handleMoveItemDown(index)} />
                {canRemoveItems && <IconButton icon="delete" size={'sm'} type={'clear'} hasShadow={false} color={themeColors.danger} onClick={() => handleDeleteItem(index)} />}
            </div>
        </div>
    );
    const renderReadOnlyItem = (item: any, index: number) => (
        <div
            key={`read-only-item-${index}`}
            style={{
                display: 'flex',
                flexDirection: (forceMobileView || isMobile) ? 'column' : 'row',
                gap: 8,
                backgroundColor: '#f3f3f3',
                borderRadius: 6,
                padding: '8px 10px',
                marginBottom: 8,
                ...itemStyle,
            }}
        >
            {slots.map((slot, slotIndex) => {
                const show = !slot?.config?.showIf || shouldShowCell(slot?.config?.showIf, item);
                if (!show) return null;

                const displayValue = slot.type === 'object'
                    ? JSON.stringify(item[slot.name] ?? {})
                    : String(item[slot.name] ?? '');

                return (
                    <div key={slotIndex} style={{ flex: 1, minWidth: 120 }}>
                        <strong>{slot.label ?? slot.name}</strong>: {displayValue}
                    </div>
                );
            })}
        </div>
    );

    useEffect(() => {
        setTempValue(value);
    }, [value]);
    return (
        <FieldContainer
            label={label}
            labelStyle={{
                ...labelStyle
            }}
            name={name}
            value={value}
            tempValue={tempValue}
            description={description}
            descriptionStyle={descriptionStyle}
            showEditFieldControls
            onEditStart={handleEditStart}
            onEditSuccess={handleEditSuccess}
            onEditError={handleEditError}
            onEditCancel={handleEditCancel}
            savePath={savePath}
            apiBaseUrl={apiBaseUrl}
            useAuthToken={useAuthToken}
            editIcon={editIcon}
            saveIcon={saveIcon}
            cancelIcon={cancelIcon}
            containerStyle={{
                ...containerStyle,
            }}
            headerStyle={headerStyle}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
            >
                {
                    isEditing ?
                        <div
                            className="field-body"
                            style={{
                                padding: '5px 10px 10px 10px',
                                width: '100%',
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
                                {tempValue?.map((item: any, index: number) => (
                                    <Fragment key={index}>{renderEditableItem(item, index)}</Fragment>
                                ))}
                            </div>
                        </div> :
                        <div
                            className="field-body"
                            style={{
                                padding: '5px 10px 10px 10px',
                                width: '100%',
                                ...bodyStyle,
                            }}
                        >
                            {tempValue?.length === 0 ? (
                                <div style={{ fontStyle: 'italic', color: themeColors.medium }}>
                                    Sin elementos
                                </div>
                            ) : (
                                tempValue.map((item: any, index: number) => (
                                    <Fragment key={index}>{renderReadOnlyItem(item, index)}</Fragment>
                                ))
                            )}
                        </div>
                }

            </div>
        </FieldContainer>

    )
}

export default EditableDynamicListField
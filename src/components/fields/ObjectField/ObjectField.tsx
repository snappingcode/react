import React, { useEffect, useState } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';
import Button from '../../buttons/Button/Button';
import IconButton from '../../buttons/IconButton/IconButton';
import { themeColors } from '../../../config';

interface ObjectFieldProps {
    label?: string;
    description?: string;
    value: Record<string, any>;
    onChange: (newValue: Record<string, any>) => void;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
}

const ObjectField: React.FC<ObjectFieldProps> = ({
    label,
    description,
    value = {},
    onChange,
    containerStyle,
    headerStyle,
    bodyStyle,
    labelStyle,
    descriptionStyle,
    className,
}) => {
    const [items, setItems] = useState<{ key: string; value: any }[]>([]);

    useEffect(() => {
        if (value) {
            const keys = Object.keys(value || {});
            const initialItems = keys.map(key => ({ key, value: value[key] }));
            setItems(initialItems);
        }
    }, []);

    useEffect(() => {
        const newObject: Record<string, any> = {};
        items.forEach(({ key, value }) => {
            if (key) newObject[key] = value;
        });
        onChange(newObject);
    }, [items]);

    const handleAddItem = () => {
        setItems([...items, { key: '', value: '' }]);
    };

    const handleChange = (index: number, field: 'key' | 'value', newValue: string) => {
        const newItems = [...items];
        newItems[index][field] = newValue;
        setItems(newItems);
    };

    const handleDelete = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    return (
        <FieldContainer
            label={label}
            labelStyle={labelStyle}
            description={description}
            descriptionStyle={descriptionStyle}
            containerStyle={containerStyle}
            headerStyle={headerStyle}
            className={className}
        >
            <div style={{ ...bodyStyle }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                            }}
                        >
                            <input
                                type="text"
                                placeholder="key"
                                value={item.key}
                                onChange={(e) => handleChange(index, 'key', e.target.value)}
                                style={inputStyle}
                            />
                            <span>:</span>
                            <input
                                type="text"
                                placeholder="value"
                                value={item.value}
                                onChange={(e) => handleChange(index, 'value', e.target.value)}
                                style={inputStyle}
                            />
                            <IconButton
                                icon="delete"
                                size="sm"
                                type="clear"
                                hasShadow={false}
                                color={themeColors.danger}
                                onClick={() => handleDelete(index)}
                            />
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                    <Button
                        startIcon="add"
                        title="Agregar item"
                        size="md"
                        type="clear"
                        hasShadow={false}
                        onClick={handleAddItem}
                        startIconSize={20}
                        titleStyle={{ fontSize: 14 }}
                    />
                </div>
            </div>
        </FieldContainer>
    );
};

const inputStyle: React.CSSProperties = {
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
    fontWeight: 400,
    fontSize: 13,
};

export default ObjectField;

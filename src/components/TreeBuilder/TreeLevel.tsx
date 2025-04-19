import React from 'react';
import IconButton from '../buttons/IconButton/IconButton';
import { themeColors } from '../../config';
import TemplateRenderer from '../TemplateRenderer/TemplateRenderer';
import Icon from '../Icon/Icon';

interface TreeItem {
    id: string | number;
    label: string;
    children?: TreeItem[];
    [key: string]: any;
}

interface TreeLevelProps {
    items: TreeItem[];
    labelKey: string;
    onChange: (newItems: TreeItem[]) => void;
    onEdit?: (path: number[]) => void;
    itemLabelTemplate?: string;
}

const TreeLevel: React.FC<TreeLevelProps> = ({
    items,
    labelKey,
    itemLabelTemplate,
    onChange,
    onEdit
}) => {
    const [expandedMap, setExpandedMap] = React.useState<{ [id: string]: boolean }>({});
    const toggleExpand = (id: string | number) => {
        setExpandedMap(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    const handleAddChild = (parentIndex: number) => {
        //const newItems = [...items];
        const newItems = JSON.parse(JSON.stringify(items));
        const newLabel = generateUniqueLabel(newItems[parentIndex].children || [], labelKey);

        const child: TreeItem = {
            id: crypto.randomUUID(),
            label: newLabel,
            [labelKey]: newLabel,
        };

        newItems[parentIndex].children = newItems[parentIndex].children || [];
        newItems[parentIndex].children!.push(child);

        onChange(newItems);
    };

    const handleDelete = (index: number) => {
        const item = items[index];
        if (item.children?.length) {
            alert("Primero eliminá los hijos");
            return;
        }
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= newItems.length) return;

        const temp = newItems[index];
        newItems[index] = newItems[newIndex];
        newItems[newIndex] = temp;

        onChange(newItems);
    };

    const generateUniqueLabel = (items: TreeItem[], labelKey: string): string => {
        const base = 'Nuevo item';
        const existingLabels = new Set(items.map(item => item[labelKey]));
        if (!existingLabels.has(base)) return base;
        let i = 1;
        while (existingLabels.has(`${base} ${i}`)) i++;
        return `${base} ${i}`;
    };
    const getTemplateKeys = (template: string): string[] => {
        const regex = /{{\s*([\w\.]+)\s*}}/g;
        const keys = new Set<string>();
        let match;
        while ((match = regex.exec(template)) !== null) {
            keys.add(match[1]);
        }
        return Array.from(keys);
    };

    const hasAllTemplateKeys = (item: TreeItem, keys: string[]) => {
        return keys.every((key) => key in item);
    };
    return (
        <>
            {items.map((item: TreeItem, index) => {
                const isExpanded = expandedMap[item.id];

                return (
                    <div key={item.id} style={{ marginBottom: 8, paddingLeft: 8 }}>
                        <div
                            style={{
                                background: '#fff',
                                borderRadius: 6,
                                padding: 8,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                filter: 'drop-shadow(0 2px 0 #ccc)',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                cursor: item.children && item.children?.length > 0 ? 'pointer' : 'default',
                            }}
                                onClick={() => {
                                    if (item.children && item.children?.length > 0) toggleExpand(item.id)

                                }}>
                                {/* Expand icon (or space) */}
                                {item.children && item.children?.length > 0 ? (
                                    <div

                                        style={{
                                            width: 24,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            transform: `rotate(${isExpanded ? 90 : 0}deg)`,
                                            transition: 'transform 0.2s ease',

                                        }}
                                    >
                                        <Icon name="chevronRightSm" />
                                    </div>
                                ) : (
                                    <div style={{ width: 24 }} />
                                )}
                                <div
                                    style={{
                                        paddingLeft: 5
                                    }}
                                >
                                    {/* Label */}
                                    {itemLabelTemplate && hasAllTemplateKeys(item, getTemplateKeys(itemLabelTemplate)) ? (
                                        <TemplateRenderer template={itemLabelTemplate} context={item} />
                                    ) : (
                                        <div>{item[labelKey]}</div>
                                    )}
                                </div>


                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 4 }}>
                                {items.length > 1 && (
                                    <>
                                        <IconButton
                                            icon="arrowUp"
                                            onClick={() => handleMove(index, 'up')}
                                            disabled={index === 0}
                                            size="sm"
                                            type="clear"
                                            color={themeColors.text}
                                            hasShadow={false}
                                        />
                                        <IconButton
                                            icon="arrowDown"
                                            onClick={() => handleMove(index, 'down')}
                                            disabled={index === items.length - 1}
                                            size="sm"
                                            type="clear"
                                            color={themeColors.text}
                                            hasShadow={false}
                                        />
                                    </>
                                )}
                                <IconButton
                                    icon="add"
                                    onClick={() => handleAddChild(index)}
                                    color={themeColors.primary}
                                    size="sm"
                                    type="clear"
                                    hasShadow={false}
                                />
                                <IconButton
                                    icon="pencil"
                                    onClick={() => {
                                        onEdit?.([index])
                                    }}
                                    color={themeColors.text}
                                    size="sm"
                                    type="clear"
                                    hasShadow={false}
                                />
                                <IconButton
                                    icon="delete"
                                    onClick={() => handleDelete(index)}
                                    color={themeColors.danger}
                                    size="sm"
                                    type="clear"
                                    hasShadow={false}
                                />
                            </div>
                        </div>

                        {/* Subniveles */}
                        {item.children && item.children.length > 0 && isExpanded && (
                            <div style={{ marginTop: 6, marginLeft: 16 }}>
                                <TreeLevel
                                    items={item.children}
                                    labelKey={labelKey}
                                    onChange={(updatedChildren) => {
                                        //const updated = [...items];
                                        const updated = JSON.parse(JSON.stringify(items));
                                        updated[index].children = updatedChildren;
                                        onChange(updated);
                                    }}
                                    onEdit={(childPath) => onEdit?.([index, ...childPath])}
                                    itemLabelTemplate={itemLabelTemplate}
                                />
                            </div>
                        )}
                    </div>
                );
            })}

        </>
    );
};

export default TreeLevel;

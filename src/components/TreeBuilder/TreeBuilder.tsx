import React, { useState } from 'react';
import Button from '../buttons/Button/Button';
import TreeLevel from './TreeLevel';
import FormDialog from '../dialogs/FormDialog/FormDialog';

interface TreeItem {
    id: string | number;
    label: string;
    children?: TreeItem[];
    [key: string]: any;
}

interface TreeBuilderProps {
    containerStyle?: React.CSSProperties;
    data?: TreeItem[];
    labelKey?: string;
    onChange?: (updatedTree: TreeItem[]) => void;

    itemFields?: any[];
    itemLabelTemplate?: string;
    createFormTitle?: string;
    editFormTitle?: string;
}

const TreeBuilder: React.FC<TreeBuilderProps> = ({
    containerStyle,
    data = [],
    labelKey = 'label',
    onChange,

    itemFields = [],
    itemLabelTemplate,
    //createFormTitle = "Crear item",
    editFormTitle = "Editar item"
}) => {
    const [tree, setTree] = useState<TreeItem[]>(data);
    const [editItemPath, setEditItemPath] = useState<number[] | null>(null);
    const [formDialogIsOpen, setFormDialogIsOpen] = useState(false);
    // useEffect(() => {

    //     const dataCopy = JSON.parse(JSON.stringify(data));
    //     setTree(dataCopy);

    // }, [data])
    const handleTreeChange = (updated: TreeItem[]) => {
        console.log(updated)
        setTree(updated);
        onChange?.(updated);
    };
    const generateUniqueLabel = (items: TreeItem[], labelKey: string): string => {
        const base = 'Nuevo item';
        const existingLabels = new Set(items.map(item => item[labelKey]));
        if (!existingLabels.has(base)) return base;
        let i = 1;
        while (existingLabels.has(`${base} ${i}`)) i++;
        return `${base} ${i}`;
    };

    const handleAddRootItem = () => {
        const name = generateUniqueLabel(tree, labelKey);

        const newItem: TreeItem = {
            id: crypto.randomUUID(),
            label: name,
            [labelKey]: name,
        };

        handleTreeChange([...tree, newItem]);
    };

    const handleEditItem = (path: number[]) => {
        setEditItemPath(path);
        setFormDialogIsOpen(true);
    };

    const handleFormSubmit = (data: any) => {
        if (!editItemPath) return;
        const updatedTree = [...tree];
        let ref = updatedTree;
        for (let i = 0; i < editItemPath.length - 1; i++) {
            ref = ref[editItemPath[i]].children!;
        }
        const lastIndex = editItemPath[editItemPath.length - 1];
        ref[lastIndex] = {
            ...ref[lastIndex],
            ...data,
        };

        handleTreeChange(updatedTree);
        setFormDialogIsOpen(false);
        setEditItemPath(null);

    };

    const getItemAtPath = (tree: TreeItem[], path: number[]): any => {
        let current: any;
        let children = tree;
        for (const index of path) {
            current = children[index];
            if (!current) return null;
            children = current.children || [];
        }
        return current;
    };

    return (
        <div style={containerStyle}>
            <Button
                title="Agregar item"
                onClick={handleAddRootItem}
                style={{ marginBottom: 10 }}
            />
            <TreeLevel
                items={tree}
                labelKey={labelKey}
                onChange={handleTreeChange}
                onEdit={handleEditItem}
                itemLabelTemplate={itemLabelTemplate}
            />
            <FormDialog
                formTitle={editFormTitle}
                id="form-dialog"
                isOpen={formDialogIsOpen}
                zIndex={999999}
                onClose={() => setFormDialogIsOpen(false)}
                onSubmit={handleFormSubmit}
                fields={itemFields}
                windowStyle={{ minHeight: 150 }}
                data={editItemPath ? getItemAtPath(tree, editItemPath) : null}
            />
        </div>
    );
};

export default TreeBuilder;

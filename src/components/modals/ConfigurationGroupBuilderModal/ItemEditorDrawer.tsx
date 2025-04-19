import React, { useEffect, useState } from 'react';
import Drawer from '../../Drawer/Drawer';
import { themeColors } from '../../../config';
import IconButton from '../../buttons/IconButton/IconButton';
import ItemEditor from './ItemEditor';

interface ConfigType {
    description: string | null;
    colSpan: number;
    onlyTypes: string[];
    onlyWith: string[];
    showIf: string | null;
    showInModes: string[];
    readonly: boolean | null;
    readonlyIf: boolean | null;
    editable: boolean | null;
    editPath: string | null;
    editableIf: boolean;
    [key: string]: any;
}

interface ItemData {
    type: string;
    label: string;
    name: string;
    config: ConfigType;
    icon: string;
    [key: string]: any;
}

interface ItemEditorDrawerProps {
    isOpen: boolean;
    data: ItemData;
    onClose: (updatedData?: ItemData) => void;
}

const ItemEditorDrawer: React.FC<ItemEditorDrawerProps> = ({
    isOpen,
    data,
    onClose,
}) => {
    const [editedData, setEditedData] = useState<ItemData>(data);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        // Reset local state when opening
        if (isOpen) {
            setEditedData(data);
            setIsChanged(false);
        }
    }, [isOpen, data]);

    useEffect(() => {
        // Compare original vs edited
        const original = JSON.stringify(data);
        const current = JSON.stringify(editedData);
        setIsChanged(original !== current);
    }, [editedData, data]);

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => onClose()}
            width={350}
            anchor="right"
            drawerStyle={{
                backgroundColor: '#fff',
            }}
            zIndex={99999}
        >
            {isOpen && (
                <>
                    {/* Close Button */}
                    <IconButton
                        style={{
                            position: 'fixed',
                            top: 15,
                            left: -44,
                            zIndex: 1,
                            backgroundColor: '#fff',
                            borderRadius: '10px 0 0 10px',
                        }}
                        icon="close"
                        onClick={() => onClose()} // Close without saving
                        type="clear"
                        hasShadow={false}
                        color={themeColors.text}
                    />

                    {/* Save Button */}
                    <IconButton
                        style={{
                            position: 'fixed',
                            top: 65,
                            left: -44,
                            zIndex: 1,
                            backgroundColor: themeColors.primary,
                            borderRadius: '10px 0 0 10px',
                        }}
                        icon="check"
                        onClick={() => onClose(editedData)} // Close with updated data
                        type="clear"
                        hasShadow={false}
                        color={themeColors.text}
                        disabled={!isChanged} // Disabled unless changed
                    />

                    <div
                        style={{
                            overflowY: 'auto',
                            width: '100%',
                            height: '100vh',
                            padding: 10,
                        }}
                    >
                        <ItemEditor
                            data={editedData}
                            onChange={(newData) => {
                                setEditedData(newData);
                            }}
                        />
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ItemEditorDrawer;

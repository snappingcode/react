import React from 'react';
import SortableContent from './SortableContent';
import { DragHandleProvider } from './DragHandleContext';

interface SortableContainerProps {
    items: any[];
    onSortEnd: (newOrder: any[]) => void;
    renderItem: (item: any, index: number) => React.ReactNode;
    useDragHandle?: boolean; // Nueva prop
}

const SortableContainer: React.FC<SortableContainerProps> = ({
    items,
    onSortEnd,
    renderItem,
    useDragHandle = false, // Valor por defecto
}) => {
    return (
        <DragHandleProvider>
            <SortableContent
                items={items}
                onSortEnd={onSortEnd}
                renderItem={renderItem}
                useDragHandle={useDragHandle}
            />
        </DragHandleProvider>
    );
};

export default SortableContainer;

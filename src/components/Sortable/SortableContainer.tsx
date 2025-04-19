import React from 'react';
import SortableContent from './SortableContent';
import { DragHandleProvider } from './DragHandleContext';

interface SortableContainerProps {
    items: any[];
    onSortEnd: (newOrder: any[]) => void;
    renderItem: (item: any, index: number) => React.ReactNode;
    useDragHandle?: boolean;
    noContentText?: string;
    noContentIcon?: string;
}

const SortableContainer: React.FC<SortableContainerProps> = ({
    items,
    onSortEnd,
    renderItem,
    useDragHandle = false,
    noContentText = 'No content available',
    noContentIcon = 'records',
}) => {
    return (
        <DragHandleProvider>
            <SortableContent
                items={items}
                onSortEnd={onSortEnd}
                renderItem={renderItem}
                useDragHandle={useDragHandle}
                noContentIcon={noContentIcon}
                noContentText={noContentText}
            />
        </DragHandleProvider>
    );
};

export default SortableContainer;

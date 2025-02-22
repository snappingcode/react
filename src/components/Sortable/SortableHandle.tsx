import React from 'react';
import { useDragHandleContext } from './DragHandleContext';

interface SortableHandleProps {
    children: React.ReactNode;
}

const SortableHandle: React.FC<SortableHandleProps> = ({ children }) => {
    const { setIsPressingDragHandle } = useDragHandleContext();

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'grab',
                marginRight: '8px',
            }}
            onMouseDown={() => setIsPressingDragHandle(true)}
            onMouseUp={() => setIsPressingDragHandle(false)}
            onMouseLeave={() => setIsPressingDragHandle(false)}
        >
            {children}
        </span>
    );
};

export default SortableHandle;

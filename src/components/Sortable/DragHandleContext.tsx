import React, { createContext, useContext, useState } from 'react';

interface DragHandleContextValue {
    isPressingDragHandle: boolean;
    setIsPressingDragHandle: (value: boolean) => void;
}

const DragHandleContext = createContext<DragHandleContextValue | undefined>(undefined);

export const DragHandleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPressingDragHandle, setIsPressingDragHandle] = useState(false);

    return (
        <DragHandleContext.Provider value={{ isPressingDragHandle, setIsPressingDragHandle }}>
            {children}
        </DragHandleContext.Provider>
    );
};

export const useDragHandleContext = (): DragHandleContextValue => {
    const context = useContext(DragHandleContext);
    if (!context) {
        throw new Error('useDragHandle must be used within a DragHandleProvider');
    }
    return context;
};

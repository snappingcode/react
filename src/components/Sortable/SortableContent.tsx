import React, { useState } from 'react';
import SortableElement from './SortableElement';
import { useDragHandleContext } from './DragHandleContext';

interface SortableContentProps {
    items: any[];
    onSortEnd: (newOrder: any[]) => void;
    renderItem: (item: any, index: number) => React.ReactNode;
    useDragHandle: boolean;
}

const SortableContent: React.FC<SortableContentProps> = ({
    items,
    onSortEnd,
    renderItem,
    useDragHandle,
}) => {
    const { isPressingDragHandle } = useDragHandleContext();
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null); // Estado para manejar el índice arrastrado

    const handleDragStart = (index: number, event: React.DragEvent) => {
        if (useDragHandle && !isPressingDragHandle) {
            console.log('Arrastre bloqueado: el drag handle no está siendo presionado');
            event.preventDefault();
            return;
        }
        setDraggingIndex(index); // Guardamos el índice del elemento que se está arrastrando
    };

    const handleDragOver = (index: number) => {
        if (draggingIndex === null || draggingIndex === index) return; // Si no hay un índice o es el mismo, no hacemos nada

        const updatedItems = [...items];
        const [movedItem] = updatedItems.splice(draggingIndex, 1); // Removemos el elemento arrastrado
        updatedItems.splice(index, 0, movedItem); // Insertamos el elemento en la nueva posición

        setDraggingIndex(index); // Actualizamos el índice arrastrado
        onSortEnd(updatedItems); // Notificamos el nuevo orden
    };

    const handleDrop = () => {
        setDraggingIndex(null); // Reseteamos el índice al terminar el arrastre
    };

    return (
        <div>
            {items.map((item, index) => (
                <SortableElement
                    key={index}
                    index={index}
                    onDragStart={(event) => handleDragStart(index, event)}
                    onDragOver={() => handleDragOver(index)}
                    onDrop={handleDrop}
                    useDragHandle={useDragHandle}
                >
                    {renderItem(item, index)}
                </SortableElement>
            ))}
        </div>
    );
};

export default SortableContent;

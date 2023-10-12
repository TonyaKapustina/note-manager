import React, {FC, ReactNode, DragEvent} from "react";

type NoticeDraggableWrapperPropsType = {
    children: ReactNode,
    id: number,
    setIsDraggingMode: (value: (((prevState: boolean) => boolean) | boolean)) => void
    moveCard?: (dragIndex: number, hoverIndex: number) => void;
}

export const NoteDraggableWrapper: FC<NoticeDraggableWrapperPropsType> = ({
                                                                                children,
                                                                                id,
                                                                                moveCard,
                                                                                setIsDraggingMode,
                                                                                ...props
                                                                            }) => {

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        if (e.currentTarget.dataset.value) {
            e.dataTransfer.setData('text/plain', e.currentTarget.dataset.value);
            e.dataTransfer.effectAllowed = 'move';
            setIsDraggingMode(true);
        }
    };
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.dropEffect = 'move';
        e.preventDefault();
    };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        const dragItemId = Number(e.dataTransfer.getData("text/plain"));
        const dropItemId = id;
        if (dragItemId && dropItemId && (dragItemId !== dropItemId)) {
            moveCard?.(dragItemId, dropItemId);
        }
        setIsDraggingMode(false);
        e.preventDefault();
    };


    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            draggable="true"
            data-value={id}
            {...props}
        >
            {children}
        </div>
    )
}
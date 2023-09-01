import React, {FC, ReactNode} from "react";

type NoticeDraggableWrapperPropsType = {
    children: ReactNode,
    id: number,
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    setIsDraggingMode: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export const NoticeDraggableWrapper: FC<NoticeDraggableWrapperPropsType> = ({
                                                                                children,
                                                                                id,
                                                                                moveCard,
                                                                                setIsDraggingMode,
                                                                                ...props
                                                                            }) => {

    const handleDragStart = e => {
        e.dataTransfer.setData('text/plain', e.target.dataset.value);
        e.dataTransfer.effectAllowed = 'move';
        setIsDraggingMode(true);
    };
    const handleDragOver = e => {
        e.dataTransfer.dropEffect = 'move';
        e.preventDefault();
    };
    const handleDrop = e => {
        const dragItemId = Number(e.dataTransfer.getData("text/plain"));
        const dropItemId = id;
        if (dragItemId && dropItemId && (dragItemId !== dropItemId)) {
            moveCard(dragItemId, dropItemId);
        }
        setIsDraggingMode(false);
        e.preventDefault();
    };


    return (
        <div
            onDrop={e => handleDrop(e)}
            onDragOver={e => handleDragOver(e)}
            onDragStart={e => handleDragStart(e)}
            draggable="true"
            data-value={id}
            {...props}
        >
            {children}
        </div>
    )
}
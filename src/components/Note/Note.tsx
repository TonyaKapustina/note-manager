import React, {FC, useState} from "react";
import { NoteType} from "../../interfaces/note";
import {NoteDraggableWrapper} from "./DraggableWrapper";
import {NoteContent} from "./NoteContent";

export type NotePropsType = {
    note: NoteType,
    notesList?: NoteType[],
    moveCard?: (dragIndex: number, hoverIndex: number) => void,
    isSearchMode?: boolean
}

export const Note: FC<NotePropsType> = ({note, moveCard, isSearchMode}) => {
    const { id } = note || {};
    const [isDraggingMode, setIsDraggingMode] = useState(false);

    return (
        <>
            {
                isSearchMode ? (
                    <NoteContent
                        note={note}
                    />
                ) : (
                        <NoteDraggableWrapper
                            id={id}
                            setIsDraggingMode={setIsDraggingMode}
                            moveCard={moveCard}
                        >
                            <NoteContent
                                note={note}
                                showTooltip={!isDraggingMode}
                            />
                        </NoteDraggableWrapper>
                )
            }
        </>
    )
}
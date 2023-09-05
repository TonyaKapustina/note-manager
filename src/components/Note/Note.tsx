import React, {FC, useState} from "react";
import { NoteType} from "../../interfaces/note";
import {NoticeDraggableWrapper} from "./DraggableWrapper";
import {NoteContent} from "./NoteContent";

export type NoticePropsType = {
    notice: NoteType,
    noticesList?: NoteType[],
    moveCard?: (dragIndex: number, hoverIndex: number) => void,
    isSearchMode?: boolean
}

export const Note: FC<NoticePropsType> = ({notice, moveCard, isSearchMode}) => {
    const { id } = notice;
    const [isDraggingMode, setIsDraggingMode] = useState(false);

    return (
        <>
            {
                isSearchMode ? (
                    <NoteContent
                        notice={notice}
                    />
                ) : (
                        <NoticeDraggableWrapper
                            id={id}
                            setIsDraggingMode={setIsDraggingMode}
                            moveCard={moveCard}
                        >
                            <NoteContent
                                notice={notice}
                                showTooltip={!isDraggingMode}
                            />
                        </NoticeDraggableWrapper>
                )
            }
        </>
    )
}
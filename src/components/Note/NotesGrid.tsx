import {Note} from "./Note";
import React, {FC, useCallback, useMemo} from "react";
import {NoteType} from "../../interfaces/note";
import {editNotice} from "../../api/apiActions";
import useSWRMutation from "swr/mutation";
import {apiEndpoints} from "../../api/apiEndpoints";

export type NoticesGridPropsType = {
    notices: NoteType[]
}

export const NotesGrid: FC<NoticesGridPropsType> = ({notices}) => {
    const {trigger} = useSWRMutation(apiEndpoints.notices, editNotice);

    const moveCard = useCallback(async (dragItemId: number, dropItemId: number) => {
        const dragItem = notices.find(({id}) => id === dragItemId);
        const dropItem = notices.find(({id}) => id === dropItemId);

        if (dragItem?.id && dropItem?.id) {
            await Promise.all([
                trigger({...dragItem, position: dropItem.position}),
                trigger({...dropItem, position: dragItem.position})
            ]);
        }
    }, [notices, trigger]);

    // @ts-ignore
    const sortedNoticesByPosition = useMemo(() => notices.sort((a, b) => a.position - b.position), [notices]);

    return (
        <div className="grid grid-cols-5 gap-4 self-start">
            {sortedNoticesByPosition.map((notice, index) =>
                <Note
                    notice={notice}
                    key={index}
                    noticesList={notices}
                    moveCard={moveCard}
                />
            )
            }
        </div>
    )
}
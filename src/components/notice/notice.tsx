import React, {FC, useEffect, useState} from "react";
import NoticeModal from "./noticeModal";
import useSWRMutation from "swr/mutation";
import {NoticeSizeEnum, NoticeType} from "../../interfaces/notice";
import {apiEndpoints} from "../../api/apiEndpoints";
import {editNotice} from "../../api/apiActions";
import {useRouter} from "next/router";
import {Tooltip} from "../../components/general/tooltip"
import {NoticeDraggableWrapper} from "./draggableWrapper";
import {NoticeContent} from "./noticeContent";

export type NoticePropsType = {
    notice: NoticeType,
    size?: NoticeSizeEnum
    noticesList?: NoticeType[],
    moveCard?: (dragIndex: number, hoverIndex: number) => void,
    isSearchMode?: boolean
}

export const Notice: FC<NoticePropsType> = ({notice, moveCard, size, isSearchMode}) => {
    const {title, id} = notice;

    const {query: {id: queryId = []}} = useRouter();
    const {trigger} = useSWRMutation<NoticeType>(apiEndpoints.notices, editNotice);

    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [noticeTitle, setNoticeTitle] = useState(title);

    const [isDraggingMode, setIsDraggingMode] = useState(false);

    const onSaveClickHandler = async (note) => {
        setNoticeTitle(note.title.trim());
        await trigger({...note, directoryId: Number(queryId.slice(-1))});
    }

    return (
        <>
            {
                isSearchMode ? (
                    <NoticeContent
                        notice={notice}
                        size={size}
                        setShowNoticeModal={setShowNoticeModal}
                        noticeTitle={noticeTitle}
                        setNoticeTitle={setNoticeTitle}
                        isSearchMode={isSearchMode}
                    />
                ) : (
                    <Tooltip text={noticeTitle} isVisible={!isDraggingMode}>
                        <NoticeDraggableWrapper
                            id={id}
                            setIsDraggingMode={setIsDraggingMode}
                            moveCard={moveCard}
                        >
                            <NoticeContent
                                notice={notice}
                                size={size}
                                setShowNoticeModal={setShowNoticeModal}
                                noticeTitle={noticeTitle}
                                setNoticeTitle={setNoticeTitle}
                            />
                        </NoticeDraggableWrapper>
                    </Tooltip>
                )
            }
            {
                showNoticeModal && (
                    <NoticeModal notice={notice} setShowModal={setShowNoticeModal} onSave={onSaveClickHandler}/>
                )
            }
        </>
    )
}
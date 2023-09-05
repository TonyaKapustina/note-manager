import React, {FC, useCallback, useEffect, useState} from "react";
import {InputField, Tooltip} from "../General";
import {isNoticeTitleNotUnique} from "../../utils/notice";
import useSWR from "swr";
import {apiEndpoints} from "../../api/apiEndpoints";
import {NoteType} from "../../interfaces/note";
import {enqueueSnackbar} from "notistack";
import useSWRMutation from "swr/mutation";
import {editNotice} from "../../api/apiActions";
import {useRouter} from "next/router";
import {ERROR_MESSAGES_CATALOG} from "../../utils/constants";
import {NoteModal} from "./NoteModal";
import {buildUrlPathname} from "../../utils/url";

type NoticeContentPropsType = {
    notice: NoteType,
    showTooltip?: boolean
}

export const NoteContent: FC<NoticeContentPropsType> = ({
                                                              notice,
                                                              showTooltip = true
                                                          }) => {
    const {title, id} = notice;

    const {query: {id: queryId = [], noticeId}, push} = useRouter();

    const {data: noticesData = []} = useSWR<NoteType[]>(apiEndpoints.notices);
    const {trigger} = useSWRMutation(apiEndpoints.notices, editNotice);

    const [showNoteModal, setShowNoteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [noticeTitle, setNoticeTitle] = useState(title);

    useEffect(() => {
        if (noticeId) {
            if (Number(noticeId) === Number(id)) {
                setIsSelected(true);
                return;
            }
        }
        setIsSelected(false);
    }, [noticeId, id]);

    const onNoticeEditHandler = useCallback(async (newNoticeTitle: string) => {
        const normalizedTitle = newNoticeTitle.trim();

        setIsEditing(false);

        if (normalizedTitle === '') {
            enqueueSnackbar(ERROR_MESSAGES_CATALOG.NOTE.EMPTY_TITLE, {
                variant: 'error'
            });
            setNoticeTitle(title);
            return;
        }

        if (normalizedTitle === title) {
            return;
        }

        if (isNoticeTitleNotUnique(noticesData, notice, normalizedTitle)) {
            enqueueSnackbar(ERROR_MESSAGES_CATALOG.NOTE.TITLE_HAS_DUPLICATES, {
                variant: 'error'
            });
            setNoticeTitle(title);
            return;
        }

        setNoticeTitle(normalizedTitle);
        await trigger({
            ...notice,
            title: normalizedTitle
        });

    }, [notice, noticesData, setNoticeTitle, title, trigger]);

    const onClickHandler = () => {
        const pathname = buildUrlPathname(queryId as string[]);
        push({pathname, query: {noticeId: id}}, undefined, {shallow: true});
    }

    const onSaveClickHandler = async (note: NoteType) => {
        setNoticeTitle(note.title.trim());
        await trigger({...note, directoryId: Number(queryId.slice(-1))});
    }

    return (
        <>
            <Tooltip text={noticeTitle} isVisible={showTooltip}>
                <div
                    onClick={onClickHandler}
                    className={`flex flex-col items-center rounded-md p-2 ${isSelected && 'bg-blue-100'}`}>
                    <svg
                        onDoubleClick={() => setShowNoteModal(true)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={`w-20 h-20`}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                    </svg>
                    <div>
                        {isEditing ?
                            <InputField
                                name="noticeTitle"
                                value={noticeTitle}
                                onChange={setNoticeTitle}
                                editEntityRequest={onNoticeEditHandler}
                                className={'w-[100%]'}
                            />
                            : <h5
                                className="truncate text-ellipsis max-w-[100px]"
                                onClick={() => setIsEditing(true)}
                            >
                                {title}
                            </h5>
                        }
                    </div>
                </div>
            </Tooltip>
            {
                showNoteModal && (
                    <NoteModal notice={notice} setShowModal={setShowNoteModal} onSave={onSaveClickHandler}/>
                )
            }
        </>
    )
}
import React, {FC, Fragment, useEffect, useState} from "react";
import {InputField} from "../general/inputField";
import {isNoticeTitleNotUnique} from "../../utils/notice";
import useSWR from "swr";
import {apiEndpoints} from "../../api/apiEndpoints";
import {NoticeSizeEnum, NoticeType} from "../../interfaces/notice";
import {enqueueSnackbar} from "notistack";
import useSWRMutation from "swr/mutation";
import {editNotice} from "../../api/apiActions";
import {useRouter} from "next/router";

type NoticeContentPropsType = {
    notice: NoticeType,
    size?: NoticeSizeEnum,
    setShowNoticeModal?: (boolean) => void,
    noticeTitle?: string,
    setNoticeTitle?: (string) => void,
    isSearchMode?: boolean
}

export const NoticeContent: FC<NoticeContentPropsType> = ({
                                                              notice,
                                                              size = NoticeSizeEnum.LARGE,
                                                              setShowNoticeModal,
                                                              noticeTitle,
                                                              setNoticeTitle,
                                                              isSearchMode
                                                          }) => {
    const {title, id} = notice;

    const {query: {id: queryId = [], noticeId}, push} = useRouter();

    const {data: noticesData} = useSWR(apiEndpoints.notices);
    const {trigger} = useSWRMutation<NoticeType>(apiEndpoints.notices, editNotice);

    const [isEditing, setIsEditing] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [isTitleDuplicated, setHasTitleDuplicated] = useState(false);

    const isTitleNotUnique = isNoticeTitleNotUnique(noticesData, id, noticeTitle);

    useEffect(() => {
        if (isTitleDuplicated) {
            enqueueSnackbar("The note with this name is already taken.", {variant: 'error', autoHideDuration: 2000})
        }
    }, [isTitleDuplicated]);

    useEffect(() => {
        if (noticeId) {
            if (Number(noticeId) === Number(id)) {
                setIsSelected(true);
                return;
            }
        }
        setIsSelected(false);
    }, [noticeId, id]);

    const onEditFieldKeyDownHandler = async (event) => {
        if (event.key === "Enter" || event.key === "Escape") {
            event.target.blur();
            setIsEditing(false);

            if (isTitleNotUnique) {
                setHasTitleDuplicated(true);
                setIsEditing(false);
                setNoticeTitle(title);
                return;
            }

            if (event.target.value.trim() !== title.trim() && event.target.value.trim() !== "") {
                await trigger({...notice, title: event.target.value.trim()});
            }
        }
    }

    const onEditFieldBlurHandler = async (event) => {
        if (isTitleNotUnique) {
            setHasTitleDuplicated(true);
            setIsEditing(false);
            setNoticeTitle(title);
            return;
        }

        setHasTitleDuplicated(false);
        setIsEditing(false);

        if (event.target.value.trim() !== title.trim() && event.target.value.trim() !== "") {
            await trigger({...notice, title: event.target.value.trim()});
        }
    }

    const onClickHandler = () => {
        const pathname = queryId.join('/');
        push({pathname, query: {noticeId: id}}, undefined, {shallow: true});
    }

    if (isSearchMode) {
        return (<div
                onClick={() => setShowNoticeModal(true)}
                className='flex flex-col items-center rounded-md p-2 max-w-[100px]'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className={`w-${size} h-${size}`}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                </svg>
                <h5
                    className="truncate text-ellipsis max-w-[100px]"
                >
                    {title}
                </h5>
            </div>
        )
    }

    return (
        <div
            onClick={onClickHandler}
            className={`flex flex-col items-center rounded-md p-2 ${isSelected && 'bg-blue-100'}`}>
            <svg
                onDoubleClick={() => setShowNoticeModal(true)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-${size} h-${size}`}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
            <div>
                {isEditing ?
                    <InputField
                        name="noticeTitle"
                        value={noticeTitle}
                        onChange={setNoticeTitle}
                        onBlur={onEditFieldBlurHandler}
                        onKeyDown={onEditFieldKeyDownHandler}
                        className='w-[100%]'
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
    )
}
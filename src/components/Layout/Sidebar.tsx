import React, {useState} from "react";
import {useRouter} from "next/router";
import {addDirectory, addNotice, deleteDirectory, deleteNotice} from "../../api/apiActions";
import {DEFAULT_DIRECTORY_ID, ERROR_MESSAGES_CATALOG} from "../../utils/constants";
import {apiEndpoints} from "../../api/apiEndpoints";
import useSWRMutation from "swr/mutation";
import {NoticeType} from "../../interfaces/notice";
import NoticeModal from "../Notice/noticeModal";
import useSWR from "swr";
import {enqueueSnackbar} from "notistack";
import {DirectoryType} from "../../interfaces/directories";

const Sidebar = () => {
    const {query: {id: queryId = [], noticeId}, push, pathname} = useRouter();

    const {data: directoriesData} = useSWR<DirectoryType[]>(apiEndpoints.directoriesList);
    const {data: noticesData} = useSWR<NoticeType[]>(apiEndpoints.notices);

    const {trigger: triggerAddDirectory} = useSWRMutation(apiEndpoints.directoriesList(), addDirectory);
    const {trigger: triggerDeleteDirectory} = useSWRMutation(apiEndpoints.directoriesList(), deleteDirectory);
    const {trigger: triggerAddNotice} = useSWRMutation<NoticeType>(apiEndpoints.notices(), addNotice);
    const {trigger: triggerDeleteNotice} = useSWRMutation<NoticeType>(apiEndpoints.notices(), deleteNotice);

    const [showNoticeModal, setShowNoticeModal] = useState(false);

    const isResultsPage = pathname === '/results';

    const onAddDirectoryClickHandler = async () => {
        const parentId = (Number(queryId?.at(queryId.length - 1))) || DEFAULT_DIRECTORY_ID;
        const name = 'New directory';
        await triggerAddDirectory({parentId, name});
    };

    const onRemoveDirectoryClickHandler = async () => {
        const directoryIdToDelete = Number(queryId?.at(queryId.length - 1));
        const directoryToDelete = directoriesData.find(({id}) => id === directoryIdToDelete);
        const hasDirectoryNotes = noticesData.find(({directoryId}) => directoryIdToDelete === directoryId);

        if (directoryIdToDelete === DEFAULT_DIRECTORY_ID) {
            enqueueSnackbar(ERROR_MESSAGES_CATALOG.DIRECTORY.ROOT_DELETE, {
                variant: 'error'
            });
            return;
        }

        if (directoryToDelete?.children.length && hasDirectoryNotes) {
            enqueueSnackbar(ERROR_MESSAGES_CATALOG.DIRECTORY.IS_NOT_EMPTY, {
                variant: 'error'
            });
            return;
        }

        const pathname = queryId.splice(0, queryId.length - 1).join('/');
        push(pathname, undefined, {shallow: true});

        await triggerDeleteDirectory({id: directoryIdToDelete});
    }

    const onRemoveNoticeClickHandler = async () => {
        await triggerDeleteNotice({id: noticeId});

        const pathname = queryId.join('/');
        await push(pathname, undefined, {shallow: true});
    }

    const onSaveClickHandler = async (notice) => {
        await triggerAddNotice({...notice, directoryId: Number(queryId.slice(-1))})
    }

    return (
        <>
            <div className="flex flex-col bg-amber-100 py-5 px-3 text-orange-700 w-[150px]">
                {
                    !isResultsPage && (
                        <>
                            <button className="flex flex-col items-center add p-2 hover:text-blue-700"
                                    onClick={onAddDirectoryClickHandler}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                     stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <p>Add Directory</p>
                            </button>
                            <button className="flex flex-col items-center p-2 hover:text-blue-700"
                                    onClick={onRemoveDirectoryClickHandler}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                     stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                </svg>
                                <p>Remove Directory</p>
                            </button>
                            <hr className="border-blue-700"/>
                            <button className="flex flex-col items-center add p-2 hover:text-blue-700"
                                    onClick={() => setShowNoticeModal(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                     stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <p>Add Notice</p>
                            </button>
                        </>
                    )}
                {
                    noticeId && (
                        <button className="flex flex-col items-center p-2 hover:text-blue-700"
                                onClick={onRemoveNoticeClickHandler}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                            </svg>
                            <p>Remove Notice</p>
                        </button>
                    )
                }
            </div>
            {
                showNoticeModal && (
                    <NoticeModal setShowModal={setShowNoticeModal} onSave={onSaveClickHandler}/>
                )
            }
        </>
    )
}

export default Sidebar;
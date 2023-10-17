import React, {FC, useEffect, useState} from "react";

import {useRouter} from "next/router";
import Link from "next/link";
import {DirectoryType} from "../../interfaces/directories";
import useSWRMutation from "swr/mutation";
import {apiEndpoints} from "../../api/apiEndpoints";
import {addDirectory, deleteDirectory, editDirectory} from "../../api/apiActions";
import {enqueueSnackbar} from "notistack";
import {DEFAULT_DIRECTORY_ID, ERROR_MESSAGES_CATALOG} from "../../utils/constants";
import {useDirectoryData} from "../../hooks/useDirectoryData";
import {useForm} from "react-hook-form";
import {useNotesData} from "../../hooks/useNotesData";
import {getOpenDirectoryId} from "../../utils/url";

type DirectoryPropsType = {
    directory: DirectoryType
}

export const Directory: FC<DirectoryPropsType> = ({directory}) => {
    const {query: {id}, push} = useRouter();
    const queryId = id as string[];

    const {name} = directory;

    const {directoriesData} = useDirectoryData();
    const {notesData} = useNotesData();

    const {trigger} = useSWRMutation(apiEndpoints.directoriesList, editDirectory);
    const {trigger: triggerDeleteDirectory} = useSWRMutation(apiEndpoints.directoriesList(), deleteDirectory);
    const {trigger: triggerAddDirectory} = useSWRMutation(apiEndpoints.directoriesList(), addDirectory);

    const isCurrentDirectoryOpen = getOpenDirectoryId(queryId) === directory.id;
    const [isEditing, setIsEditing] = useState(false);

    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        defaultValues: {
            directoryName: name,
        }
    });

    useEffect(() => {
        if (errors?.directoryName) {
            enqueueSnackbar(errors?.directoryName.message, {
                variant: 'error'
            });
            reset();
            setIsEditing(false);
        }
    }, [errors?.directoryName, reset]);

    const onSubmit = async (data) => {
        await trigger({
            ...directory,
            name: data.directoryName.trim(),
        });
        setIsEditing(false);
    }

    const onRemoveDirectoryClickHandler = async () => {
        const directoryIdToDelete = Number(directory.id);
        const hasDirectoryNotes = notesData?.filter(({directoryId}) => directoryIdToDelete === directoryId);

        if (directoryIdToDelete === DEFAULT_DIRECTORY_ID) {
            enqueueSnackbar(ERROR_MESSAGES_CATALOG.DIRECTORY.ROOT_DELETE, {
                variant: 'error'
            });
            return;
        }

        if (directory?.children.length || hasDirectoryNotes.length) {
            enqueueSnackbar(ERROR_MESSAGES_CATALOG.DIRECTORY.IS_NOT_EMPTY, {
                variant: 'error'
            });
            return;
        }

        const url = queryId.includes(String(directory.id)) ? queryId.splice(0, queryId.length - 1).join('/') : queryId.join('/');
        await push(url, undefined, {shallow: true});

        await triggerDeleteDirectory({id: directoryIdToDelete});
    }

    const onAddDirectoryClickHandler = async () => {
        await triggerAddDirectory({parentId: directory.id, name: 'New directory'});
    };

    return (
        <div className={`directory ${isCurrentDirectoryOpen ? 'bg-directory-open-color' : ''}`}>
            {
                isEditing && (
                    <form onSubmit={handleSubmit(onSubmit)} onBlur={handleSubmit(onSubmit)}>
                        <input
                            className="form-control"
                            autoFocus
                            {...register("directoryName", {
                                required: ERROR_MESSAGES_CATALOG.DIRECTORY.EMPTY_TITLE,
                                validate: {
                                    hasDuplicates: value => {
                                        if (value === name) {
                                            setIsEditing(false);
                                            return
                                        }

                                        const hasDuplicates = directoriesData.some((item) => item.name.toLowerCase() === value.trim().toLowerCase());

                                        if (hasDuplicates) {
                                            setIsEditing(false);
                                            return ERROR_MESSAGES_CATALOG.DIRECTORY.TITLE_HAS_DUPLICATES
                                        }
                                    }
                                }
                            })}
                        />
                    </form>
                )}
            <Link href={`/${directory.path.join('/')}`} className="flex items-center justify-between w-full py-4">
                <div
                    className={`flex flex-row items-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H9.67452C10.1637 5 10.4083 5 10.6385 5.05526C10.8425 5.10425 11.0376 5.18506 11.2166 5.29472C11.4184 5.4184 11.5914 5.59135 11.9373 5.93726L12.0627 6.06274C12.4086 6.40865 12.5816 6.5816 12.7834 6.70528C12.9624 6.81494 13.1575 6.89575 13.3615 6.94474C13.5917 7 13.8363 7 14.3255 7H17.8C18.9201 7 19.4802 7 19.908 7.21799C20.2843 7.40973 20.5903 7.71569 20.782 8.09202C21 8.51984 21 9.0799 21 10.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z"
                            stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3 className="directory-title">
                        {name}
                    </h3>
                </div>
            </Link>
            <div className="options-row">
                {!!directory?.children.length && <div className="directory-count">{directory?.children.length}</div>}
                <button className="options" onClick={onAddDirectoryClickHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" rx="4" fill="inherit"/>
                        <path d="M16 11.2144V13.0982H8V11.2144H16ZM13.018 8V16.497H10.99V8H13.018Z" fill="black"/>
                    </svg>
                </button>
                <button className="options" onClick={() => setIsEditing(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                         fill="none">
                        <rect width="24" height="24" fill="inherit"/>
                        <path
                            d="M5 12.3542C5 11.9728 5.13034 11.6517 5.39101 11.391C5.65168 11.1303 6.00454 11 6.44959 11C6.89464 11 7.2475 11.1303 7.50817 11.391C7.76885 11.6517 7.89918 11.9728 7.89918 12.3542C7.89918 12.7293 7.76885 13.0472 7.50817 13.3079C7.2475 13.5622 6.89464 13.6894 6.44959 13.6894C6.00454 13.6894 5.65168 13.5622 5.39101 13.3079C5.13034 13.0472 5 12.7293 5 12.3542Z"
                            fill="black"/>
                        <path
                            d="M10.5504 12.3542C10.5504 11.9728 10.6807 11.6517 10.9414 11.391C11.2021 11.1303 11.555 11 12 11C12.4451 11 12.7979 11.1303 13.0586 11.391C13.3193 11.6517 13.4496 11.9728 13.4496 12.3542C13.4496 12.7293 13.3193 13.0472 13.0586 13.3079C12.7979 13.5622 12.4451 13.6894 12 13.6894C11.555 13.6894 11.2021 13.5622 10.9414 13.3079C10.6807 13.0472 10.5504 12.7293 10.5504 12.3542Z"
                            fill="black"/>
                        <path
                            d="M16.1008 12.3542C16.1008 11.9728 16.2312 11.6517 16.4918 11.391C16.7525 11.1303 17.1054 11 17.5504 11C17.9955 11 18.3483 11.1303 18.609 11.391C18.8697 11.6517 19 11.9728 19 12.3542C19 12.7293 18.8697 13.0472 18.609 13.3079C18.3483 13.5622 17.9955 13.6894 17.5504 13.6894C17.1054 13.6894 16.7525 13.5622 16.4918 13.3079C16.2312 13.0472 16.1008 12.7293 16.1008 12.3542Z"
                            fill="black"/>
                    </svg>
                </button>
                <button className="options" onClick={onRemoveDirectoryClickHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                         fill="none">
                        <rect width="24" height="24" rx="4" fill="inherit"/>
                        <path d="M16 11V14.0567H8V11H16Z" fill="black"/>
                    </svg>
                </button>
            </div>

        </div>

    )
}
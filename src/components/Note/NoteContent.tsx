import React, {FC, useEffect, useRef, useState} from "react";
import {Tooltip} from "../General";
import {apiEndpoints} from "../../api/apiEndpoints";
import {NoteType} from "../../interfaces/note";
import {enqueueSnackbar} from "notistack";
import useSWRMutation from "swr/mutation";
import {deleteNotice, editNotice} from "../../api/apiActions";
import {ERROR_MESSAGES_CATALOG} from "../../utils/constants";
import {NoteModal} from "./NoteModal";
import {useNotesData} from "../../hooks/useNotesData";
import {useCustomRoute} from "../../hooks/useCustomRoute";
import {useForm} from "react-hook-form";
import {buildUrlPathname} from "../../utils/url";
import {useRouter} from "next/router";

type NoteContentPropsType = {
    note: NoteType,
    showTooltip?: boolean
}

export const NoteContent: FC<NoteContentPropsType> = ({
                                                          note,
                                                          showTooltip = true
                                                      }) => {
    const {title, description, id} = note || {};

    const customRoute = useCustomRoute();
    const {openDirectoryNotes, currentDirectory} = useNotesData();
    const {trigger} = useSWRMutation(apiEndpoints.notices, editNotice);
    const {trigger: triggerDeleteNote} = useSWRMutation(apiEndpoints.notices(), deleteNotice);

    const [showNoteModal, setShowNoteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const deleteBtn = useRef(null);

    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        defaultValues: {
            noteName: title,
        }
    })

    useEffect(() => {
        if (errors?.noteName) {
            enqueueSnackbar(errors?.noteName.message, {
                variant: 'error'
            });
            reset();
            setIsEditing(false);
        }
    }, [errors?.noteName, reset]);

    const onClickHandler = async (event) => {
        if (!deleteBtn.current.contains(event.target)) {
            await customRoute.pushToUrl({noteId: id});
        }
    }

    const onSaveClickHandler = async (note: NoteType) => {
        await trigger({...note, directoryId: currentDirectory});
    }

    const onSubmit = async (data) => {
        const normalizedTitle = data.noteName.trim();
        await trigger({...note, directoryId: currentDirectory, title: normalizedTitle});
        setIsEditing(false);
    }

    const onDeleteClickHandler = async () => {
        await customRoute.resetUrlParams();
        await triggerDeleteNote({id});
    }

    return (
        <>
            <Tooltip text={title} isVisible={showTooltip}>
                <div
                    onClick={onClickHandler}
                    onDoubleClick={() => !isEditing && setShowNoteModal(true)}
                    className="note">
                    <div>
                        <div className="note-header">
                            {isEditing &&
                                <form onSubmit={handleSubmit(onSubmit)} onBlur={handleSubmit(onSubmit)}
                                      className="note-header-form">
                                    <input
                                        className="form-control"
                                        autoFocus
                                        {...register("noteName", {
                                            validate: {
                                                isEmpty: value => {
                                                    if (value.trim() === '') {
                                                        return ERROR_MESSAGES_CATALOG.NOTE.EMPTY_TITLE
                                                    }
                                                },
                                                hasDuplicates: value => {
                                                    if (value === title) {
                                                        setIsEditing(false);
                                                        return
                                                    }

                                                    const hasDuplicates = openDirectoryNotes.some(({title}) => title.toLowerCase() === value.trim().toLowerCase());

                                                    if (hasDuplicates) {
                                                        return ERROR_MESSAGES_CATALOG.NOTE.TITLE_HAS_DUPLICATES
                                                    }
                                                }
                                            }
                                        })}
                                    />
                                </form>
                            }
                            <h3
                                className="note-title"
                            >
                                {title}
                            </h3>
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
                            <button ref={deleteBtn} className="options" onClick={onDeleteClickHandler}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none">
                                    <rect width="24" height="24" rx="4" fill="inherit"/>
                                    <path d="M16 11V14.0567H8V11H16Z" fill="black"/>
                                </svg>
                            </button>
                        </div>
                        <p className="note-description line-clamp-5">
                            {description}
                        </p>
                    </div>
                </div>
            </Tooltip>
            {
                showNoteModal && (
                    <NoteModal note={note} setShowModal={setShowNoteModal} onSave={onSaveClickHandler}/>
                )
            }
        </>
    )
}
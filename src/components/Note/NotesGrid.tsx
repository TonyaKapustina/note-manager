import {Note} from "./Note";
import React, {FC, useCallback, useMemo, useState} from "react";
import {NoteType} from "../../interfaces/note";
import {addNotice, editNotice} from "../../api/apiActions";
import useSWRMutation from "swr/mutation";
import {apiEndpoints} from "../../api/apiEndpoints";
import {DirectoryType} from "../../interfaces/directories";
import {DEFAULT_DIRECTORY_ID} from "../../utils/constants";
import {NoteModal} from "./NoteModal";
import {getOpenDirectoryId} from "../../utils/url";
import {useRouter} from "next/router";

export type NotesGridPropsType = {
    notes: NoteType[]
    currentDirectory: DirectoryType[]
}

export const NotesGrid: FC<NotesGridPropsType> = ({notes, currentDirectory}) => {
    const {trigger} = useSWRMutation(apiEndpoints.notices, editNotice);
    const {trigger: triggerAddNote} = useSWRMutation(apiEndpoints.notices(), addNotice);

    const [showNoteModal, setShowNoteModal] = useState(false);
    const {query: {id}} = useRouter();
    const queryId = id as string[];

    const currentOpenDirectory = getOpenDirectoryId(queryId);

    const moveCard = useCallback(async (dragItemId: number, dropItemId: number) => {
        const dragItem = notes.find(({id}) => id === dragItemId);
        const dropItem = notes.find(({id}) => id === dropItemId);

        if (dragItem?.id && dropItem?.id) {
            await Promise.all([
                trigger({...dragItem, position: dropItem.position}),
                trigger({...dropItem, position: dragItem.position})
            ]);
        }
    }, [notes, trigger]);

    // @ts-ignore
    const sortedNotesByPosition = useMemo(() => notes.sort((a, b) => a.position - b.position), [notes]);

    const onSaveClickHandler = async (note: NoteType) => {
        await triggerAddNote({...note, directoryId: currentOpenDirectory})
    }

    return (
        <>
            <div>
                <div className="border-b bottom-2 flex justify-between">
                    {currentDirectory[0]?.name &&
                        <h3 className="text-xl font-medium pb-3">{currentDirectory[0].name}</h3>}
                    <p>{notes.length} note(s)</p>
                </div>
                <button className="add-button ml-auto" onClick={() => setShowNoteModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="12" fill="inherit"/>
                        <path d="M16 11.2144V13.0982H8V11.2144H16ZM13.018 8V16.497H10.99V8H13.018Z" fill="white"/>
                    </svg>
                    <p>Add Note</p>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 self-start py-4">
                {sortedNotesByPosition.map((note, index) =>
                    <Note
                        note={note}
                        key={index}
                        notesList={notes}
                        moveCard={moveCard}
                    />
                )
                }
            </div>
            {
                showNoteModal && (
                    <NoteModal setShowModal={setShowNoteModal} onSave={onSaveClickHandler}/>
                )
            }
        </>
    )
}
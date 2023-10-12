import React, {useMemo, useState} from "react";
import {DirectoriesTree, NoteModal, NotesGrid, Search, ToggleSwitch} from "../components";
import arrayToTree from "../utils/arrayToTree";
import {useDirectoryData} from "../hooks/useDirectoryData";
import {useNotesData} from "../hooks/useNotesData";
import {getOpenDirectoryId} from "../utils/url";
import {useRouter} from "next/router";
import {DEFAULT_DIRECTORY_ID} from "../utils/constants";
import useSWRMutation from "swr/mutation";
import {apiEndpoints} from "../api/apiEndpoints";
import {addDirectory, addNotice} from "../api/apiActions";
import {NoteType} from "../interfaces/note";

const Dashboard = () => {
    const {directoriesData, isDirectoriesDataLoading} = useDirectoryData();
    const {isNotesDataLoading, openDirectoryNotes} = useNotesData();
    const [count, setCount] = useState(0);
    const [showNoteModal, setShowNoteModal] = useState(false);

    const {trigger: triggerAddDirectory} = useSWRMutation(apiEndpoints.directoriesList(), addDirectory);
    const {trigger: triggerAddNote} = useSWRMutation(apiEndpoints.notices(), addNotice);

    const {query: {id}} = useRouter();

    const directoriesTree = useMemo(() => {
        return arrayToTree(directoriesData);
    }, [directoriesData]);

    const currentOpenDirectory = useMemo(() => {
        return directoriesData?.filter((directory) => directory.id === getOpenDirectoryId(id))
    }, [directoriesData, id]);

    if (isDirectoriesDataLoading && isNotesDataLoading) {
        return <div>Loading...</div>
    }

    const onAddDirectoryClickHandler = async () => {
        setCount(count + 1);
        const name = `New directory ${count}`;
        await triggerAddDirectory({parentId: DEFAULT_DIRECTORY_ID, name});
    };

    const onSaveClickHandler = async (note: NoteType) => {
        await triggerAddNote({...note, directoryId: DEFAULT_DIRECTORY_ID})
    }

    return (
        <>
            <div className='dashboard-layout'>
                <div className="dashboard-directories min-h-full overflow-y-auto p-2">
                    <div className="mb-6 flex justify-between items-center">
                        <Search/>
                        <ToggleSwitch/>
                    </div>
                    <DirectoriesTree directoriesList={directoriesTree}/>

                    <button className="add-button add-button-directory" onClick={onAddDirectoryClickHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="inherit"/>
                            <path d="M16 11.2144V13.0982H8V11.2144H16ZM13.018 8V16.497H10.99V8H13.018Z" fill="white"/>
                        </svg>
                        <p>Add directory</p>
                    </button>

                    <button className="add-button" onClick={() => setShowNoteModal(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="inherit"/>
                            <path d="M16 11.2144V13.0982H8V11.2144H16ZM13.018 8V16.497H10.99V8H13.018Z" fill="white"/>
                        </svg>
                        <p>Add Note</p>
                    </button>
                </div>
                <div className="min-h-full overflow-y-auto p-10 pt-2">
                    <NotesGrid notes={openDirectoryNotes} currentDirectory={currentOpenDirectory}/>
                </div>
            </div>
            {
                showNoteModal && (
                    <NoteModal setShowModal={setShowNoteModal} onSave={onSaveClickHandler}/>
                )
            }
        </>
    )
}

export default Dashboard;
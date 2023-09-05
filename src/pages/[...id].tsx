import React, {useMemo} from "react";
import {DirectoriesTree, NotesGrid, Search} from "../components";
import arrayToTree from "../utils/arrayToTree";
import {useDirectoryData} from "../hooks/useDirectoryData";
import {useNotesData} from "../hooks/useNotesData";

const Dashboard = () => {
    const {directoriesData, isDirectoriesDataLoading} = useDirectoryData();
    const {isNotesDataLoading, openDirectoryNotes} = useNotesData();

    const directoriesTree = useMemo(() => {
        return arrayToTree(directoriesData);
    }, [directoriesData]);

    if (isDirectoriesDataLoading && isNotesDataLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className='dashboard-layout'>
            <div className="dashboard-directories bg-amber-100 min-h-full overflow-y-auto p-2">
                <DirectoriesTree directoriesList={directoriesTree}/>
            </div>

            <div className="dashboard-search">
                <Search/>
            </div>
            {
                !!openDirectoryNotes?.length && (
                    <div className="directories-notices border min-h-full overflow-y-auto p-2">
                        <NotesGrid notices={openDirectoryNotes}/>
                    </div>
                )
            }
        </div>
    )
}

export default Dashboard;
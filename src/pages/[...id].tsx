import React, {useEffect, useMemo} from "react";
import {DirectoriesTree, NotesGrid, Search} from "../components";
import arrayToTree from "../utils/arrayToTree";
import useSWR from "swr";
import {apiEndpoints} from "../api/apiEndpoints";
import {useRouter} from "next/router";
import {NoteType} from "../interfaces/note";
import {buildUrlPathname} from "../utils/url";
import {useDirectoryData} from "../hooks/useDirectoryData";

const Directories = () => {
    const {directoriesData, isDirectoriesDataLoading} = useDirectoryData();
    const {data: noticesData, isLoading: isNoticesDataLoading} = useSWR<NoteType[], boolean>(apiEndpoints.notices);
    const {query: {id: queryId = [], noticeId}, push} = useRouter();

    const directoriesTree = useMemo(() => {
        return arrayToTree(directoriesData);
    }, [directoriesData]);

    const currentDirectoryNotices = useMemo(() => {
        return noticesData?.filter(({directoryId}) => directoryId === Number(queryId.slice(-1))) || []
    }, [noticesData, queryId])

    useEffect(() => {
        // @ts-ignore
        if (Boolean(noticeId) && !isNoticesDataLoading && (!currentDirectoryNotices?.length || !currentDirectoryNotices?.some(({id}) => id?.toString().includes(noticeId.toString())))) {
            // @ts-ignore
            const url = buildUrlPathname(queryId);
            push(url, undefined, {shallow: true});
        }
    }, [currentDirectoryNotices, isNoticesDataLoading, noticeId, push, queryId]);

    if (isDirectoriesDataLoading && isNoticesDataLoading) {
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
                !!noticesData?.length && (
                    <div className="directories-notices border min-h-full overflow-y-auto p-2">
                        <NotesGrid notices={currentDirectoryNotices}/>
                    </div>
                )
            }
        </div>
    )
}

export default Directories;
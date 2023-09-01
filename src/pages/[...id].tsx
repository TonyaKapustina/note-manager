import React, {useEffect, useMemo} from "react";
import {DirectoriesTree, NoticesGrid, Search} from "../components";
import arrayToTree from "../utils/arrayToTree";
import useSWR from "swr";
import {apiEndpoints} from "../api/apiEndpoints";
import {useRouter} from "next/router";

const Directories = () => {
    const {data: directoriesData, isLoading: isDirectoriesDataLoading} = useSWR(apiEndpoints.directoriesList);
    const {data: noticesData, isLoading: isNoticesDataLoading} = useSWR(apiEndpoints.notices);
    const {query: {id: queryId = [], noticeId}, push} = useRouter();

    useEffect(() => {
        if (!isDirectoriesDataLoading && !isNoticesDataLoading && directoriesData.length && queryId.length) {
            const idQueryParam = queryId.join('/');
            const isPathExists = directoriesData.some(({path}) => path.join('/') === idQueryParam);

            if (!isPathExists) {
                push('/404')
            }
        }
    }, [isDirectoriesDataLoading, isNoticesDataLoading, directoriesData, queryId, push]);

    const directoriesTree = useMemo(() => {
        return !isDirectoriesDataLoading && arrayToTree(directoriesData);
    }, [isDirectoriesDataLoading, directoriesData]);

    const currentDirectoryNotices = useMemo(() => {
        return !isNoticesDataLoading && noticesData?.filter(({directoryId}) => directoryId === Number(queryId.slice(-1)))
    }, [isNoticesDataLoading, noticesData, queryId])

    useEffect(() => {
        if (Boolean(noticeId) && !isNoticesDataLoading && (!currentDirectoryNotices?.length || !currentDirectoryNotices?.some(({id}) => id?.toString().includes(noticeId.toString())))) {
            const url = queryId.join('/');
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
                        <NoticesGrid notices={currentDirectoryNotices}/>
                    </div>
                )
            }
        </div>
    )
}

export default Directories;
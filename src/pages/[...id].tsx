import React, {useEffect, useMemo, useState} from "react";
import {DirectoriesTree, Notice} from "../components";
import arrayToTree from "../utils/arrayToTree";
import useSWR from "swr";
import {apiEndpoints} from "../api/apiEndpoints";
import {useRouter} from "next/router";

const Directories = () => {
    const {data: directoriesData, isLoading: isDirectoriesDataLoading} = useSWR(apiEndpoints.directoriesList);
    const {data: noticesData, isLoading: isNoticesDataLoading} = useSWR(apiEndpoints.notices);
    const {query: {id: queryId = [], noticeId}, push} = useRouter();
    const [noDirectoryFound, setNoDirectoryFound] = useState(undefined);

    useEffect(() => {
        if (!isDirectoriesDataLoading && !isNoticesDataLoading && directoriesData.length && queryId.length) {
            const idQueryParam = queryId.join('/');
            const isPathExists = directoriesData.some(({path}) => path.join('/') === idQueryParam);
            setNoDirectoryFound(!isPathExists);
        }
    }, [isDirectoriesDataLoading, isNoticesDataLoading, directoriesData, queryId]);

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
    }, [currentDirectoryNotices, isNoticesDataLoading, noticeId]);

    if (isDirectoriesDataLoading && isNoticesDataLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="flex flex-column bg-amber-100 min-h-full overflow-y-auto w-1/3 p-2">
                {
                    noDirectoryFound ? 'No directories' :
                        <DirectoriesTree directoriesList={directoriesTree}/>
                }
            </div>

            {
                !!noticesData?.length && (
                    <div className="flex flex-column bg-amber-100 min-h-full overflow-y-auto w-2/3 ml-10 p-2">
                        <div className="grid grid-cols-4 gap-4 self-start">
                            {
                                currentDirectoryNotices.map((notice, index) => <Notice notice={notice} key={index}
                                                                                       noticesList={currentDirectoryNotices}/>)
                            }
                        </div>
                    </div>
                )
            }

        </>
    )
}

export default Directories;
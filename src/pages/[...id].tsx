import React, {useEffect, useState} from "react";
import {DirectoriesTree} from "../components";
import arrayToTree from "../utils/arrayToTree";
import useSWR from "swr";
import {apiEndpoints} from "../api/apiEndpoints";
import {useRouter} from "next/router";

const Directories = () => {
    const {data, isLoading} = useSWR(apiEndpoints.directoriesList);
    const {query: {id = []}} = useRouter();
    const [noDirectoryFound, setNoDirectoryFound] = useState(undefined);

    useEffect(() => {
        if (!isLoading && data.length && id.length) {
            const idQueryParam = id.join('/');
            const isPathExists = data.some(({path}) => path.join('/') === idQueryParam);
            setNoDirectoryFound(!isPathExists);
        }
    }, [isLoading, data, id]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    const directoriesList = arrayToTree(data);

    return (
        <div className="flex flex-column bg-amber-100 min-h-full overflow-y-auto w-1/3">
            {
                noDirectoryFound ? 'No directories' :
                    <DirectoriesTree directoriesList={directoriesList}/>
            }

        </div>
    )
}

export default Directories;
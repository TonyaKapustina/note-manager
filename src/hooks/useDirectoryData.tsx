import {useEffect} from "react";
import {buildUrlPathname} from "../utils/url";
import useSWR from "swr";
import {DirectoryType} from "../interfaces/directories";
import {apiEndpoints} from "../api/apiEndpoints";
import {useRouter} from "next/router";

export const useDirectoryData = () => {
    const {data, isLoading} = useSWR<DirectoryType[], boolean>(apiEndpoints.directoriesList);
    const {query: {id = []}, push} = useRouter();

    useEffect(() => {
        if (!isLoading && data?.length && id?.length) {
            const idQueryParam = buildUrlPathname(id as string[]);
            const isPathExists = data.some(({path}) => path && buildUrlPathname(path) === idQueryParam);

            if (!isPathExists) {
                push('/404')
            }
        }
    }, [isLoading, data, id, push]);

    return {
        directoriesData: data || [],
        isDirectoriesDataLoading: isLoading
    }
}
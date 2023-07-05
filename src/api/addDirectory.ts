import {apiEndpoints} from "@/api/apiEndpoints";

export const addDirectory = async (parentId: string, name: string) => {
    await fetch(apiEndpoints.directoriesList(), {
        method: 'POST',
        body: JSON.stringify({
            parentId,
            name
        })
    })
}
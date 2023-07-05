import {DirectoriesTree} from "@/components";
import arrayToTree from "@/utils/arrayToTree";
import useSWR from "swr";
import {apiEndpoints} from "@/api/apiEndpoints";

const Directories = () => {
    const {data, isLoading} = useSWR(apiEndpoints.directoriesList);
    if (isLoading) {
        return <div>Loading...</div>
    }

    const directoriesList = arrayToTree(data);

    return (
        <div className="flex flex-column bg-amber-100 min-h-full overflow-y-auto w-1/3">
            <DirectoriesTree directoriesList={directoriesList}/>
        </div>
    )
}

export default Directories;
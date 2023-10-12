import {buildUrlPathname} from "../utils/url";
import {useRouter} from "next/router";

export const useCustomRoute = () => {
    const {query, push, pathname, replace} = useRouter();

    const pushToUrl = async (queryParamToUpdate, pathnameToUpdate = false) => {
        const {id, ...rest} = query;

        const url = {
            pathname: pathnameToUpdate || id ? buildUrlPathname(id as string[]) : pathname,
            query: {
                ...rest,
                ...queryParamToUpdate
            }
        }

        return await push(url, undefined, {shallow: true})
    }

    const resetUrlParams = async () => {
        const url = {
            pathname: query.id ? buildUrlPathname(query.id as string[]) : pathname,
            query: {}
        }

        return await replace(url, undefined, {shallow: true})
    }

    return {
        pushToUrl,
        resetUrlParams
    }
}
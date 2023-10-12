import {DEFAULT_DIRECTORY_ID} from "./constants";

export const buildUrlPathname = (urlQueryParam: string[]): string => {
    return urlQueryParam.join('/');
}

export const getOpenDirectoryId = (urlQueryParam: string[]): number => {
    if (!urlQueryParam?.length) {
        return DEFAULT_DIRECTORY_ID;
    }
    return Number(urlQueryParam.slice(-1))
}
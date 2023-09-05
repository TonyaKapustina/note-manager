export const buildUrlPathname = (urlQueryParam: string[]): string => {
    return urlQueryParam.join('/');
}

export const getOpenDirectoryId = (urlQueryParam: string[]): number => {
    return Number(urlQueryParam.slice(-1))
}
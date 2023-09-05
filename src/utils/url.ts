export const buildUrlPathname = (urlQueries: string[]) => {
    return urlQueries.join('/');
}
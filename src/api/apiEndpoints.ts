export const apiEndpoints = {
    directoriesList: () => `/api/directories`,
    directory: (id: number) => `/api/directories/${id}`,
    notices: () => '/api/notices',
    notice: (id: number) => `/api/notices/${id}`
};
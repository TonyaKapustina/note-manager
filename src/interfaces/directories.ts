export type DirectoryType = {
    id: number,
    name: string,
    parentId: number
    children?: DirectoryType[],
    path?: string[],
}
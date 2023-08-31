export type DirectoryType = {
    id: number,
    name: string,
    children: DirectoryType[],
    path: string[],
    parentId?: number
}
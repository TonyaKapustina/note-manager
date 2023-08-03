export type directoryType = {
    id: number,
    name: string,
    children: directoryType[],
    path: string[],
    parentId?: number
}
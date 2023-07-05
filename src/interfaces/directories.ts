export type directoryType = {
    id: number,
    name: string,
    children: directoryType[]
    parentId?: number
}
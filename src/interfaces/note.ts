export type NoteTagType = {
    value: string,
    label: string,
}

export type NoteType = {
    id: number,
    title: string,
    description: string,
    tags: NoteTagType[]
    position: number,
    directoryId: number,
}
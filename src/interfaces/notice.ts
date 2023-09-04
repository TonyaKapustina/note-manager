export type NoticeTagType = {
    value: string,
    label: string,
}

export type NoticeType = {
    id: number,
    title: string,
    description: string,
    position: number,
    tags: NoticeTagType[]
    directoryId?: number,
}

export enum NoticeSizeEnum {
    SMALL = 10,
    LARGE = 20
}
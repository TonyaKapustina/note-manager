export type NoticeTagType = {
    value: string,
    label: string,
}

export type NoticeType = {
    id: number,
    title: string,
    description: string,
    directoryId?: number,
    position?: number,
    tags?: NoticeTagType[]
}

export enum NoticeSizeEnum {
    SMALL = 10,
    LARGE = 20
}
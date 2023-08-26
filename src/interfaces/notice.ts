export type NoticeType = {
    id: number,
    title: string,
    description: string,
    position?: number,
    tags?: string[]
}

export enum NoticeSizeEnum {
    SMALL = 10,
    LARGE = 20
}
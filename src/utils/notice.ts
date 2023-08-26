import {NoticeType} from "../interfaces/notice";

export const isNoticeTitleNotUnique = (noticesList: NoticeType[], noticeId: number, noticeTitle?: string) => {
    return noticeTitle && noticesList.filter((notice) => notice.id !== noticeId).some(({title}) => title === noticeTitle.trim());
}
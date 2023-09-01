import {NoticeType} from "../interfaces/notice";

export const isNoticeTitleNotUnique = (noticesList: NoticeType[], notice: NoticeType, noticeTitle?: string) => {
    return noticeTitle && noticesList.filter(
        (item) => item.id !== notice.id && item.directoryId === notice.directoryId
    ).some(
        ({title}) => title === noticeTitle);
}
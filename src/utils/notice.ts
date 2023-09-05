import {NoteType} from "../interfaces/note";

export const isNoticeTitleNotUnique = (noticesList: NoteType[], notice: NoteType, noticeTitle?: string): null | boolean => {
    if (!noticeTitle || !noticesList?.length || !notice?.id) {
        return null;
    }
    return noticesList.filter(
        (item) => item.id !== notice.id && item.directoryId === notice.directoryId
    ).some(
        ({title}) => title === noticeTitle);
}
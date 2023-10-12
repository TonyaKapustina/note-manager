import {NoteType} from "../interfaces/note";

export const isNoteTitleNotUnique = (notesList: NoteType[], note: NoteType, noteTitle?: string): null | boolean => {
    if (!noteTitle || !notesList?.length || !note?.id) {
        return null;
    }
    return notesList.filter(
        (item) => item.id !== note.id && item.directoryId === note.directoryId
    ).some(
        ({title}) => title === noteTitle);
}
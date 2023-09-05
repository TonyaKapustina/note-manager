import {DirectoryType} from "../interfaces/directories";

export const isDirectoryNameDuplicated = (id: number, title: string, array?: DirectoryType[]): null | boolean => {
    if (!title || !array?.length) {
        return null;
    }
    return array.filter((item) => item.id !== id).some(({name}) => name === title.trim());
}
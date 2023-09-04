import {DirectoryType} from "../interfaces/directories";

export const isDirectoryNameDuplicated = (id: number, title: string, array?: DirectoryType[]): boolean => {
    if (!title.length || !array.length) {
        throw new Error('Something went wrong');
    }
    return array.filter((item) => item.id !== id).some(({name}) => name === title.trim());
}
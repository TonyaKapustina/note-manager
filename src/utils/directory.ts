import {DirectoryType} from "../interfaces/directories";

export const isDirectoryNameDuplicated = (array: DirectoryType[], id: number, title) => {
    return title && array.filter((item) => item.id !== id).some(({name}) => name === title.trim());
}
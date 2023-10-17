import {NoteType} from "../interfaces/note";
import {DirectoryType} from "../interfaces/directories";

interface IAddDirectoryArg {
    parentId: number;
    name: string;
}
interface IDeleteDirectoryArg {
    id: number;
}

export type ApiFunction<T> = (url: string, {arg}: {arg: T}) => Promise<unknown>

export const addDirectory: ApiFunction<IAddDirectoryArg> = async (url, {arg}) => {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const deleteDirectory: ApiFunction<IDeleteDirectoryArg> = async (url, {arg}) => {
    return await fetch(`${url}/${arg.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const editDirectory: ApiFunction<DirectoryType> = async (url, {arg}) => {
    await fetch(`${url}/${arg.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const addNotice: ApiFunction<Omit<NoteType, 'position' | 'id'>> = async (url, {arg}) => {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const editNotice: ApiFunction<NoteType> = async (url, {arg}) => {
    return await fetch(`${url}/${arg.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const deleteNotice: ApiFunction<{ id: number }> = async (url, {arg}) => {
    await fetch(`${url}/${arg.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}


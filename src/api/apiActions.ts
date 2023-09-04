import {NoticeTagType, NoticeType} from "../interfaces/notice";
import {DirectoryType} from "../interfaces/directories";

interface IAddDirectoryArg {
    parentId: number;
    name: string;
}
interface IDeleteDirectoryArg {
    id: number;
}
interface IEditDirectoryArg {
    id: number;
    parentId: number;
    name: string;
}
interface IAddNoticeArg {
    id: number,
    title: 'string',
    description: '',
    tags: NoticeTagType[]
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

export const addNotice: ApiFunction<IAddNoticeArg> = async (url, {arg}) => {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const editNotice: ApiFunction<NoticeType> = async (url, {arg}) => {
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


export const addDirectory = async (url, {arg}: { parentId: number, name: string }) => {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const deleteDirectory = async (url, {arg}: { id: number[] }) => {
    return await fetch(`${url}/${arg.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const editDirectory = async (url, {arg}: { parentId, id, name }) => {
    await fetch(`${url}/${arg.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const addNotice = async (url, {arg}: { id, title, description, tags }) => {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const editNotice = async (url, {arg}: { id, title, description, tags, position }) => {
    return await fetch(`${url}/${arg.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}

export const deleteNotice = async (url, {arg}: { id }) => {
    await fetch(`${url}/${arg.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(arg)
    })
}


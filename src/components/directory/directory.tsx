import React, {FC, useState} from "react";

import {useRouter} from "next/router";
import Link from "next/link";
import {directoryType} from "../../interfaces/directories";
import {InputField} from "./inputField";
import useSWRMutation from "swr/mutation";
import {apiEndpoints} from "../../api/apiEndpoints";
import {editDirectory} from "../../api/apiActions";
import {useSWRConfig} from "swr";

type DirectoryPropsType = {
    directory: directoryType
}

export const Directory: FC<DirectoryPropsType> = ({directory}) => {
    const {query: {id}} = useRouter();
    const {mutate} = useSWRConfig()
    const {trigger} = useSWRMutation(apiEndpoints.directory(directory.id), editDirectory);

    const isDirectoryOpen = id?.includes(directory?.id?.toString());
    const [isEditing, setIsEditing] = useState(false);
    const [directoryName, setDirectoryName] = useState(directory.name);

    const onEditFieldKeyDownHandler = async (event) => {
        if (event.key === "Enter" || event.key === "Escape") {
            event.target.blur();

            if (event.target.value.trim() !== directoryName || event.target.value.trim() !== "") {
                await trigger({
                    name: directoryName,
                    id: directory.id,
                    parentId:
                    directory.parentId
                });
                await mutate(apiEndpoints.directoriesList);
            }
        }
    }
// TODO: add validation on duplicated names
    const onEditFieldBlurHandler = async (event) => {
        const {target: {value}} = event;
        if (value.trim() === "") {
            setDirectoryName(directoryName);
            setIsEditing(false);
        } else {
            setDirectoryName(value);
            setIsEditing(false);
            await trigger({
                    name: directoryName,
                    id: directory.id,
                    parentId:
                    directory.parentId
                }
            )

            await mutate(apiEndpoints.directoriesList);
        }
    }

    return (
        <div className={'flex flex-row items-center justify-between p-2'}>
            {
                isEditing ?
                    <InputField
                        name="directoryName"
                        value={directoryName}
                        onChange={setDirectoryName}
                        onBlur={onEditFieldBlurHandler}
                        onKeyDown={onEditFieldKeyDownHandler}
                    />
                    :
                    <Link href={`/${directory.path.join('/')}`}>
                        <div
                            className={`flex flex-row items-center ${isDirectoryOpen ? "text-blue-700" : "text-orange-700"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"/>
                            </svg>
                            <p className="px-2">
                                {directory.id}: {directory.name}
                            </p>
                        </div>
                    </Link>
            }

            <div onClick={() => setIsEditing(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>
                </svg>
            </div>
        </div>

    )
}
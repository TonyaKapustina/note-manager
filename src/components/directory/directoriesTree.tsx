import {Directory} from "./directory";
import React, {FC} from "react";
import {directoryType} from "../../interfaces/directories";
import {useRouter} from "next/router";

interface IDirectoriesList {
    directoriesList: directoryType[]
}

export const DirectoriesTree: FC<IDirectoriesList> = ({directoriesList = []}) => {
    const {query: {id = []}} = useRouter();

    return (
        <ul className="w-full">
            {
                directoriesList.map((item) => (<li key={item.id}>
                            <Directory directory={item} directoriesList={directoriesList}/>
                            {
                                !!item.children.length && id.length && id.includes(item.id.toString()) &&
                                <div className="pl-2">
                                    <DirectoriesTree directoriesList={item.children}/>
                                </div>
                            }
                        </li>
                    )
                )
            }
        </ul>
    )
}


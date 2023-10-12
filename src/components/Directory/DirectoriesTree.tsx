import {Directory} from "./";
import React, {FC} from "react";
import {DirectoryType} from "../../interfaces/directories";
import {useRouter} from "next/router";
import {DEFAULT_DIRECTORY_ID} from "../../utils/constants";

interface IDirectoriesList {
    directoriesList: DirectoryType[]
}

export const DirectoriesTree: FC<IDirectoriesList> = ({directoriesList}) => {
    const {query: {id = []}} = useRouter();

    if (!directoriesList.length) {
        return;
    }

    return (
            <ul className="directory-tree">
                {
                    directoriesList.map((item) => (
                            <li key={item.id} className="directory-tree-item">
                                {
                                    Number(item.id) !== DEFAULT_DIRECTORY_ID && (
                                        <Directory directory={item}/>
                                    )
                                }

                                {
                                    !!item?.children?.length && id.length && id.includes(item.id.toString()) &&
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


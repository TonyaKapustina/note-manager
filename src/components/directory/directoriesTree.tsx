import {Directory} from "@/components";
import {FC} from "react";
import {directoryType} from "@/interfaces/directories";

interface IDirectoriesList {
    directoriesList: directoryType[]
}

export const DirectoriesTree: FC<IDirectoriesList> = ({directoriesList}) => {
    return (
        <ul className="w-full pl-2">
            {
                directoriesList.map(directory => (
                        <li key={directory.id}>
                            <Directory id={directory.id} name={directory.name}/>
                            {
                                !!directory.children.length &&
                                <DirectoriesTree directoriesList={directory.children}/>
                            }
                        </li>
                    )
                )
            }
        </ul>
    )
}


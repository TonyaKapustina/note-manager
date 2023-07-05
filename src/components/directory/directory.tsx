import {FC} from "react";
import {useRouter} from "next/router";

interface IDirectory {
    id: number,
    name: string
}

export const Directory: FC<IDirectory> = ({id, name}) => {
    const router = useRouter();
    const queryId = Number(router.query.id);

    console.log(router);

    return (
        <a href={`${id}`}
           className={`flex flex-row items-align p-2 text-orange-700 ${queryId == id && "text-blue-700"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"/>
            </svg>
            <p className="px-2">
                {id}: {name}
            </p>
        </a>
    )
}
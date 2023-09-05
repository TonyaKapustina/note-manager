import React, {useMemo} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import useSWR from "swr";
import {apiEndpoints} from "../api/apiEndpoints";
import {AdvancedSearchEnum, Note, Search} from "../components";
import {DEFAULT_DIRECTORY_ID} from "../utils/constants";
import {NoteType} from "../interfaces/note";

const SearchResults = () => {
    const {query: {search, isAdvancedSearch}} = useRouter();
    const {data: noticesData} = useSWR<NoteType[]>(apiEndpoints.notices);

    const noticesSearchResults = useMemo(() => {
        if (noticesData?.length && search) {
            const searchString = decodeURI(search as string);
            return noticesData.filter(({title, tags, description}) => {
                const isTitleIncluded = title.toLowerCase().includes(searchString.trim().toLowerCase());

                if (!isAdvancedSearch || isAdvancedSearch === AdvancedSearchEnum.OFF) {
                    return isTitleIncluded
                }

                if (isAdvancedSearch === AdvancedSearchEnum.ON) {
                    const isDescriptionIncluded = description.toLowerCase().includes(searchString.trim().toLowerCase());
                    const isTagIncluded = tags.some(({label}) => label.toLowerCase().includes(searchString.trim().toLowerCase()));

                    return isTitleIncluded || isDescriptionIncluded || isTagIncluded;
                }
            }) || []
        }
    }, [noticesData, search, isAdvancedSearch]);

    const searchResultsTitle = !!noticesSearchResults?.length ? 'Search results' : 'No search results'

    return (
        <div className='flex flex-col grow'>
            <Link href={`/${DEFAULT_DIRECTORY_ID}`} className='m-5'>Go to main page</Link>
            <Search/>
            <div
                className='border p-5 mt-3.5'>
                <h2 className='font-bold p-2'>{searchResultsTitle}</h2>
                {
                    !!noticesSearchResults?.length && (
                        <div className="grid grid-cols-5 gap-4 self-start">
                            {noticesSearchResults.map((notice, index) => <Note notice={notice} key={index}
                                                                               isSearchMode={true}/>)}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SearchResults;
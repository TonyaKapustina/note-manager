import React, {useMemo} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import useSWR from "swr";
import {apiEndpoints} from "../api/apiEndpoints";
import {useAppContext} from "../context/appСontext";
import {Notice, Search} from "../components";
import {DEFAULT_DIRECTORY_ID} from "../utils/constants";
import {NoticeType} from "../interfaces/notice";

const SearchResults = () => {
    const {query: {search}} = useRouter();
    const {isAdvancedSearchMode} = useAppContext();
    const {data: noticesData} = useSWR<NoticeType[]>(apiEndpoints.notices);

    const noticesSearchResults = useMemo(() => {
        if (noticesData?.length && search) {
            const searchString = decodeURI(search);
            return noticesData.filter(({title, tags, description}) => {
                const isTitleIncluded = title.toLowerCase().includes(searchString.trim().toLowerCase());

                if (!isAdvancedSearchMode) {
                    return isTitleIncluded
                }

                if (isAdvancedSearchMode) {
                    const isDescriptionIncluded = description.toLowerCase().includes(searchString.trim().toLowerCase());
                    const isTagIncluded = tags.some(({label}) => label.toLowerCase().includes(searchString.trim().toLowerCase()));

                    return isTitleIncluded || isDescriptionIncluded || isTagIncluded;
                }
            }) || []
        }
    }, [noticesData, search, isAdvancedSearchMode]);

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
                            {noticesSearchResults.map((notice, index) => <Notice notice={notice} key={index}
                                                                                 isSearchMode={true}/>)}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SearchResults;
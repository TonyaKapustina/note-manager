import React, {useMemo} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import useSWR from "swr";
import {apiEndpoints} from "../api/apiEndpoints";
import {AdvancedSearchEnum, Note, Search, ToggleSwitch} from "../components";
import {DEFAULT_DIRECTORY_ID} from "../utils/constants";
import {NoteType} from "../interfaces/note";
import {useNotesData} from "../hooks/useNotesData";

const SearchResults = () => {
    const {query: {search, isAdvancedSearch}} = useRouter();
    const {notesData} = useNotesData();

    const notesSearchResults = useMemo(() => {
        if (notesData?.length && search) {
            const searchString = decodeURI(search as string);
            return notesData.filter(({title, tags, description}) => {
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
    }, [notesData, search, isAdvancedSearch]);

    const hasSearchResults = !!notesSearchResults?.length;
    const searchResultsTitle = hasSearchResults ? `Results for: ${decodeURI(search as string)}` : 'No search results'

    return (
        <div className='results'>
            <Link href={`/${DEFAULT_DIRECTORY_ID}`} className='m-5'>Go to main page</Link>
            <div className="mb-6 flex items-center">
                <div className="mr-4">
                    <ToggleSwitch/>
                </div>
                <Search isResetAvailable={true}/>
            </div>
            <div className="border-b bottom-2 flex justify-between">
                <h3 className="text-xl font-medium pb-3">{searchResultsTitle}</h3>
                {hasSearchResults && <p>{notesSearchResults.length} note(s)</p>}
            </div>
            <div
                className='mt-8'>
                {
                    hasSearchResults && (
                        <div className="grid grid-cols-5 gap-4 self-start">
                            {notesSearchResults.map((note, index) => <Note note={note} key={index}
                                                                           isSearchMode={true}/>)}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SearchResults;
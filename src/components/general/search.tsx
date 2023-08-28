import React, {useEffect, useMemo, useRef, useState} from "react";
import {InputField} from "./inputField";
import useSWR from "swr";
import {apiEndpoints} from "../../api/apiEndpoints";
import {Notice} from "../notice/notice";
import {useAppContext} from "../../context/appСontext";


export const Search = () => {
    const {data: noticesData, isLoading: isNoticesDataLoading} = useSWR(apiEndpoints.notices);

    const {isAdvancedSearchMode} = useAppContext();

    const [searchString, setSearchString] = useState('');

    const isActive = useMemo(() => {
        return searchString.trim().length >= 3
    }, [searchString]);

    const onSearchChangeHandler = (value) => {
        setSearchString(value);
    }

    const noticesSearchResults = useMemo(() => {
        if (!isNoticesDataLoading && noticesData.length && searchString.trim().length >= 3) {
            const normalizedString = searchString.trim().toLowerCase();
            return noticesData.filter(({title, tags, description}) => {
                const searchByTitle = title.toLowerCase().includes(normalizedString);

                if (!isAdvancedSearchMode) {
                    return searchByTitle
                }

                const searchByDescription = description.toLowerCase().includes(normalizedString);
                const searchByTags = tags.some(({label}) => label.toLowerCase().includes(normalizedString));

                return searchByTitle || searchByDescription || searchByTags;
            }) || [];
        }
    }, [isNoticesDataLoading, noticesData, searchString]);

    const onClearSearchClickHandler = () => {
        setSearchString('');
    }

    const searchResultsTitle = noticesSearchResults?.length ? 'Search results' : 'Please search again';

    return (
        <div>
            <div className='flex flex-row'>
                <InputField
                    name="search-field"
                    placeholder="Search..."
                    value={searchString}
                    onChange={onSearchChangeHandler}
                />
                <button className='flex-shrink-0 rounded-md p-2 ml-5 bg-blue-400'
                        onClick={onClearSearchClickHandler}>Clear search
                </button>
            </div>
            {
                isActive && (
                    <div
                        className='border drop-shadow-xl bg-white rounded-md p-5 relative z-10 mt-3.5'>
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
                )
            }
        </div>
    )
}
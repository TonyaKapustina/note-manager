import React, {FC, useEffect, useMemo, useState} from "react";
import useSWR from "swr";
import {apiEndpoints} from "../../api/apiEndpoints";
import {useAppContext} from "../../context/appСontext";
import Select from 'react-select';
import {formatStringToCamelCase} from "../../utils/formatStringToCamelCase";
import {useRouter} from "next/router";

enum searchOptionTypeEnum {
    TITLE = 'title',
    DESCRIPTION = 'description',
    TAG = 'tag'
}

export const Search = () => {
    const {data: noticesData, isLoading: isNoticesDataLoading} = useSWR(apiEndpoints.notices);
    const {query: {search: searchQuery}, push, isReady} = useRouter();

    const {isAdvancedSearchMode} = useAppContext();
    const [searchValue, setSearchValue] = useState('');

    const noticesSearchOptions = useMemo(() => {

        if (!isNoticesDataLoading && noticesData.length) {
            const mySet = new Map();

            noticesData.map(({title, tags, description}, index) => {
                if (index > 9) {
                    return;
                }

                mySet.set(
                    `${formatStringToCamelCase(title)}-title`, {
                        label: title,
                        value: `${formatStringToCamelCase(title)}-title`,
                        type: searchOptionTypeEnum.TITLE
                    }
                );

                if (isAdvancedSearchMode) {
                    const descriptionOptionValue = `${formatStringToCamelCase(description.slice(0, 20))}-description`;
                    if (description.length >= 2) {
                        mySet.set(
                            descriptionOptionValue, {
                                label: description,
                                value: descriptionOptionValue,
                                type: searchOptionTypeEnum.DESCRIPTION
                            }
                        );
                    }
                    tags.map(({label}) =>
                        mySet.set(
                            `${formatStringToCamelCase(label)}-tag`, {
                                label,
                                value: `${formatStringToCamelCase(label)}-tag`,
                                type: searchOptionTypeEnum.TAG
                            }
                        )
                    )
                }
            });

            return [...mySet.values()];
        }
    }, [isAdvancedSearchMode, isNoticesDataLoading, noticesData]);

    useEffect(() => {
        if (isReady && searchQuery) {
            setSearchValue(noticesSearchOptions?.find(({label}) => label === decodeURI(searchQuery)));
        }
    }, [isReady, noticesSearchOptions, searchQuery]);

    const searchOptionLabel = ({label, type}) => (
        <div
            className='flex'
        >
            <div className='truncate text-ellipsis'>{label || decodeURI(searchQuery)}</div>
            {
                type && (
                    <div className='italic text-stone-700 text-xs ml-auto pl-5'>
                        ({type})
                    </div>
                )}
        </div>
    );

    const onSelectChange = (e) => {
        setSearchValue(e);
        push({
            pathname: '/results',
            query: {search: encodeURI(e.label)},
        }, undefined, {shallow: true})
    }

    return (
        <form className='flex flex-row w-[100%]'>
            <div className="w-[100%]">
                <Select
                    inputId="search"
                    name="search"
                    options={noticesSearchOptions || []}
                    value={searchValue}
                    onChange={onSelectChange}
                    formatOptionLabel={searchOptionLabel}
                />
            </div>
        </form>
    )
}
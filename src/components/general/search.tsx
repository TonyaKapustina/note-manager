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

type SearchPropsType = {
    searchQuery: string
}

export const Search: FC<SearchPropsType> = () => {
    const {data: noticesData, isLoading: isNoticesDataLoading} = useSWR(apiEndpoints.notices);
    const {query: {search: searchQuery}, push, isReady, pathname} = useRouter();


    const {isAdvancedSearchMode} = useAppContext();

    const [searchString, setSearchString] = useState('');

    useEffect(() => {
        if (isReady && searchQuery) {
            setSearchString(decodeURI(searchQuery));
        }
    }, [isReady, searchQuery]);

    const noticesSearchOptions = useMemo(() => {
        const normalizedString = searchString.trim().toLowerCase();

        if (!isNoticesDataLoading && noticesData.length && normalizedString.length >= 3) {
            const mySet = new Map();

            noticesData.map(({title, tags, description}, index) => {
                if (index > 9) {
                    return;
                }

                const isTitleIncluded = title.toLowerCase().includes(normalizedString);

                if (isTitleIncluded) {
                    mySet.set(
                        `${formatStringToCamelCase(title)}-title`, {
                            label: title,
                            value: `${formatStringToCamelCase(title)}-title`,
                            type: searchOptionTypeEnum.TITLE
                        }
                    );
                }
                if (isAdvancedSearchMode) {
                    const isDescriptionIncluded = description.toLowerCase().includes(normalizedString);

                    if (isDescriptionIncluded) {
                        const indexOfDescriptionString = description.toLowerCase().indexOf(normalizedString);
                        const descriptionOptionLabel = indexOfDescriptionString === 0 ? description : `...${description.slice(indexOfDescriptionString, description.length)}`;
                        const descriptionOptionValue = `${formatStringToCamelCase(descriptionOptionLabel.slice(0, 20))}-description`;

                        mySet.set(
                            descriptionOptionValue, {
                                label: descriptionOptionLabel,
                                value: descriptionOptionValue,
                                type: searchOptionTypeEnum.DESCRIPTION
                            }
                        );
                    }

                    tags.map(({label}) => {
                        return label.toLowerCase().includes(normalizedString) && (
                            mySet.set(
                                `${formatStringToCamelCase(label)}-tag`, {
                                    label,
                                    value: `${formatStringToCamelCase(label)}-tag`,
                                    type: searchOptionTypeEnum.TAG
                                }
                            )
                        )
                    })
                }
            });

            return [...mySet.values()];
        }
    }, [isAdvancedSearchMode, isNoticesDataLoading, noticesData, searchString]);

    const onSearchOptionLabelClick = (value: string) => {
        push({
            pathname: '/results',
            query: {search: encodeURI(value)}
        })
    }

    const searchOptionLabel = ({label, type}) => (
        <div
            className='flex'
            onClick={() => onSearchOptionLabelClick(label)}
        >
            <div className='truncate text-ellipsis'>{label}</div>
            <div className='italic text-stone-700 text-xs ml-auto pl-5'>
                ({type})
            </div>
        </div>
    );

    const onInputChangeHandler = (value) => {
        setSearchString(value)
    }

    console.log(noticesSearchOptions);

    return (
        <form className='flex flex-row w-[100%]'>
            <div className="w-[100%]">
                <Select
                    inputId="aria-example-input"
                    name="aria-live-color"
                    options={noticesSearchOptions || []}
                    inputValue={searchString}
                    onInputChange={onInputChangeHandler}
                    formatOptionLabel={searchOptionLabel}
                />
            </div>
        </form>
    )
}
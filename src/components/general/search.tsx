import React, { useMemo, useState} from "react";
import useSWR from "swr";
import {apiEndpoints} from "../../api/apiEndpoints";
import {useAppContext} from "../../context/appСontext";
import Select from 'react-select';
import {formatStringToCamelCase} from "../../utils/formatStringToCamelCase";

enum searchOptionTypeEnum {
    TITLE = 'title',
    DESCRIPTION = 'description',
    TAG = 'tag'
}

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

    // TODO: add search type

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
                            value: formatStringToCamelCase(title),
                            type: searchOptionTypeEnum.TITLE
                        }
                    );
                }
                if (isAdvancedSearchMode) {
                    const isDescriptionIncluded = description.toLowerCase().includes(normalizedString);

                    if (isDescriptionIncluded) {
                        const indexOfDescriptionString = description.toLowerCase().indexOf(normalizedString);
                        const descriptionOptionLabel = indexOfDescriptionString === 0 ? description : `...${description.slice(indexOfDescriptionString, description.length)}`;
                        const descriptionOptionValue = formatStringToCamelCase(descriptionOptionLabel.slice(0, 20));

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
                                    value: formatStringToCamelCase(label),
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

    const onClearSearchClickHandler = () => {
        setSearchString(null);
    }

    const formatOptionLabel = ({ label, type }) => (
        <div className='flex'>
            <div className='truncate text-ellipsis'>{label}</div>
            <div className='italic text-stone-700 text-xs ml-auto pl-5'>
                ({type})
            </div>
        </div>
    );

    return (
        <form>
            <div className='flex flex-row'>
                <div className="w-[100%]">
                    <Select
                        inputId="aria-example-input"
                        name="aria-live-color"
                        options={noticesSearchOptions || []}
                        inputValue={searchString}
                        onInputChange={(value) => setSearchString(value)}
                        formatOptionLabel={formatOptionLabel}
                    />
                </div>
            </div>
            {/*{*/}
            {/*    isActive && (*/}
            {/*        <div*/}
            {/*            className='border drop-shadow-xl bg-white rounded-md p-5 relative z-10 mt-3.5'>*/}
            {/*            /!*<h2 className='font-bold p-2'>{searchResultsTitle}</h2>*!/*/}
            {/*            {*/}
            {/*                !!noticesSearchResults?.length && (*/}
            {/*                    <div className="grid grid-cols-5 gap-4 self-start">*/}
            {/*                        {noticesSearchResults.map((notice, index) => <Notice notice={notice} key={index}*/}
            {/*                                                                             isSearchMode={true}/>)}*/}
            {/*                    </div>*/}
            {/*                )*/}
            {/*            }*/}
            {/*        </div>*/}
            {/*    )*/}
            {/*}*/}
        </form>
    )
}
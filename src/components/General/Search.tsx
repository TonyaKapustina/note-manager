import React, { useEffect, useState} from "react";
import Select, {SingleValue} from 'react-select';
import {useRouter} from "next/router";
import {useSearch} from "../../hooks/useSearch";
import {searchOptionTypeEnum} from "../../interfaces/search";

interface OptionType {
    value: string;
    label: string;
    type: searchOptionTypeEnum;
}

export const Search = () => {
    const searchOptions = useSearch();

    const {query, push, isReady} = useRouter();
    const searchQuery = decodeURI(query.search as string);

    const [searchValue, setSearchValue] = useState<OptionType | null>(null);

    useEffect(() => {
        if (isReady && searchQuery) {
            setSearchValue(searchOptions?.find(({label}) => label === searchQuery));
        }
    }, [isReady, searchOptions, searchQuery]);

    const searchOptionLabel = ({label, type}: { label: string, type: searchOptionTypeEnum }): React.ReactNode => (
        <div
            className='flex'
        >
            <div className='truncate text-ellipsis'>{label || searchQuery}</div>
            {
                type && (
                    <div className='italic text-stone-700 text-xs ml-auto pl-5'>
                        ({type})
                    </div>
                )}
        </div>
    );

    const onSelectChange = async (option: SingleValue<OptionType>) => {
        if (option) {
            setSearchValue(option);
            const updatedQuery = {
                ...query,
                search: encodeURI(option.label)
            };

            await push({
                pathname: '/results',
                query: {...updatedQuery},
            }, undefined, {shallow: true})
        }
    }

    return (
        <form className='flex flex-row w-[100%]'>
            <div className="w-[100%]">
                <Select
                    inputId="search"
                    name="search"
                    options={searchOptions}
                    value={searchValue}
                    onChange={onSelectChange}
                    formatOptionLabel={searchOptionLabel}
                />
            </div>
        </form>
    )
}
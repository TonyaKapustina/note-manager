import React, {FC, useEffect} from "react";
import Select, {SingleValue} from 'react-select';
import {useRouter} from "next/router";
import {useSearch} from "../../hooks/useSearch";
import {searchOptionTypeEnum} from "../../interfaces/search";
import {Controller, useForm} from "react-hook-form";

interface OptionType {
    value: string;
    label: string;
    type: searchOptionTypeEnum;
}

type SearchPropsType = {
    isResetAvailable?: boolean
}

export const Search: FC<SearchPropsType> = ({isResetAvailable = false}) => {
    const searchOptions = useSearch();

    const {query, push, isReady} = useRouter();
    const searchQuery = decodeURI(query.search as string);

    const {control, handleSubmit, setValue, reset} = useForm({
        mode: 'onChange',
        defaultValues: {
            search: searchQuery || null,
        }
    })

    useEffect(() => {
        if (isReady && searchQuery) {
            setValue('search', searchOptions?.find(({label}) => label === searchQuery));
        }
    }, [isReady, searchOptions, searchQuery, setValue]);

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

    const navigateToResultsPage = async (option: SingleValue<OptionType>) => {
        if (option?.label) {
            const {id, ...rest} = query;
            const updatedQuery = {
                ...rest,
                search: encodeURI(option.label)
            };

            await push({
                pathname: '/results',
                query: {...updatedQuery},
            }, undefined, {shallow: true})
        }
    }

    const resetFormClickHandler = async () => {
        const {search, id, ...rest} = query;
        await push({
            pathname: '/results',
            query: {...rest},
        }, undefined, {shallow: true});
        reset();
    }

    const onSubmit = async ({search}) => {
        await navigateToResultsPage(search);
    }

    const handleSelectChange = (selectedOption) => {
        setValue('search', selectedOption);
        handleSubmit(onSubmit)();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
            <div className="max-w-[40vw] w-full">
                <Controller
                    name="search"
                    control={control}
                    render={({field}) => {
                        return (
                            <Select
                                {...field}
                                className="select w-full"
                                options={searchOptions}
                                value={field.value}
                                onChange={handleSelectChange}
                                formatOptionLabel={searchOptionLabel}
                                placeholder="Search..."
                                isClearable
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderRadius: '25px',
                                        height: '44px'
                                    }),
                                }}
                            />
                        )
                    }}
                />
            </div>
            {
                isResetAvailable &&
                <button type="reset" onClick={resetFormClickHandler} className="form-button ml-5">Reset form</button>

            }
        </form>
    )
}
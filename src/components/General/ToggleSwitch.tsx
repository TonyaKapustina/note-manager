import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {buildUrlPathname} from "../../utils/url";

export enum AdvancedSearchEnum {
    ON = 'on',
    OFF = 'off'
}

export const ToggleSwitch = () => {
    const {query, push } = useRouter();
    const [toggleValue, setToggleValue] = useState(false);

    useEffect(() => {
        if (query.isAdvancedSearch === AdvancedSearchEnum.ON) {
            setToggleValue(true);
        }
    }, [query.isAdvancedSearch]);

    const onInputChange = async() => {
        setToggleValue(!toggleValue);

        const updatedQuery = {
            ...query,
            isAdvancedSearch: !toggleValue ? AdvancedSearchEnum.ON : AdvancedSearchEnum.OFF,
        };

        const url = buildUrlPathname(query.id as string[]);
        await push({url, query: {...updatedQuery}}, undefined, {shallow: true});
    };

    return (
        <div className='flex flex-row items-center'>
            <label className='mr-5'>Advanced Search Mode</label>
            <input
                className="react-switch-checkbox"
                id="react-switch-new"
                type="checkbox"
                checked={toggleValue}
                onChange={onInputChange}
            />
            <label
                className={`react-switch-label ${toggleValue && 'active'}`}
                htmlFor="react-switch-new"
            >
                <span className={`react-switch-button`}/>
            </label>
        </div>
    );
};

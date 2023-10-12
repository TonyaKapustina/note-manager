import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {buildUrlPathname} from "../../utils/url";
import {Tooltip} from "./Tooltip";

export enum AdvancedSearchEnum {
    ON = 'on',
    OFF = 'off'
}

export const ToggleSwitch = () => {
    const {query, push, pathname} = useRouter();
    const [toggleValue, setToggleValue] = useState(false);

    useEffect(() => {
        if (query.isAdvancedSearch === AdvancedSearchEnum.ON) {
            setToggleValue(true);
        }
    }, [query.isAdvancedSearch]);

    const onInputChange = async () => {
        setToggleValue(!toggleValue);

        const {id, ...rest} = query;

        const updatedQuery = {
            ...rest,
            isAdvancedSearch: !toggleValue ? AdvancedSearchEnum.ON : AdvancedSearchEnum.OFF,
        };

        const url = {
            pathname: query?.id ? buildUrlPathname(query?.id as string[]) : pathname,
            query: {...updatedQuery}
        };

        await push(url, undefined, {shallow: true});
    };

    return (
        <Tooltip text="Advanced search mode">
            <div className='flex flex-row items-center ml-2'>
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
        </Tooltip>
    );
};

import {useMemo} from "react";
import {formatStringToCamelCase} from "../utils/formatStringToCamelCase";
import {useNotesData} from "./useNotesData";
import {searchOptionTypeEnum} from "../interfaces/search";
import {useRouter} from "next/router";
import {AdvancedSearchEnum} from "../components";

export const useSearch = () => {
    const {notesData, isNotesDataLoading} = useNotesData();
    const {query: {isAdvancedSearch}} = useRouter();

    return useMemo(() => {
        if (!isNotesDataLoading && notesData?.length) {
            const mySet = new Map();

            notesData.map(({title, tags, description}, index) => {
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

                if (isAdvancedSearch === AdvancedSearchEnum.ON) {
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

            return Array.from(mySet.values());
        }

        return [];
    }, [isAdvancedSearch, isNotesDataLoading, notesData]);
}
import React, {FC} from "react";

type EditFieldPropsType = {
    value: string,
    setValue: (string) => void,
    onBlur: (string) => void,
    onKeyDown: (string) => void,
}

export const EditField: FC<EditFieldPropsType> = ({value, setValue, onBlur, onKeyDown}) => {
    const onChange = (event) => setValue(event.target.value);

    return (
        <input
            type="text"
            name="directoryName"
            id="directoryName"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            autoFocus={true}
        />
    )
}
import React, {FC} from "react";

type EditFieldPropsType = {
    name: string,
    value: string,
    onChange: (string) => void,
    onBlur?: (string) => void,
    onKeyDown?: (string) => void,
    hasErrors?: boolean,
    errorText?: string
}

export const InputField: FC<EditFieldPropsType> = ({
                                                       name,
                                                       value,
                                                       onBlur,
                                                       onKeyDown,
                                                       onChange,
                                                       hasErrors,
                                                       errorText,
                                                       ...inputProps
                                                   }) => {
    const onInputChange = (event) => {
        onChange(event.target.value);
    }

    return (
        <div>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                autoFocus={true}
                className={`px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full ${hasErrors && 'border-red-500'}`}
                {...inputProps}
            />
            {
                hasErrors && (
                    <small className="font-normal leading-normal mt-0 mb-4 text-red-800">
                        {errorText}
                    </small>
                )
            }
        </div>
    )
}
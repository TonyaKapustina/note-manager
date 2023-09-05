import React, {FC, ChangeEvent, KeyboardEvent, useState} from "react";

type EditFieldPropsType = {
    name: string,
    value: string,
    onChange: (value: string) => void,
    editEntityRequest?: (newName: string) => Promise<void>,
    errorText?: string,
    className?: string,
    placeholder?: string
}

export const InputField: FC<EditFieldPropsType> = ({
                                                       name,
                                                       value,
                                                       onChange,
                                                       errorText,
                                                       editEntityRequest,
                                                       ...inputProps
                                                   }) => {
    const [errorMessage, setErrorMessage] = useState(errorText || '');

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setErrorMessage('');
        onChange(event.target.value);
    }

    const onKeyDownHandler = async (event: KeyboardEvent<HTMLInputElement>) => {
        const {key, target} = event;
        if (key === "Enter" || key === "Escape") {
            const inputTarget = target as HTMLInputElement;
            inputTarget.blur();

            if (editEntityRequest) {
                await editEntityRequest(inputTarget.value);
            }
        }
    }

    const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (editEntityRequest) {
            await editEntityRequest(event.target.value);
        }
    }

    return (
        <>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onInputChange}
                onKeyDown={onKeyDownHandler}
                onBlur={onBlurHandler}
                autoFocus={true}
                className={`px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full ${Boolean(errorMessage) && 'border-red-500'}`}
                {...inputProps}
            />
            {
                errorMessage && (
                    <small className="font-normal leading-normal mt-0 mb-4 text-red-800">
                        {errorMessage}
                    </small>
                )
            }
        </>
    )
}
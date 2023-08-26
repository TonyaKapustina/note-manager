import React, {FC} from "react";

type ToggleSwitchPropsType = {
    isOn: boolean,
    handleToggle: (value: boolean) => void;
};

export const ToggleSwitch: FC<ToggleSwitchPropsType> = ({ isOn, handleToggle }) => {

    return (
        <>
            <input
                className="react-switch-checkbox"
                id={`react-switch-new`}
                type="checkbox"
                checked={isOn}
                onChange={handleToggle}
            />
            <label
                className="react-switch-label"
                htmlFor={`react-switch-new`}
            >
                <span className={`react-switch-button`} />
            </label>
        </>
    );
};

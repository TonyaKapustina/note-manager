import React, {FC} from "react";

type ToggleSwitchPropsType = {
    isOn: boolean,
    handleToggle: () => void;
};

export const ToggleSwitch: FC<ToggleSwitchPropsType> = ({isOn, handleToggle}) => {
    return (
        <div className='flex flex-row items-center'>
            <label className='mr-5'>Advanced Search Mode</label>
            <input
                className="react-switch-checkbox"
                id="react-switch-new"
                type="checkbox"
                checked={isOn}
                onChange={handleToggle}
            />
            <label
                className={`react-switch-label ${isOn && 'active'}`}
                htmlFor="react-switch-new"
            >
                <span className={`react-switch-button`}/>
            </label>
        </div>
    );
};

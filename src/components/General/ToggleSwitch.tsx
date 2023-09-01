import React, {FC} from "react";

type ToggleSwitchPropsType = {
    isOn: boolean,
    handleToggle: (value: boolean) => void;
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
                style={{background: isOn && '#06D6A0'}}
                className="react-switch-label"
                htmlFor="react-switch-new"
            >
                <span className={`react-switch-button`}/>
            </label>
        </div>
    );
};

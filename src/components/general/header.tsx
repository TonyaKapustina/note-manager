import React, {useState} from "react";
import {ToggleSwitch} from "./toggleSwitch";

export default function Header() {
    const [value, setValue] = useState(false);
    return (
        <div className="bg-blue-700">
            <div className="container mx-auto px-2 py-3 sm:px-6 lg:px-8 text-white text-xl">
                Note manager
                <ToggleSwitch
                    isOn={value}
                    handleToggle={() => setValue(!value)}/>
            </div>
        </div>
    )
}
import React from "react";
import {ToggleSwitch} from "../General";

export default function Header() {
    return (
        <div className="bg-blue-700">
            <div className="container mx-auto px-2 py-3 sm:px-6 lg:px-8 text-white text-xl flex flex-row justify-between">
                Note manager
                <ToggleSwitch />
            </div>
        </div>
    )
}
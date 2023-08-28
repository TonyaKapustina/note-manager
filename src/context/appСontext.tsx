import React, {createContext, useContext, useState} from "react";

const AppContext = createContext({
   isAdvancedSearchMode: false,
   setIsAdavancedSearchMode: () => false,
});

const useAppProvider = () => {
    const [isAdvancedSearchMode, setIsAdavancedSearchMode] = useState<boolean>(false);

    return {
        isAdvancedSearchMode,
        setIsAdavancedSearchMode
    }
}

export const AppContextProvider = ({children}) => {
    const context = useAppProvider();
    return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
    return useContext(AppContext)
}
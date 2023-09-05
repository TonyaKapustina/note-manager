import React, {createContext, useContext, useState, FC, ReactNode, SetStateAction, Dispatch} from "react";

type AppContextProviderType = {
    children: ReactNode;
};

export type AppContextType = {
    isAdvancedSearchMode: boolean;
    setIsAdvancedSearchMode: Dispatch<SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType>({
   isAdvancedSearchMode: false,
   setIsAdvancedSearchMode: () => false,
});

const useAppProvider = (): AppContextType => {
    const [isAdvancedSearchMode, setIsAdvancedSearchMode] = useState(false);

    return {
        isAdvancedSearchMode,
        setIsAdvancedSearchMode
    }
}

export const AppContextProvider: FC<AppContextProviderType> = ({children}) => {
    const context = useAppProvider();
    return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
    return useContext(AppContext)
}
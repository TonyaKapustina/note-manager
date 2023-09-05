import Header from './Header'
import Sidebar from './Sidebar'
import React, {FC, ReactNode} from "react";

type LayoutPropsType = {
    children: ReactNode
}

export const Layout: FC<LayoutPropsType> = ({children}) => {
    return (
        <div className="flex flex-col grow min-h-full">
            <Header/>
            <main className="flex grow min-h-full">
                <Sidebar/>
                <section className="flex grow p-4">
                    {children}
                </section>
            </main>
            <div id="modal-root"></div>
        </div>
    )
}

export default {Layout};
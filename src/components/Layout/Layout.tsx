import Header from './Header'
import React, {FC, ReactNode} from "react";

type LayoutPropsType = {
    children: ReactNode
}

export const Layout: FC<LayoutPropsType> = ({children}) => {
    return (
        <div className="flex flex-col grow h-screen">
            <main className="flex grow min-h-full flex-col">
                <Header/>
                <section className="flex grow main-section">
                    {children}
                </section>
            </main>
            <div id="modal-root"></div>
        </div>
    )
}

export default {Layout};
import Header from './header'
import Sidebar from './sidebar'

export const Layout = ({children}) => {
    return (
        <div className="flex flex-col grow min-h-full">
            <Header/>
            <main className="flex grow min-h-full">
                <Sidebar/>
                <section className="flex grow container py-4">
                    {children}
                </section>
            </main>
        </div>
    )
}

export default {Layout};
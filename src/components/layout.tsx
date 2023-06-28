import Header from './header'
import Sidebar from './sidebar'

export default function Layout({children}) {
    return (
        <>
            <Header/>
            <main className="grid grid-cols-4 gap-4">
                <Sidebar />
                <section>
                    {children}
                </section>
            </main>
        </>
    )
}
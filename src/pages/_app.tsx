import '../styles/global.css'
import {Layout} from "@/components";
import {SWRConfig} from 'swr'

const MyAppComponent = ({Component, pageProps}) => {
    return (
        <SWRConfig
            value={{
                fetcher: (resource, init) => fetch(`http://localhost:3000${resource}`, init).then(res => res.json())
            }}
        >
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SWRConfig>
    )
}

export default MyAppComponent;
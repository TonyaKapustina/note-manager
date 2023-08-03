import React from "react";
import {Layout} from "../components";
import {SWRConfig} from 'swr'
import {AppProps} from "next/app";

import '../styles/global.css'

const MyAppComponent = ({Component, pageProps}: AppProps) => {
    return (
        <SWRConfig
            value={{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SWRConfig>
    )
}

export default MyAppComponent;
import React from "react";
import {Layout} from "../components";
import {SWRConfig} from 'swr'
import {AppProps} from "next/app";

import '../styles/global.css'
import {SnackbarProvider} from "notistack";

const MyAppComponent = ({Component, pageProps}: AppProps) => {
    return (
        <SWRConfig
            value={{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json()),
                revalidateOnFocus: false
            }}
        >
            <SnackbarProvider
                maxSnack={3}
                preventDuplicate={true}
                autoHideDuration={2000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
            </SnackbarProvider>
        </SWRConfig>
    )
}

export default MyAppComponent;
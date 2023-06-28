import Layout from '../components/layout'
import '../styles/global.css'
export default function MyAppComponent({Component, pageProps}) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}
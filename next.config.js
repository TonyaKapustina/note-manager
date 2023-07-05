/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/1',
                permanent: false,
            },
        ];
    },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
// const nextConfig = {}
//
// module.exports = nextConfig


module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/tokens',
                permanent: true, // 如果是临时重定向，设置为 false
            },
        ]
    },
}
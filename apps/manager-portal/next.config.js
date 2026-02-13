/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@fgsn/ui', '@fgsn/dtos', '@fgsn/database'],
    experimental: {
        serverActions: true
    }
}

module.exports = nextConfig

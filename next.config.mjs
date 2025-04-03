/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Suppress Sequelize dynamic require() warning
            config.module.exprContextCritical = false;
        }
        return config;
    },
};

export default nextConfig;
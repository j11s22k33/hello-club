const isProd = process.env.NODE_ENV === 'production'
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, {defaultConfig}) => {
    console.log(`[next.config.js]`, phase)
    console.log(defaultConfig)

    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            /* development only config options here */
        }
    }
    
    return {
        /* config options for all phases except development here */
        // env: {
        //     customKey: 'my-value',
        //     PUBLIC_URL: '/club'
        // },
        // trailingSlash: true,
        basePath: '/club',
        // assetPrefix: '/club',
        // publicRuntimeConfig: {
        //     basePath: "/club",
        // }
    }
}
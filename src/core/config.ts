
const get = <T = string>(name: string, defaultValue: T = null, cast: (v: any) => T = (v) => v): T => {
    const val = process.env[name]
    if (!val) return defaultValue
    return cast(val)
}


const getRegion = (env: string) => {
    if (env === 'local') return 'us-east-1'
    if (env === 'dev') return 'us-east-1'
    if (env === 'staging') return 'us-east-1'
    if (env === 'prod') return 'us-east-1'
}

const env = get('LUNE_ENV')

const config = {
    env,
    region: getRegion(env),
    logLevel: get('LOG_LEVEL'),
    version: get('LUNE_VERSION'),
    graphcmsApiToken: get('GRAPHCMS_API_TOKEN'),
    graphcmsApiUrl: get('GRAPHCMS_API_URL'),
}

export type Config = typeof config

export default config
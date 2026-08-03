import { ConfigContext, ExpoConfig } from 'expo/config'

/**
 * Dynamic config layered on top of the static `app.json`.
 *
 * Injects the Android Google Maps API key from the environment so it stays out
 * of source control (per CLAUDE.md "never hardcode keys"). Set GOOGLE_MAPS_API_KEY
 * in your local `.env` / EAS secrets. iOS uses Apple Maps and needs no key.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    return {
        ...config,
        name: config.name ?? 'good-pocket',
        slug: config.slug ?? 'good-pocket',
        android: {
            ...config.android,
            config: {
                ...config.android?.config,
                ...(apiKey ? { googleMaps: { apiKey } } : {}),
            },
        },
    }
}

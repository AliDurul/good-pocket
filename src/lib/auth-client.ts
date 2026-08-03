import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { ENV } from "@/config/env";

export const authClient = createAuthClient({
    baseURL: ENV.API_ORIGIN, // bare origin; in dev this follows Metro's LAN IP
    basePath: "/api/v1/auth", // Path separately
    plugins: [
        expoClient({
            scheme: "goodpocket",
            storagePrefix: "goodpocket",
            cookiePrefix: "goodtaste", // or "__Secure-goodtaste"
            storage: SecureStore,
        }),
        inferAdditionalFields({
            user: {
                phone: { type: "string" },
                address: { type: "string" },
                city: { type: "string" },
                country: { type: "string" },
                birthday: { type: "string", required: false },
                town: { type: 'string' },
                role: { type: "string", required: false }
            }
        })
    ]
});


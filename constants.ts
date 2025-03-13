const isDev = process.env.NODE_ENV === 'development'

export async function errorMessage (msg: any) {
    const payload = {
        success: false,
        message: msg,
        data: null
    }
    if (isDev) console.log(payload)
    return payload 
}

export const AuthErrors = {
    "Configuration": "There is a problem with the server configuration. Check if your options are correct.",
    "AccessDenied": "Usually occurs when you restricted access through the signIn callback, or redirect callback.",
    "Verification": "Related to the Email provider. The token has expired or has already been used.",
    "Default": "Catch all, will apply if none of the above matched.",
    "ErrorPageLoop": "Thrown when Auth.js is misconfigured and accidentally tried to require authentication on a custom error page.",
    "CallbackRouteError": "This error occurs when the user cannot finish login. Depending on the provider type, this could have happened for multiple reasons.",
    "OAuthSignInError": "Happens when login by OAuth could not be started.",
    "CLIENT_FETCH_ERROR": "There is a problem with the server configuration. Check the server logs for more information.",
    "SIGNIN_OAUTH_ERROR": "An error occurred during OAuth sign-in process."
} as const

export const googleRedirectUri = isDev ? 'http://localhost:3000/api/auth/callback/google' : 'https://splitpay-nine.vercel.app/api/auth/callback/google'
export const linkedinRedirectUri = isDev ? 'http://localhost:3000/api/auth/callback/linkedin' : 'https://splitpay-nine.vercel.app/api/auth/callback/linkedin'
export const twitterRedirectUri = isDev ? 'http://localhost:3000/api/auth/callback/twitter' : 'https://splitpay-nine.vercel.app/api/auth/callback/twitter'
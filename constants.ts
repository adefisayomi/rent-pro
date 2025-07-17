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

export const auth_token = "auth-token"
export const userKey = 'users'
export const socialKey = 'socials'
export const professionalKey = 'professionalDetails'
export const notificationKey = 'notifications'
export const propertyKey = 'property'
export const favouritesKey = 'favourites'
export const messageKey = "messages";

export const NEXT_PUBLIC_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://rent-pro-virid.vercel.app'
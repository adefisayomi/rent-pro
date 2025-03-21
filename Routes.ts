
const Routes = {
    home: '/',
    login: '/signin',
    signup: '/signin',
    resetPassword: '/reset/password',
    contact: '/contact',
    aboutUs: '/about',
    listing: '/listings',
    services: '/services',
    dashboard: {
        'account management' : {
            'account information': '/dashboard/account',
            'social profile': '/dashboard/account/socials',
            'password': '/dashboard/account/password',
        },
        'professional tools' : {
            'professional details': '/dashboard/tools/details',
            'my properties': '/dashboard/tools/properties',
            'add new properties': '/dashboard/tools/add-new',
            'my plan': '/dashboard/tools/plan',
        },
        engagement: {
            message: '/dashboard/engagement/message',
            reviews: '/dashboard/engagement/reviews',
            favourites: '/dashboard/engagement/favourites',
        },
        settings: {
            'alarm & nofitications': '/dashboard/settings/notifications',
        }
        
    }
}

export default Routes
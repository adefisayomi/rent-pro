import { Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/contexts/useAuth"
import { redirect, useRouter } from "next/navigation"
import useAlert from "@/hooks/useAlert"




export const SocialAuth = () => {
    const {googleLogin, facebookLogin} = useAuthStore()

    const {setAlert} = useAlert()
    const router = useRouter()
    const handleAuth = async (func: Function) => {
        const res = await func()
        if (res.success && res.redirectUrl) {
            return router.replace(res.redirectUrl)
        }
    }

    return (
        <div className="w-full grid grid-cols-2 gap-4">
            <Button onClick={() => handleAuth(() => facebookLogin(setAlert))} variant='outline' className="flex items-center justify-center gap-1 text-muted-foreground">
                <Facebook className="text-blue-600"/> 
                Facebook
            </Button>

            <Button onClick={() => handleAuth(() => googleLogin(setAlert))} variant='outline' className="flex items-center justify-center gap-1 text-muted-foreground">
                <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="" className="object-contain flex aspect-square w-6"/>
                Google
            </Button>
        </div>
    )
}


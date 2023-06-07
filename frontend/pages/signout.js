import { useRouter } from 'next/router'
import NavBar from '../components/NavBar'

export default function signout() {
    const router = useRouter()
    
    const signout = async() => {
        try {

            var requestOptions = {
                method: 'GET',
                credentials: 'include',
                redirect: 'follow'           
            }; 
            
            const response = await fetch("http://127.0.0.1:8000/signout", requestOptions)

            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    signout()

    return (
        <>
            <NavBar />
        </>
    )
}
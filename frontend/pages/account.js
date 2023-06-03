import NavBar from '../components/NavBar'
import Alert from '../components/Alert'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function getCookieValue(name) {
    return document.cookie 
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
}

export default function account() {
    const router = useRouter()
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        const authenticate = async () => {
            try {
                var requestOptions = {
                    method: 'GET',
                    credentials: 'include'
                }; 
                
                // fetch user data and check if user is authenticated
                const response = await fetch("http://127.0.0.1:8000/account", requestOptions)
               
                // if user is not authenticated (or expired), redirect to login
                if (response.status != 200) {
                    router.push('/login')
                    return
                }

                setAuthenticated(true)
            } catch (error) {
                console.log(error)
            }
        }

        authenticate()
    }, [])

    if (authenticated) {

        return (
            <>
                <NavBar />
                <div className='flex'>
                    <div className="card card-side bg-base-100 border border-2">
                        <figure><img src="/images/logo.png" alt="Movie"/></figure>
                        <div className="card-body">
                            <h2 className="card-title">New movie is released!</h2>
                            <p>Click the button to watch on Jetflix app.</p>
                            <div className="card-actions justify-end">
                            <button className="btn btn-primary">Watch</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-4xl text-sky-500">401 - Unauthorized</h1>
                <img src="/images/lock.svg" className="object-scale-down h-48 w-96 " />
            </div>
        )
    }
}
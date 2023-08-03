import NavBar from '/components/NavBar'
import Footer from '/components/Footer'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';

export default function account() {
    const [authenticated, setAuthenticated] = useState(false)
    const [data, setData] = useState({name : '', username : ''})
    const [isSeller, setIsSeller] = useState(true)
    const [store, setStore] = useState('')

    const router = useRouter()

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

                const json_data = await response.json()

                setData({name: json_data['name'], username : json_data['username']})

                setAuthenticated(true)

            } catch (error) {
                console.log(error)
            }

            try {
                var requestOptions = {
                    method: 'GET',
                    credentials: 'include'
                }; 
                
                // fetch user data and check if user is a seller
                const response = await fetch("http://127.0.0.1:8000/account/is-seller", requestOptions)
               
                // user is not a seller
                if (response.status == 200) {
                    const seller_data = await response.json()
                    setStore(seller_data['store-name'])
                } else {
                    setIsSeller(false)
                }
            } catch (error) {
                console.log(error)
            }
        }


        authenticate()
    }, [])

    if (authenticated) {
        return (
            <div className='flex flex-col items-center space-y-14 w-full h-screen'>
                <NavBar/>
                <h1 className='self-start mx-4 px-8'>Hello {data.name}!</h1>
                <div className='grid grid-rows-2 grid-flow-col gap-4 min-w-max'>
                    <div className="card card-side bg-base-100 h-36 border border-2">
                        <figure>
                            <svg className='bg-sky-100'  width="200px" height="150px" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clipRule="evenodd" fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" />
                                <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
                            </svg>
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">New movie is released!</h2>
                            <p>Click the button to watch on Jetflix app.</p>
                        </div>
                    </div>
                    <div className="card card-side bg-base-100 h-36 border border-2">
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" className='bg-sky-100' fill="currentColor" width="200px" height="150px"viewBox="-25 -25 560 560">
                                <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
                            </svg>
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">Settings</h2>
                            <p>Click the button to watch on Jetflix app.</p>
                        </div>
                    </div>
                    <div className="card card-side bg-base-100 h-36 border border-2">
                        <figure>
                            <svg className='bg-sky-100'  width="200px" height="150px" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clipRule="evenodd" fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" />
                                <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
                            </svg>
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">New movie is released!</h2>
                            <p>Click the button to watch on Jetflix app.</p>
                        </div>
                    </div>
                    {isSeller ? (
                        <div className="card card-side bg-base-100 h-36 border border-2">
                            <figure className="w-[186px] bg-sky-100">
                                <img src='/images/logo.png' className="object-fit" alt={`${data.name}'s logo.`}/>
                            </figure>
                            <div className="card-body pt-3">
                                <h2 className="card-title">Store Settings</h2>
                                <ul>
                                    <li><Link className='link' href={`${store}/products/create`}>Create a Product</Link></li>
                                    <li><Link className='link' href={`${store}/products/view`}>View My Products</Link></li>
                                    <li><Link className='link' href={`${store}/edit`}>Edit Store Page</Link></li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="card card-side bg-base-100 h-36 border border-2">
                            <figure>
                                <svg className='bg-sky-100'  width="200px" height="150px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" />
                                    <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
                                </svg>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">Become a Seller</h2>
                                <p>
                                    <Link className='link' href='/seller/signup'>Become a Seller</Link>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <Footer/>
            </div>
        )
    }
}
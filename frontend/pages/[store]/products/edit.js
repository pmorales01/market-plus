import NavBar from '/components/NavBar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function edit() {
    const router = useRouter()
    const [products, setProducts] = useState([])
    useEffect(() => {
        const getProducts = async () => {
            // authenticate the user 
            try {
                var requestOptions = {
                    method: 'GET',
                    credentials: 'include'
                }; 
                
                // get the seller's name
                const store = window.location.pathname.match(/\/([^/]+)/)[1]

                // fetch user data and check if user is an authenticated seller
                const response = await fetch(`http://127.0.0.1:8000/${store}/products/edit`, requestOptions)
               
                // if user is not authenticated or access was denied, redirect to login
                if (response.status != 200) {
                    router.push('/login')
                    return 
                }  

                console.log(response)

                const json_data = await response.json()

                console.log(json_data)

                setProducts(json_data)

            } catch (error) {
                console.log(error)
            }
        }
        getProducts()
    }, [])

    const handleClick = () => {
    }

    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            {products.map((product) => {
                const link = `/${product['seller']}/products/item/${product['alias']}/${product['id']}/edit`
                return (
                    <div key={product['id']} className="card w-96 bg-base-100 shadow-xl">
                        <figure><img src={`data:${product['image']['type']};base64,${product['image']['bytes']}`} alt="Shoes" /></figure>
                        <div className="card-body">
                            <h3 className="text-xl font-semibold truncate"><a href={link}>{product['name']}</a></h3>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary" onClick={handleClick}>Edit</button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
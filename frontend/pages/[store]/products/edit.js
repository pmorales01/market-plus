import NavBar from '/components/NavBar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function edit() {
    const router = useRouter()
    // list of seller's products
    const [products, setProducts] = useState([])
    // State for triggering data refresh (after a clone or deletion takes place)
    const [refresh, setRefresh] = useState(false)

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
                    router.push('/')
                    return 
                }  

                const json_data = await response.json()

                setProducts(json_data)

            } catch (error) {
                console.log(error)
            }
        }
        getProducts()
    }, [refresh])

    const handleEdit = (event) => {
        // redirect to product's own edit page
        const link = event.target.getAttribute('data-link')
        router.push(link)
    }

    const handleCopy = async (event) => {
        // get the seller, name, and id of product to copy
        const input = event.target
        const seller = input.getAttribute('data-seller')
        const name = input.getAttribute('data-name')
        const id = input.getAttribute('data-id')

        try {
            var requestOptions = {
                method: 'POST',
                credentials: 'include'
            }; 
            
            // clone the product
            const response = await fetch(`http://127.0.0.1:8000/${seller}/products/${name}/${id}/clone`, requestOptions)
           
            // if user is not authenticated, redirect to login
            if (response.status == 401) {
                router.push('/login')
                return 
            } else if (response.status != 200) {
                // error occured
                console.log("error occured")
            }

            // response is 200 OK, run useEffect again to see new clone
            setRefresh(!refresh)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = (event) => {

    }

    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((product) => {
                    const link = `/${product['seller']}/products/item/edit/${product['alias']}/${product['id']}`
                    return (
                        <div key={product['id']} className="border card w-56 bg-base-100 p-4 rounded">
                            <figure><img className="object-cover h-40 w-56" src={`data:${product['image']['type']};base64,${product['image']['bytes']}`} alt="Shoes" /></figure>
                            <div>
                                <h3 className="text-lg font-semibold truncate"><a href={link}>{product['name']}</a></h3>
                                {/* card buttons */}
                                <div className='flex flex-row items-center justify-center space-x-1'>
                                    <label className='h-8 flex items-center justify-center border rounded-lg bg-gray-300 text-white w-1/4 mt-4 hover:bg-rose-500 cursor-pointer'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2" viewBox="0 0 512 512">
                                            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
                                        </svg>
                                        <input data-link={link} type="button" onClick={handleEdit} />
                                    </label>                                    
                                    <label className='h-8 flex items-center justify-center border rounded-lg bg-gray-300 text-white w-1/4 mt-4 hover:bg-rose-500 cursor-pointer'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2" viewBox="0 0 512 512">
                                            <path d="M288 448H64V224h64V160H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64zm-64-96H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64z"/>
                                        </svg>
                                        <input data-seller={product['seller']} data-name={product['name']} data-id={product['id']} type="button" onClick={handleCopy}/>
                                    </label>
                                    <label className='h-8 flex items-center justify-center border rounded-lg bg-gray-300 text-white w-1/4 mt-4 hover:bg-rose-500 cursor-pointer'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2" viewBox="0 0 448 512">
                                            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                                        </svg>
                                        <input type="button" onClick={handleDelete}/>
                                    </label>                      
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
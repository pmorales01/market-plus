import NavBar from '../components/NavBar'
import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'

export default function Index () {
  // stores top products
  const [topProducts, setTopProducts] = useState([])
  
  // request to backend returned a response
  const [hasLoaded, setHasLoaded] = useState(false)


  useEffect(() => {
    const getTopProducts = async () => {
      try {
        var requestOptions = {
          method: 'GET',
        }; 
          
        // fetch user data and check if user is an authenticated seller
        const response = await fetch(`http://127.0.0.1:8000/top-products`, requestOptions)
      
        const data = await response.json()

        setTopProducts(data)

        setHasLoaded(true)
      } catch (error) {
          console.log(error)
      }
  }

    getTopProducts()
  }, [])

  return (
    <>
      <NavBar/>
      <div className="flex flex-row mx-auto w-full px-2 sm:px-6">
        <Sidebar width="w-1/6"/>
        <div className='bg-red-400 w-5/6 grid grid-cols-4 gap-1 justify-between'>
        {hasLoaded && topProducts.map((product, index) => {
            return (
              <div key={index} className="card w-full bg-base-100 shadow-xl rounded-sm">
                <div className='card-body'>
                  <p>{product['name']}</p>
                  <input type="image" src={`data:${product['image']['type']};base64,${product['image']['bytes']}`}/>
                </div>
              </div>
            )
          })}

        </div>
      </div>
    </>
    
  )
}
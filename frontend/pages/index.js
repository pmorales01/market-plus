import NavBar from '../components/NavBar'
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
        const response = await fetch(`http://127.0.0.1:8000/top-products`)
      
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
      <div>
      {hasLoaded && topProducts.map((product, index) => {
          return (
            <div key={index} className="">
              <p>{product['name']}</p>
                <input type="image" src={`data:${product['image']['type']};base64,${product['image']['bytes']}`}/>
            </div>
          )
        })}

      </div>
    </>
    
  )
}
"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Description from '/components/Description'

export default function Product () {
    const [data, setData] = useState({'name' : '', 'brand': '', 'images' : [], 'description' : ''})
    const router = useRouter()

    useEffect(() => {
        const getProduct = async () => {
            try {
                var requestOptions = {
                    method: 'GET'
                }
                
                const path = window.location.pathname

                const response = await fetch(`http://127.0.0.1:8000${path}`, requestOptions)
            
                console.log(response)

                if (response.status !== 200) {
                    router.push('/')
                    return
                }
                const json_data = await response.json()
                console.log(json_data)
                setData(json_data)
            } catch (error) {
                console.log(error)
            }
        }

        getProduct()
    }, [])

    return (
        <div>
        <h1>{data['name']}</h1>
        {data['images'].map(image => {
            return (
                <img src={`data:image/png;base64,${image}`} />
        )})}
        <p>Brand {data['brand']}</p>
        <p>Count {data['images'].length}</p>
        {/* <Description children={data['description']}/> */}
        </div>
    )
}
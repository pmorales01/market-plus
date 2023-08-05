"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

export default function Product () {
    const [source, setSource] = useState('')
    useEffect(() => {
        const getProduct = async () => {
            try {
                var requestOptions = {
                    method: 'GET'
                }
                
                const path = window.location.pathname

                const response = await fetch(`http://127.0.0.1:8000${path}`, requestOptions)
            
                console.log(response)
                const json_data = await response.json()
                setSource(json_data['image'])
            } catch (error) {
                console.log(error)
            }
        }

        getProduct()
    }, [])

    return (
        <div>
        <h1>hello</h1>
        <img src={`data:image/png;base64,${source}`} />
        </div>
    )
}
"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Description from '/components/Description'
import Gallery from '/components/Gallery'
import NavBar from '/components/NavBar'
import Link from 'next/link';

export default function Product () {
    const [data, setData] = useState({
        'name' : '', 'brand': '', 'images' : [], 'short_desc': '', 'price': 0, 
        'description': []
    })

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
        <div className="flex flex-col items-center space-y-14 w-screen h-screen">
            <NavBar/>
            <div className='grid sm:grid-cols-1 md:grid-cols-5 mx-7 gap-x-10'>
                <div className='md:col-span-2'>
                <Gallery images={data['images']}/>
                </div>
                <div className='flex flex-col md:col-span-2'>
                    <h1>{data['name']}</h1>
                    <p><Link href="/" className='link link-hover text-blue-600'>{data['seller']}</Link></p>
                    <hr/>
                    <p className='h-full'>{data['short_desc']}</p>
                    <hr/>
                </div>
                <div className='flex flex-col h-fit rounded border border-slate-300 p-1'>
                    <p className="text-3xl">
                        <sup className="text-sm px-0.5">$</sup>
                        {parseInt(data['price'])}
                        <sup className="text-sm">{data['price'].toFixed(2).split(".")[1]}</sup>
                    </p>
                    <button className='h-10 w-11/12 px-4 border rounded-lg bg-blue-500 text-white font-semibold w-1/3 hover:bg-rose-700 self-center'>Add to Cart</button>
                </div>
            </div>
            <table className='table-fixed self-start'>
                <tbody>
                    <tr>
                        <th>Brand</th>
                        <td>{data['brand']}</td>
                    </tr>
                    <tr>
                        <th>Color</th>
                        <td>{data['brand']}</td>
                    </tr>
                </tbody>
            </table>
            <Description children={data['description']}/>
        </div>
    )
}
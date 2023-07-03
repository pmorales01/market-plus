import NavBar from '/components/NavBar'
import Footer from '/components/Footer'
import ImageDisplay from '/components/ImageDisplay'
import { useState } from 'react'

export default function create_product() {
    const catergories = ['Appliances', 'Arts & Crafts', 'Automotive Accessories', 'Automotive Parts', 'Books', 'Clothing','Electronics', 'Music', 'Trading Cards', 'Video Games']
    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <div className="flex w-10/12 h-fit">
                <form method='post' className="grow form-control max-w-full space-y-2">
                    <div className="flex flex-row space-x-2">
                        <label for="item-name">Item Name</label>
                        <input type="text" id="item-name" name="item-name" required />
                    </div>
                    <h2 className="text-xl">Category (Select all that Apply)</h2>
                    <div className='flex flex-row flex-wrap space-x-2 gap-y-2'>
                        {catergories.map((category, index) => {
                            return (
                                <button key={index} className='btn rounded-full bg-neutral-200 text-zinc-500 capitalize hover:text-white'>{category}</button>
                            )
                        })}
                    </div>
                </form>
            </div>
            <Footer/>
        </div>
    )
}
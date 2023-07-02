import NavBar from '/components/NavBar'
import Footer from '/components/Footer'
import ImageDisplay from '/components/ImageDisplay'
import { useState } from 'react'

export default function create_product() {
    const [hasImageDisplays, setHasImageDisplays] = useState(false)
    const [ImageDisplays, setImageDisplays] = useState([])

    const toggle = (e) => {    
        const buttons = document.getElementById('images').children
        // deselect all the buttons
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('border-2', 'border-black', 'border-dashed')
        }

        const preview = document.getElementById('image-preview')

        while (preview.firstChild) {
            preview.removeChild(preview.firstChild)
        }

        // select the current button
        if (e.currentTarget.classList.contains('border-dashed')) {
            e.currentTarget.classList.remove('border-2', 'border-black', 'border-dashed')
        } else {
            e.currentTarget.classList.add('border-2', 'border-black', 'border-dashed')
            const image = document.createElement('img')
            image.src = e.target.src
            preview.appendChild(image)
         }
    }

    const handleClick = ((event) => {
        setHasImageDisplays(true)
        setImageDisplays([...ImageDisplays, {'id' : Math.floor(Math.random() * 101)}])
        console.log(ImageDisplays)
    })

    function deleteImageDisplay (id) {
        console.log(ImageDisplays)
        setImageDisplays(ImageDisplays.filter((display) => display.id !== id));
    }

    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <div className='flex flex-row w-11/12 h-fit bg-blue-600'>
                <div className='w-2/3 flex flex-row'>
                    <div id="images" className='flex flex-col items-center w-1/4 bg-green-200 space-y-3'>
                        <button className='bg-base-200 w-32 h-32 border hover:border-black' onClick={toggle}>
                        </button>
                        {hasImageDisplays && ImageDisplays.map((item, index) => {
                            return (
                                <ImageDisplay key={item.id} id={item.id} passedFunction={deleteImageDisplay}/>
                            )
                        })}
                        <button className="btn hover:bg-red-500 text-4xl" onClick={handleClick}>+</button>
                    </div>
                    <div className='w-3/4 flex justify-center items-center' id="image-preview">
                        <div className='bg-slate-200 w-11/12 h-11/12 border-solid border-black'>
                        </div>
                    </div>
                </div>
                <div className='w-1/3'>
                    <div className="card w-96 bg-base-100 shadow-xl">
                        <figure><img src="/images/lock.svg" alt="Shoes" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">Shoes!</h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
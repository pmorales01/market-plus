import { useState, useEffect } from 'react'

export default function Gallery({images=[]}) {
    // tracks which image to display the largest (main)
    const [source, setSource] = useState('')

    // set the first image as the main dispaly
    useEffect(() => {
        if  (images.length > 0) {
            setSource(`data:${images[0]['type']};base64,${images[0]['bytes']}`)
        }
    }, [images])

    const deselectImages = () => {
        // get all the images
        const gallery = document.getElementById('image-gallery')

        // iterate through each child node (image) and deselect if selected
        gallery.childNodes.forEach(image => {
            if (image.classList.contains('border-[#74c5f7]')) {
                image.classList.remove('border-[#74c5f7]')
            }
        })
    }

    // change the main image when clicking on another image
    const handleClick = (event) => {
        // set the main image
        setSource(event.target.src)

        deselectImages()

        // add border to represent image being selected
        event.target.parentElement.classList.add('border-[#74c5f7]')
    }

    // change the main image to the image being hovered over
    const handleMouseEnter = (event) => {
        const input = event.currentTarget
        deselectImages()
        input.classList.add('border-[#74c5f7]')
        setSource(input.children[0].src)
    }

    const handleMouseMove = (event) => {
        const rect = event.target.getBoundingClientRect()
       
    }
    
    return (
        <div className="flex flex-row w-96h-96 justify-evenly space-x-4">
            {/* images available to select */}
            <div className="flex flex-col space-y-2" id="image-gallery">
                {images.map((image, index) => {
                    return (
                        <div key={index} className="flex justify-center h-20 w-20 rounded-md border-2 border-slate-300 input-hover" onMouseEnter={handleMouseEnter}>
                            <input type="image" src={`data:${image['type']};base64,${image['bytes']}`} alt={`gallery image ${index}`} className="h-20 w-20 object-cover aspect-auto self-center rounded-md p-1" onClick={handleClick}/>
                        </div>
                    )
                })}
            </div>
            {/* main image display */}
            <div className="flex flex-row justify-center rounded w-4/5 relative" id="image-display" onMouseMove={handleMouseMove}>
                <img src={source} className='max-w-full max-h-full'/>
                <div id="magnifier"  className="w-1/3 h-1/3 bg-teal-50 opacity-30 z-50 absolute left-0">
                </div>
            </div>
            <div id="zoom-container" className='absolute right-10 z-50 bg-red-300 overflow-hidden'>
                <img src={source} alt="magnified image" className="origin-center scale-[2] h-96 translate-x-1/2" />
            </div>
        </div>
    )
}
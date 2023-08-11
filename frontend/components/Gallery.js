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

    // change the main image when clicking on another image
    const handleClick = (event) => {
        // set the main image
        setSource(event.target.src)

        // get all the images
        const gallery = document.getElementById('image-gallery')

        // iterate through each child node (image) and deselect if selected
        gallery.childNodes.forEach(image => {
            if (image.classList.contains('border-sky-600')) {
                image.classList.remove('border-sky-600')
            }
        })

        // add border to represent image being selected
        event.target.parentElement.classList.add('border-sky-600')
    }

    // change the main image to the image being hovered over
    const handleMouseEnter = (event) => {
        const input = event.currentTarget.children[0]
        setSource(input.src)
    }
    
    return (
        <div className="flex flex-row w-96 h-96 justify-evenly space-x-4">
            {/* images available to select */}
            <div className="flex flex-col space-y-2" id="image-gallery">
                {images.map((image, index) => {
                    return (
                        <div key={index} className="flex justify-center h-20 w-20 rounded-md border-2 border-slate-300 input-hover" onMouseEnter={handleMouseEnter}>
                            <input type="image" src={`data:${image['type']};base64,${image['bytes']}`} alt="gallery button" className="h-20 w-20 object-cover aspect-auto self-center rounded-md p-1" onClick={handleClick}/>
                        </div>
                    )
                })}
            </div>
            {/* main image display */}
            <div className="flex flex-row justify-center rounded w-4/5 z-50" id="image-display">
                <img src={source} className='max-w-full max-h-full'/>
            </div>
        </div>
    )
}
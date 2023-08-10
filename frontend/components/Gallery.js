import { useState, useEffect } from 'react'

export default function Gallery({images=[]}) {
    const [source, setSource] = useState('')

    useEffect(() => {
        if  (images.length > 0) {
            setSource(`data:${images[0]['type']};base64,${images[0]['bytes']}`)
        }
    }, [images])

    const handleClick = (event) => {
        setSource(event.target.src)
    }

    return (
        <div className="flex flex-row w-full">
            <div className="flex flex-col space-y-4" id="image-gallery">
                {images.map(image => {
                    return (
                        <div className="h-20 w-20 rounded-md border-2 border-slate-300 input-hover">
                            <input type="image" src={`data:${image['type']};base64,${image['bytes']}`} alt="gallery button" className="object-contain h-20 w-20 rounded-md" onClick={handleClick}/>
                        </div>
                    )
                })}
            </div>
            <div className="bg-blue-400" id="image-display">
                <div>
                    <img src={source} />
                </div>
            </div>
        </div>
    )
}
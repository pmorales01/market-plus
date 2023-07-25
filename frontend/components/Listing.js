"use client"

export default function Listing ({children}) {
    return (
    <>
    {
        children.map(child => 
            {   
                if (child.type === 'p') {
                    return (
                        <p key={child.id} className='relative cursor-pointer'>{child.data}</p>
                    )
                } else if (child.type === 'h2') {
                    return (
                        <h2 key={child.id} className='relative cursor-pointer'>{child.data}</h2>
                    )
                } else if (child.type === 'ul') {
                    return (
                        <ul key={child.id} className='relative'>
                            { child.data.map(item => {
                                return (
                                    <li key={item.id} className='list-disc cursor-pointer ml-4'>{item.item}</li>
                                )
                            })}
                        </ul>
                    )
                } else if (child.type === 'img') {
                    return (
                        <div key={child.id}>
                            <div className='flex justify-center'>
                                <img src={child.src} className='aspect-auto'/>
                            </div>
                        </div>
                    )
                } else if (child.type === 'multi-img') {
                    return (
                        <div key={child.id} className='flex flex-row flex-wrap justify-center'>
                            {child.images.map(image => {
                                return (
                                    <div key={image.id}>
                                        <img src={image.src} className='aspect-auto w-48 h-auto m-2'/>
                                    </div>
                                )
                            })}
                        </div>
                    )
                } else if (child.type === 'carousel') {
                    return (
                        <div key={child.id} className='flex flex-row space-x-4'>
                            <div className="carousel rounded-box h-96">
                                {child.items.map(item => {
                                    return (
                                        <div key={item.id} className="carousel-item w-96 flex flex-col justify-center relative">
                                            <img src={item.src} className='aspect-auto'/>
                                            <p className='absolute bottom-0 left-0 resize-none w-full'>{item.text}</p>
                                        </div> 
                                    )
                                })}
                            </div>
                        </div>
                    )
                } else if (child.type === 'img-text') {
                    return (
                        <div key={child.id} className='grid grid-cols-2 gap-4'>
                            <div className='col-span-1'>
                                <img src={child.src} className='aspect-auto'/>
                            </div>  
                            <p className='col-span-1 resize-none w-full h-48 p-1'>{child.text}</p>
                        </div>
                    )
                } else if (child.type === 'img-right-text-left') {
                    return (
                        <div key={child.id} className='grid grid-cols-2 gap-4'>
                            <p className='col-span-1 resize-none w-full h-48 p-1'>{child.text}</p>
                            <div className='col-span-1'>
                                <img src={child.src} className='aspect-auto'/>
                            </div>  
                        </div>
                    )
                }
            }
        )
    }
    </>)
}
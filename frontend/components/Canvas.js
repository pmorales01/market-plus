"use client"
import EditPopUp from '/components/EditPopUp'
import { useState } from 'react'

function getRandomNumber() {
    const x = Math.floor(Math.random() * 100) + 1
    const y = Math.floor(Math.random() * 100) + 1
    return Math.floor(x * y) + 1
}


export default function Canvas ()  {
    const [children, setChildren] = useState([])
    const [isEditing, setEditing] = useState(false)
    const [top, setTop] = useState(0)
    const [value, setValue] = useState()
    const [id, setID] = useState()
    const [type, setType] = useState()

    const handleDragStart = ((event) => {
        event.dataTransfer.setData("data", event.target.value);
    })

    // handle while dragging 
    const handleDrag = ((event) => {
        event.preventDefault()
    })

    const handleDragOver = ((event) => {
        event.preventDefault()
    })

    const handleClick = ((event) => {
        setTop(event.currentTarget.getBoundingClientRect().y)
        setEditing(!isEditing)
        setValue(event.target.innerHTML)
        setID(event.currentTarget.id)
        setType(event.target.tagName.toLowerCase())
    })

    const handleDrop = ((event) => {
        event.preventDefault()

        const id = getRandomNumber()
        const type = event.dataTransfer.getData("data")

        if (type === 'p' || type === 'h2') {
            setChildren([...children, 
                {
                    'id' : id,
                    'type' : type,
                    'data' : 'Click to edit',
                }
            ])
        } else if (type === 'ul') {
            setChildren([...children, 
                {
                    'id' : id,
                    'type' : type,
                    'data' : [{
                        'id': `${id}-${getRandomNumber()}`,
                        'item': 'Click to edit item'
                    }],
                }
            ])
        } else if (type === 'img') {
            setChildren([...children, 
            {   
                'id' : id,
                'type' : type,
                'src' : '',
            }])
        } else if (type === 'multi-img') {
            setChildren([...children,
                {
                    'id' : id,
                    'type' : type,
                    'images' : [
                        {'id' : `${getRandomNumber()}`, 'src' : ''}
                    ]
                }
            ])
        } else if (type === 'carousel') {
            setChildren([...children,
                {
                    'id' : id, 
                    'type' : type,
                    'items' : [
                        {
                            'id' : `${getRandomNumber()}`,
                            'src' : '',
                            'text' : 'Click me to edit!'
                        }
                    ]
                }
            ])
        }
    })

    const handleNewItem = ((elementID) => {
        // parentID is the 'id' of a <ul>
        const [parentID, itemID] = elementID.split('-')
        setChildren(children.map(parent => {
            if (parentID == parent.id) {
                // if parent id matches with <ul>, add <li>
                return {
                    ...parent,
                    data: [
                    ...parent.data,
                    { 
                        'id': `${parentID}-${getRandomNumber()}`,
                        'item': 'Click to edit item'
                    }]
                }
            }
            // copy the other elements 
            return {...parent}
        }))
        setEditing(false)
    })
    
    const onCancel = (() => {
        setEditing(false)
    })

    const handleUpdate = ((value, elementID) => {
        setChildren(children.map(child => {
            // get the ids of the current element in the form of 
            // [child id, item id] where child id is the parent element (<p>, <ul>)
            // and item is the child of the parent element (<li>)
            const [childID, itemID] = elementID.split('-')

            if (childID == child.id) {
                // if child is a <p>, change only the <p>'s content
                if (child.type === 'p' || child.type === 'h2') {
                   return {
                        ...child,
                        data : value
                    } 
                } else if (child.type === 'ul') {
                    // if child is <ul>, look for the <li> matching the itemID
                    const updatedItems = child.data.map(item => {
                        const ids = item.id.split('-')
                        // only change the <li>'s value
                        if (itemID == ids[1]) {
                            return {
                                ...item,
                                'item': value
                            }
                        }
                        // if itemID does not match, do not edit any <li>'s
                        return {...item}
                    })
                    // update the <ul> with the new <li> value
                    return {
                        ...child, 
                        data : updatedItems
                    }
                }
            }

            // return element that does not match ID
            return {...child}
        }))
        setEditing(false)
    })

    const handleDelete = ((elementID, elementType) => {
        // delete the selected <p> 
        if (elementType === 'p' || elementType === 'h2') {
            setChildren(children.filter(child => {
                return child.id != elementID
             }))
        } else if (elementType === 'ul' || elementType === 'li') {
            setChildren(children.map(child => {
                // childID = id of <ul>
                const [childID, itemID] = elementID.split('-')
                if (childID == child.id) {
                    // if there is more than one <li> in <ul>, then delete the matching <li>
                    if (child.data.length > 1) {
                        const newData = child.data.filter(item => {
                            return item.id != elementID
                        })

                        return {
                            ...child,
                            data: newData
                        }
                    } 
                    // delete <ul> since there are no <li> left, return null then filter
                    return null
                }
                    // copy the other <ul>
                    return {...child}
            }).filter(child => child))
        }
        console.log(children)
        setEditing(false)
    })

    const handleImageUpload = ((event) => {
        // get image
        const file = event.target.files[0];

        // read and load the image
        const reader = new FileReader()
        reader.onload = () => {
            // set the image's source
            setChildren(children.map(child => {
                if (child.id == event.target.id) {
                    return {
                        ...child, 
                        src: reader.result
                    }
                }
                return child
            }))
        }
        reader.readAsDataURL(file)
    })

    const deleteImage = ((event) => {
        event.preventDefault()
        
        const imgID = event.target.getAttribute('data-id')

        setChildren(children.filter(child => {
            // delete the image with the matching ID
            if (child.id == imgID) {
                return child.id != imgID
            }
            return child
        }))

        console.log(children)
    })

    const addImageToGroup = ((event) => {
        event.preventDefault()
        const parentID = event.target.getAttribute('parent-id')
        setChildren(children.map(child => {
            if (child.id == parentID && child.images.length <= 15) {
                return {
                    ...child,
                    images : [
                        ...child.images,
                        {
                            'id' : `${getRandomNumber()}`, 
                            'src' : ''
                        }
                    ]
                }
            }
            return child
        }))
    })

    const handleGroupImageUpload = ((event) => {
        event.preventDefault()
        const parentID = event.target.getAttribute('parent-id')
        const imgID = event.target.id
       
        // get image
        const file = event.target.files[0];

        // read and load the image
        const reader = new FileReader()
        reader.onload = () => {
            setChildren(children.map(child => {
                if (child.id == parentID) {
                    // set the image's new src
                    const newData = child.images.map(image => {
                        if (image.id == imgID) {
                            return {
                                ...image,
                                src : reader.result
                            }
                        }
                        return image
                    })
                    
                    // return the element with the updated array of images
                    return {
                        ...child,
                        images : newData
                    }
                }
                return child
            }))
        }
        reader.readAsDataURL(file)
    })

    const deleteImageFromGroup = ((event) => {
        event.preventDefault()
        const parentID = event.target.getAttribute('parent-id')
        const imgID = event.target.getAttribute('data-id')
        
        setChildren(children.map(child => {
            if (child.id == parentID) {
                // if more than 1 image is part of the group, only delete it
                if (child.images.length > 1) {
                    const newData = child.images.filter(image => {
                        return image.id != imgID
                    })

                    return {
                        ...child,
                        images : newData
                    }
                }
                // delete the entire image group since one image remains
                return null
            }
            return child
        }).filter(child => child))
    })  

    const handleCarouselImageUpload = ((event) => {
        event.preventDefault()
        const parentID = event.target.getAttribute('parent-id')
        const imgID = event.target.id
       
        // get image
        const file = event.target.files[0];

        // read and load the image
        const reader = new FileReader()
        reader.onload = () => {
            setChildren(children.map(child => {
                if (child.id == parentID) {
                    // set the image's new src
                    const newData = child.items.map(image => {
                        if (image.id == imgID) {
                            return {
                                ...image,
                                src : reader.result
                            }
                        }
                        return image
                    })
                    
                    // return the element with the updated array of images
                    return {
                        ...child,
                        items : newData
                    }
                }
                return child
            }))
        }
        reader.readAsDataURL(file)
    })

    const addImageToCarousel = ((event) => {
        event.preventDefault()
        const parentID = event.target.getAttribute('parent-id')

        // only allow more image uploads if total # of images is less than 6
        setChildren(children.map(child => {
            if (child.id == parentID && child.items.length <= 5) {
                return {
                    ...child,
                    items : [
                        ...child.items,
                        {
                            'id' : `${getRandomNumber()}`,
                            'src' : '',
                            'text' : 'Click me to edit!'
                        }
                    ]
                }
            }
            return child
        }))
    })

    const updateCarouselText = ((event) => {
        event.preventDefault()
        const parentID = event.target.getAttribute('parent-id')
        const imgID = event.target.getAttribute('elem-id')
       
        setChildren(children.map(child => {
            if (child.id == parentID) {
                const newData = child.items.map(image => {
                    if (image.id == imgID) {
                        return {
                            ...image,
                            text : event.target.value
                        }
                    }
                    return image
                })
                
                // return the element with the updated text
                return {
                    ...child,
                    items : newData
                }
            }
            return child
        }))
    })

    return (
        <div className="w-full">
            <div id="menu" className="bg-red-200 flex justify-evenly">
                <input type="image" onDragStart={handleDragStart} value="p" onDrag={handleDrag} draggable="true" src="/svgs/paragraph.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" />
                <input type="image" onDragStart={handleDragStart} value="h2" onDrag={handleDrag} draggable="true" src="/svgs/heading.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" />
                <input type="image" onDragStart={handleDragStart} value="ul" onDrag={handleDrag} draggable="true" src="/svgs/list-ul.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" />
                <input type="image" onDragStart={handleDragStart} value="img" onDrag={handleDrag} draggable="true" src="/svgs/image.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" />
                <input type="image" onDragStart={handleDragStart} value="multi-img" onDrag={handleDrag} draggable="true" src="/svgs/multi-image.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" />
                <input type="image" onDragStart={handleDragStart} value="carousel" onDrag={handleDrag} draggable="true" src="/svgs/arrows-left-right.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" />

                <input type="image" src="/svgs/eye.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100"/>
            </div>
            <div id="canvas"  className="border border-2 border-black w-full h-96 p-6 relative" onDragOver={handleDragOver} onDrop={handleDrop}>
                {
                    children.map(child => 
                        {   
                            if (child.type === 'p') {
                                return (
                                    <p id={child.id} key={child.id} onClick={handleClick} className='relative cursor-pointer'>{child.data}</p>
                                )
                            } else if (child.type === 'h2') {
                                return (
                                    <h2 id={child.id} key={child.id} onClick={handleClick} className='relative cursor-pointer'>{child.data}</h2>
                                )
                            } else if (child.type === 'ul') {
                                return (
                                    <ul id={child.id} key={child.id} className='relative'>
                                        { child.data.map(item => {
                                            return (
                                                <li key={item.id} id={item.id} onClick={handleClick} className='list-disc px-6 cursor-pointer'>{item.item}</li>
                                            )
                                        })}
                                    </ul>
                                )
                            } else if (child.type === 'img') {
                                return (
                                    <div key={child.id}>
                                        <button data-id={child.id} className='bg-[#EFEFEF] rounded border-solid border-2 border-inherit w-6' onClick={deleteImage}>x</button>
                                        <input className='block' id={child.id} type='file' accept="image/png, image/jpeg" onChange={handleImageUpload} />
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
                                                    <div className='flex flex-row'>
                                                        <input type="image" parent-id={child.id} data-id={image.id} src="/svgs/xmark.svg" className='bg-[#EFEFEF] rounded border-solid border-2 border-inherit w-6' onClick={deleteImageFromGroup}/>
                                                    </div>
                                                    <input className='block' parent-id={child.id} id={image.id} type='file' accept="image/png, image/jpeg" onChange={handleGroupImageUpload} />
                                                    <img src={image.src} className='aspect-auto w-48 h-auto m-2'/>
                                                </div>
                                            )
                                        })}
                                        {child.images.length <= 15 ? (
                                            <input type='image' src="/svgs/circle-plus.svg" parent-id={child.id} className='w-6' onClick={addImageToGroup}/>
                                        ) : <></>}
                                    </div>
                                )
                            } else if (child.type === 'carousel') {
                                return (
                                    <div key={child.id}>
                                        <div className="carousel rounded-box h-96">
                                            {child.items.map(item => {
                                                return (
                                                    <div key={item.id} className="carousel-item w-96 bg-red-700 flex flex-col justify-center relative">
                                                        <input className='block' parent-id={child.id} id={item.id} type='file' accept="image/png, image/jpeg" onChange={handleCarouselImageUpload} />
                                                        <img src={item.src} className='aspect-auto'/>
                                                        <textarea parent-id={child.id} elem-id={item.id} value={item.text} className='absolute bottom-0 left-0 resize-none w-full' onChange={updateCarouselText}>{item.text}</textarea>
                                                    </div> 
                                                )
                                            })}
                                        </div>
                                        <input type='image' src="/svgs/circle-plus.svg" parent-id={child.id} className='w-6' onClick={addImageToCarousel}/>
                                    </div>
                                )
                            }
                        }
                    )
                }
                {isEditing && <EditPopUp top={top} type={type} editValue={value} id={id} onDelete={handleDelete} onCancel={onCancel} onSave={handleUpdate} onAddItem={handleNewItem}/>}
            </div>
        </div>
    )
}
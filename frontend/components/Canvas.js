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
    const [type, setType] = useState()
    const [value, setValue] = useState()
    const [id, setID] = useState()

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
        setEditing(true)
        setValue(event.target.innerHTML)
        setID(event.currentTarget.id)
        console.log("id set = " + id)
    })

    const handleDrop = ((event) => {
        event.preventDefault()

        const id = getRandomNumber()
        const type = event.dataTransfer.getData("data")

        if (type === 'p') {
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
        }
    })
    
    const onCancel = ((event) => {
        console.log(event.target)
        console.log(currentEvent.currentTarget)
    })

    const handleUpdate = ((value, id) => {
        setChildren(children.map(child => {
            // get the ids of the current element in the form of 
            // [child id, item id] where child id is the parent element (<p>, <ul>)
            // and item is the child of the parent element (<li>)
            const [childID, itemID] = id.split('-')

            if (childID == child.id) {
                // if child is a <p>, change only the <p>'s content
                if (child.type === 'p') {
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
        }))
    })

    return (
        <div className="w-full">
            <div id="menu" className="bg-red-200">
                <input type="image" id="bold-btn" onDragStart={handleDragStart} value="p" onDrag={handleDrag} draggable="true" src="/svgs/paragraph.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" />
                <input type="image" id="bold-btn" onDragStart={handleDragStart} value="ul" onDrag={handleDrag} draggable="true" src="/svgs/list-ul.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" />
            </div>
            <div id="canvas"  className="border border-2 border-black w-full h-96 p-6 relative" onDragOver={handleDragOver} onDrop={handleDrop}>
                {
                    children.map(child => 
                        {   
                            if (child.type === 'p') {
                                return (
                                    <p id={child.id} key={child.id} onClick={handleClick} className='relative'>{child.data}</p>
                                )
                            } else if (child.type === 'ul') {
                                return (
                                    <ul id={child.id} key={child.id} className='relative'>
                                        { child.data.map(item => {
                                            return (
                                                <li key={item['id']} id={item['id']} onClick={handleClick} className='list-disc px-6'>{item['item']}</li>
                                            )
                                        })}
                                    </ul>
                                )
                            }
                        }
                    )
                }
                {isEditing && <EditPopUp top={top} type={type} editValue={value} id={id} onCancel={onCancel} onSave={handleUpdate}/>}
            </div>
        </div>
    )
}
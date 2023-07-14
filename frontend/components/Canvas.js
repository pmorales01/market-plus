"use client"
import EditPopUp from '/components/EditPopUp'
import { useState } from 'react'
import { ReactDOM } from 'react'

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
                        'item' : 'Click to edit item'
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
        console.log("updaing..." + id)
        console.log("i have " + value)
        setChildren(children.map(child => {
            if (child.id == id) {
                return {
                    ...child,
                    'data' : [
                        ...child.data, 
                        {'item': value}
                    ]
                }
            }
        }))

        console.log(children)
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
                        {if (child.type === 'p') {
                            return (
                                <p id={child.id} key={child.id} onClick={handleClick} className='relative'>{child.data}</p>
                            )
                        } else if (child.type === 'ul') {
                            return (
                                <ul id={child.id} key={child.id} className='relative'>
                                    { child.data.map((key, index) => {
                                        return (
                                            <li key={index} onClick={handleClick} className='list-disc px-6'>{key['item']}</li>
                                        )
                                    })}
                                </ul>
                            )
                        }}
                    )
                }
                {isEditing && <EditPopUp top={top} type={type} editValue={value} id={id} onCancel={onCancel} onSave={handleUpdate}/>}
            </div>
        </div>
    )
}
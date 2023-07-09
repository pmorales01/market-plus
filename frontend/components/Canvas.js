"use client"
import { useState } from 'react'

function getRandomNumber() {
    const x = Math.floor(Math.random() * 100) + 1
    const y = Math.floor(Math.random() * 100) + 1
    return Math.floor(x * y) + 1
}

export default function Canvas ()  {
    const [children, setChildren] = useState({})

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

    const handleDrop = ((event) => {
        event.preventDefault()

        const key = getRandomNumber().toString()
        const type = event.dataTransfer.getData("data")
        console.log(type)
        
        if (type === 'p') {
            setChildren({...children, 
                key : {
                    'type' : type,
                    'data' : 'Click to edit',
                }
            })
        } else if (type === 'ul') {
            setChildren({...children, 
                key : {
                    'type' : type,
                    'data' : {
                        'item' : 'Click to edit'
                    },
                }
            })
        }
        
        const canvas = document.getElementById('canvas')

        for (const child in children) {
            const element = document.createElement(children[child].type)
            if (element.tagName === 'P') {
                element.innerHTML = children[child].data
            } else if (element.tagName === 'UL') {
                for (const item in children[child].data) {
                    const li = document.createElement('li')
                    li.innerHTML = children[child].data.item                 
                    element.appendChild(li)
                }
                element.classList.add('list-disc', 'px-6')
            }
            canvas.appendChild(element)
        }
    })

    return (
        <div className="w-full">
            <div id="menu" className="bg-red-200">
                <input type="image" id="bold-btn" onDragStart={handleDragStart} value="p" onDrag={handleDrag} draggable="true" src="/svgs/paragraph.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" />
                <input type="image" id="bold-btn" onDragStart={handleDragStart} value="ul" onDrag={handleDrag} draggable="true" src="/svgs/list-ul.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" />
            </div>
            <div id="canvas"  className="border border-2 border-black w-full h-96 p-6" onDragOver={handleDragOver} onDrop={handleDrop}>
            </div>
        </div>
    )
}
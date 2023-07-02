"use client"

export default function ImageDisplay({id, image='/svgs/upload.svg', passedFunction}) {
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

    const dragOverHandler = ((event) => {
        event.preventDefault()
    })

    const dropHandler = ((event) => {
        event.preventDefault()
        console.log(event.dataTransfer.files[0]);
        const file = event.dataTransfer.files[0]
        const button = event.currentTarget

        const reader = new FileReader()
        reader.addEventListener("load", (e) => {
            const image = document.createElement('img')
            image.src = e.target.result
            image.classList = 'aspect-square'
            button.replaceChild(image, button.firstChild)
            button.appendChild(image)
        })
        reader.readAsDataURL(file);
    })

    function handleClick() {
        console.log("id = " + id)
        passedFunction(id)
    }

    return (
        <div className="bg-red-200 relative">
            <button className="btn rounded-full w-fit h-fit absolute top-0 left-0" onClick={handleClick}>
                <span className="text-xs">x</span>
            </button>
            <button className='bg-base-200 w-32 h-32 border hover:border-black flex justify-center' onClick={toggle} id="drop-zone" onDrop={dropHandler} onDragOver={dragOverHandler}>
                <img src={image} className="aspect-square" />
            </button>
        </div>
    )
}

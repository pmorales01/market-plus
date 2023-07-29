import NavBar from '/components/NavBar'
import Footer from '/components/Footer'
import Canvas from '/components/Canvas'
import {getRandomNumber} from '../../../components/Canvas'
import Listing from '/components/Listing'
import { useState } from 'react'

export default function create_product() {
    const categories = ['Appliances', 'Arts & Crafts', 'Automotive Accessories', 'Automotive Parts', 'Books', 'Clothing','Electronics', 'Music', 'Trading Cards', 'Video Games']
    const [showSelected, setShowSelected] = useState(false)
    const [charLength, setCharLength] = useState(0)
    const [children, setChildren] = useState([])
    const [previewVisible, setPreviewVisible] = useState(false)
    const [productImages, setProductImages] = useState([])
    const [imageCount, setImageCount] = useState(0)
    const MAX_IMAGE_COUNT = 6 // maximum # of product images

    // tracks which categories the user selected
    const [selected, setSelected] = useState([])

    const showCategories = (() => {  
        const list = document.getElementById('cat-list')

        // unhide list if hidden
        if (list.hasAttribute('hidden')) {
            list.removeAttribute("hidden")
        }
    })

    const handleBlur = (() => {
        // hide the list if user clicks outside of it 
        document.getElementById('cat-list').setAttribute("hidden", "")
    }) 

    const addCategory = ((event) => {
        event.target.setAttribute("disabled", "")
        setSelected([...selected, event.target.textContent])
        setShowSelected(true)
    })

    const removeCategory = ((event) => {
        event.preventDefault()

        // category to remove from selected list 
        const selectedCategory = event.target.textContent

        // unselect the category (remove from user's selected list)
        setSelected(selected.filter((category) => selectedCategory !== category))

        // make the category from the cateogry list clickable again 
        const category = document.getElementById(`cat-${selectedCategory.split(" ").join("")}`)
        category.removeAttribute('disabled')
    })

    const handleSearch = ((event) => {
        const search = event.target.value
        const items = document.getElementById('cat-list').children
        const regex = new RegExp(search, 'i')

        for (let i = 0; i < items.length; ++i) {
            if (regex.test(items[i].textContent)) {
                items[i].style.display = ""
            } else {
                items[i].style.display = "none"
            }
        }
    })

    const handleTextarea = ((event) => {
        setCharLength(event.target.value.length)
    })

    const handlePreview = (event) => {
        event.preventDefault()
        setPreviewVisible(true)
    }

    const closePreview = (event) => {
        event.preventDefault()
        setPreviewVisible(!previewVisible)
    }

    const handleProductImage = (event) => {
        event.preventDefault()

        if (imageCount == MAX_IMAGE_COUNT - 1) {
            document.getElementById('product-image-upload').setAttribute('disabled', 'true')
        }

        // get image
        const file = event.target.files[0];
        const filename = file['name']

        // create an id 
        const id = getRandomNumber()

        // read and load the image
        const reader = new FileReader()
        reader.onload = () => {
            setProductImages([
                ...productImages,
                {
                    id: id,
                    src: reader.result,
                    filename : filename
                }
            ])
        }

        if (file) {
            reader.readAsDataURL(file)
        }

        // increment image count
        setImageCount(imageCount + 1)
    }

    const deleteProductImage = (event) => {
        const id = event.target.id
        
        // delete selected image
        setProductImages(productImages.filter(image => image.id != id))
        
        // if upload button is disabled, enable again
        if (MAX_IMAGE_COUNT == imageCount) {
            document.getElementById('product-image-upload').removeAttribute('disabled')
        }

        // decrement image count
        setImageCount(imageCount - 1)
    }

    const processTextarea = (event) => {
        // find all instances of "* " and replace with bullet point
        event.target.value = event.target.value.replace(/\* /g, '\u2022 ');
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') { // enter key pressed
            event.preventDefault()
            
            const textarea = document.getElementById('product-description')
            
            const value = textarea.value
            console.log(value)
            
            const lines = value.match(/\u2022(?=i)/g);
            // get the most recent line 
            console.log(textarea.selectionStart)
            
            // location of cursor where 'Enter' was pressed 
            const startSelected = textarea.selectionStart

            // split string in half where cursor was 
            const first = value.substring(0, startSelected)
            const second = value.substring(startSelected, value.length)
            
            const array = [...first.split(/(\u2022(?!\n).+)/g)].filter((item) => item.trim() !== '');
            
            console.log(array)
            
            const lastMatch = array.pop()
            
            const regex = /^\u2022.+/g
            if (lastMatch === ' ' || lastMatch === '\n') {
                textarea.value = first + '\n' + second
            } else if (lastMatch === '\u2022 ') {
                textarea.value = first + '\n' + second
            } else if (regex.test(lastMatch)) {
                console.log(lastMatch + " is bad ")
                textarea.value = first + '\n\u2022 ' + second
            } else {
                textarea.value = first + '\n' + second
            }
        }
    }


    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <div className="flex w-10/12 h-fit">
                <form method='post' className="grow form-control max-w-full space-y-2">
                    <h1 className='text-center'>Tell Us About Your Product</h1>
                    <div className='sticky top-0 flex justify-end z-10 mr-2'>
                        <input type="image" src="/svgs/eye.svg" className="w-10 bg-slate-100 ring-offset-2 ring ring-slate-100" onClick={handlePreview}/>
                    </div>
                    <div className="flex flex-col w-1/2 space-y-2">
                        <label htmlFor="product-name">Product Name</label>
                        <input type="text" id="product-name" name="product-name" className="border border-2" required />
                        <label htmlFor="product-brand">Brand</label>
                        <input type="text" id="product-brand" name="product-brand" className='border border-2' required />
                        <label htmlFor='product-description'>Short Product Description</label>
                        <textarea maxLength={1000} id="product-description" onChange={processTextarea} onKeyDown={handleKeyDown} className='p-4'></textarea>
                    </div>
                    
                    <div className='flex flex-col'>
                        <h2 className='my-4'>Upload Product Images</h2>
                        <div className='flex flex-col w-4/5 border-2 self-center items-center space-y-4 p-8 shadow-xl rounded my-8'>
                            <label className='h-8 flex items-center justify-center px-4 border rounded-lg bg-blue-500 text-white w-2/5'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='object-contain h-5 mr-2' fill='white'>
                                    <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                                </svg>
                                <span>Upload Image</span>
                                <input type="file" id="product-image-upload" className="hidden" accept="image/png, image/jpeg"onChange={handleProductImage}/>
                            </label>
                            <p className='text-lg'>{imageCount} Images Selected</p>
                            <div className={`grid grid-rows-${Math.ceil(imageCount / 2)} grid-cols-2 gap-8`}>
                                {productImages.map(image => {
                                    return (
                                        <div key={image.id}>
                                            <img src={image.src}  id={image.id} className="max-w-full h-48" onClick={deleteProductImage}/>
                                            <p className='text-center'>{image.filename}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Category (Select all that Apply)</h2>
                        {showSelected && (
                            <div className='flex flex-row flex-wrap space-x-2 gap-y-2'>
                                {selected.map((category, index) => {
                                    return (
                                        <button key={index} className='btn rounded-full bg-neutral-200 text-zinc-500 capitalize hover:text-white disabled:bg-slate-300' onClick={removeCategory}>{category}</button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <div className='w-48'>
                        <div className='w-fit h-fit flex flex-row items-center'>
                            <input type="text" onClick={showCategories} className="border border-2 h-10 text-xl" onChange={handleSearch}/>
                            <p className="text-4xl bg-slate-300 text-center w-8">&#x2315;</p>
                        </div>
                        {(
                            <ul id="cat-list" onBlur={handleBlur} hidden className='h-40 w-60 overflow-y-auto p-4 bg-stone-50 border-16'> 
                            {categories.map((category, index) => (
                                <li key={index}><button id={`cat-${category.split(" ").join("")}`} onClick={addCategory} className="hover:bg-blue-200 w-full text-left disabled:bg-slate-300">{category}</button></li>
                            ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <h2>Condition</h2>
                        <fieldset id="condition-radio">
                            <input type="radio" id="New" name="condition" value="New"/>
                            <label htmlFor="New"> New</label>
                            <br/>
                            <input type="radio" id="Like-New" name="condition" value="Like New"/>
                            <label htmlFor="Like-New"> Like New</label>
                            <br/>
                            <input type="radio" id="Good" name="condition" value="Good"/>
                            <label htmlFor="Good"> Good</label>
                            <br/>
                            <input type="radio" id="Used" name="condition" value="Used"/>
                            <label htmlFor="Used"> Used</label>
                            <br/>
                            <input type="radio" id="Acceptable" name="condition" value="Acceptable"/>
                            <label htmlFor="Acceptable"> Acceptable</label>
                            <br/>
                            <input type="radio" id="Poor" name="condition" value="Poor"/>
                            <label htmlFor="Poor"> Poor</label>
                        </fieldset>
                        <br/>
                        <label htmlFor="condition-desc">Condition Description</label>
                        <br/>
                        <div className='w-80'>
                            <textarea className="border border-2 w-full" id="condition-desc" name="condition-desc" onChange={handleTextarea} maxLength="50" required></textarea>
                            <p className='text-right'>{charLength}/50 Characters</p>
                        </div>
                        <div>
                            <h2>Description <span className='text-sm'>(Describe your product in more detail)</span></h2>
                            <Canvas children={children} setChildren={setChildren}/>
                        </div>
                    </div>
                    {previewVisible && 
                        <div className="fixed z-50 h-screen w-screen top-0 left-0 overflow-auto" id="popup">
                            <div className="-translate-x-1/2 card w-11/12 bg-base-100 shadow-xl inset-1/2">
                                <div className="card-body">
                                <h2 className="card-title self-center">Preview</h2>
                                <Listing children={children}/>
                                <div className="card-actions justify-center">
                                    <button className="btn btn-primary" onClick={closePreview}>
                                        <span className="capitalize">Close</span>
                                    </button>
                                </div>
                                </div>
                            </div>
                        </div>
                    }
                </form>
            </div>
            <Footer/>
        </div>
    )
}
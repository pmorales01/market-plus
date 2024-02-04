import NavBar from '/components/NavBar'
import Footer from '/components/Footer'
import Alert from '/components/Alert'
import {getRandomNumber} from '../../../components/Canvas'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function create_product() {
    const categories = ['Appliances', 'Arts & Crafts', 'Automotive Accessories', 'Automotive Parts', 'Books', 'Clothing','Electronics', 'Music', 'Trading Cards', 'Video Games']
    const [showSelected, setShowSelected] = useState(false)
    const [charLength, setCharLength] = useState(0)
    const [productImages, setProductImages] = useState([])
    const [imageCount, setImageCount] = useState(0)
    const MAX_IMAGE_COUNT = 6 // maximum # of product images

    // tracks which categories the user selected
    const [selected, setSelected] = useState([])

    // tracks username and authentication
    const [seller, setSeller] = useState({})
    const [authenticated, setAuthenticated] = useState(false)

    const [message, setMessage] = useState([])
    const [visible, setVisible] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const authenticate = async () => {
            try {
                var requestOptions = {
                    method: 'GET',
                    credentials: 'include'
                }; 
                
                // get the seller's name
                const store = window.location.pathname.match(/\/([^/]+)/)[1]

                // fetch user data and check if user is an authenticated seller
                const response = await fetch(`http://127.0.0.1:8000/account/authenticate-seller?store=${store}`, requestOptions)
               
                // if user is not authenticated or access was denied, redirect to login
                if (response.status != 200) {
                    router.push('/')
                    return
                }  

                const json_data = await response.json()

                setSeller({seller : json_data['name']})

                setAuthenticated(true)

            } catch (error) {
                console.log(error)
            }
        }

        authenticate()
    }, [])

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
                    filename : filename,
                    file: file
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

        // Reset file input element
        const fileInput = document.getElementById('product-image-upload');
        fileInput.value = ''; // clear the selected file
    }

    const processTextarea = (event) => {
        // find all instances of "* " and replace with bullet point
        event.target.value = event.target.value.replace(/\* /g, '\u2022 ');
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') { // enter key pressed
            event.preventDefault()
            
            const textarea = document.getElementById('product-description')
            
            // <textarea> text 
            const value = textarea.value
                        
            // location of cursor where 'Enter' was pressed 
            const startSelected = textarea.selectionStart

            // split string in half where cursor was 
            const first = value.substring(0, startSelected)
            const second = value.substring(startSelected, value.length)
            
            // find matches that begins with • and don't have \n
            const matches = [...first.split(/(\u2022(?!\n).+(?!\n))/g)].filter((item) => item.trim() !== '');
            
            // get the last match (its where the cursor is)
            const lastMatch = matches.pop()

            // find matches that begin with "• " and don't have whitespace or \n
            const regex = /^\u2022(?= [^\s\n])/g

            if (lastMatch === ' ' || lastMatch === '\n') { // blank lines
                textarea.value = first + '\n' + second
            } else if (lastMatch === '\u2022 ') { // "• ", exiting the bulleted list
                textarea.value = textarea.value.replace(/\u2022\s$/, '')
            } else if (regex.test(lastMatch)) {
                // create a new bullet point on a new line
                textarea.value = first + '\n\u2022 ' + second
                // set the cursor to the right of the new bullet point
                textarea.setSelectionRange(startSelected + 3, startSelected + 3)
            } else {
                // create a new line 
                textarea.value = first + '\n' + second
                // set the cursor to the begining of the newline
                textarea.setSelectionRange(startSelected + 1, startSelected + 1)
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (productImages.length === 0) {
            setMessage(['No product images uploaded!'])
            setVisible(true)
        } else if (selected.length === 0) {
            setMessage(['No product categories were selected!'])
            setVisible(true)
        } else {
            try {
                const fieldset = document.getElementById('condition-radio')
                
                const data = new FormData()
                data.append('name', document.getElementById('product-name').value)
                data.append('brand', document.getElementById('product-brand').value)
                data.append('price', document.getElementById('price').value)
                data.append('short_desc', document.getElementById('product-description').value)
                data.append('category', selected)
                data.append('condition', fieldset.querySelector('input:checked').value)
                data.append('condition_desc', document.getElementById('condition-desc').value)
                
                productImages.map(image => {
                    data.append('images', image.file)
                })
                
                var requestOptions = {
                    method: 'POST',
                    credentials: 'include', 
                    headers: {
                        'accept': 'application/json',
                    },
                    body: data,
                    redirect: 'follow'
                }

                // make a POST request
                const response = await fetch(`http://127.0.0.1:8000/${seller['seller']}/products/create`, requestOptions)
                
                console.log(response)

                const json_data = await response.json()

                console.log(json_data)
            } catch (error) {
                console.log("Unexpected Error: " + error)
            }
        }
    }

    const updatePopup = () => {
        setVisible(false)
    }

    if (authenticated) {
        return (
        <div className="flex flex-col items-center justify-between w-full sm:max-md:w-fit">
            <NavBar/>
            <section className="form-control w-[400px] xs:max-sm:w-11/12">
                <header className='title tracking-[.1em] my-5'> Tell Us About Your Product</header>
                <form method='post' encType="multipart/form-data" className="grow form-control max-w-full space-y-5" onSubmit={handleSubmit}>
                    {message && visible && <Alert message={message} onClick={updatePopup} />}
                    <div className="flex flex-col">
                        <div className="input-container">
                            <input type="text" id="product-name" name="product-name" className="input input-bordered input-sm w-full max-w-full" placeholder="" required />
                            <label htmlFor="product-name">Product Name</label>
                        </div>
                        <div className="input-container">
                            <input type="text" id="product-brand" name="product-brand" className="input input-bordered input-sm w-full max-w-full" placeholder="" required />
                            <label htmlFor="product-brand">Brand</label>
                        </div>
                        <div className="input-container">
                            <input type="text" id="product-color" name="product-color" className="input input-bordered input-sm w-full max-w-full" placeholder="" />
                            <label htmlFor='product-color'>Color</label>
                        </div>
                        <div className="input-container">
                            <input type="text" id="price" name="price" className='input input-bordered input-sm w-full max-w-full' placeholder="" required/>
                            <label htmlFor="price">Price</label>
                        </div>
                        <label htmlFor='product-description'><span className="text-black">Short Product Description (max 1000 characters)</span></label>
                        <textarea maxLength={1000} id="product-description" onChange={processTextarea} onKeyDown={handleKeyDown} className='resize-none	h-32 border p-2' required></textarea>
                    </div>
                    <div className='flex flex-col'>
                        <h2 className='text-black'>Upload Product Images</h2>
                        <div className='flex flex-col w-full border-2 self-center items-center space-y-4 p-8 shadow-xl rounded my-2'>
                            <label className='h-8 flex items-center justify-center px-4 border rounded-lg bg-blue-500 text-white w-5/6'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='object-contain h-5 mr-2' fill='white'>
                                    <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                                </svg>
                                <span className='text-inherit'>Upload Image</span>
                                <input type="file" id="product-image-upload" className="hidden" accept="image/png, image/jpeg"onChange={handleProductImage}/>
                            </label>
                            <p className='text-lg'>{imageCount} Images Selected</p>
                            <div className={`grid grid-rows-${Math.ceil(imageCount / 2)} grid-cols-1 gap-8`}>
                                {productImages.map(image => {
                                    return (
                                        <div key={image.id} className='flex flex-col justify-center items-center space-y-2'>
                                            <img src={image.src}  id={image.id} className="w-fit h-48" onClick={deleteProductImage}/>
                                            <p className='text-center'>{image.filename}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className='text-black'>Category (Select all that Apply)</h2>
                        {showSelected && (
                            <div className='flex flex-row flex-wrap space-x-2 gap-y-2 mt-5'>
                                {selected.map((category, index) => {
                                    return (
                                        <button key={index} className='btn rounded-full bg-neutral-200 text-zinc-500 capitalize hover:text-white disabled:bg-slate-300 h-8 min-h-8' onClick={removeCategory}>{category}</button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className='h-fit flex flex-row items-center'>
                            <input type="text" onClick={showCategories} className="border border-2 h-10 w-full text-xl" onChange={handleSearch}/>
                            <p className="text-4xl bg-slate-300 text-center w-2/12">&#x2315;</p>
                        </div>
                        {(
                            <ul id="cat-list" onBlur={handleBlur} hidden className='h-40 w-11/12 overflow-y-auto p-4 bg-stone-50 border-16'> 
                            {categories.map((category, index) => (
                                <li key={index}><button id={`cat-${category.split(" ").join("")}`} onClick={addCategory} className="hover:bg-blue-300 w-full text-left text-black disabled:bg-slate-300">{category}</button></li>
                            ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <h2 className='text-black'>Condition</h2>
                        <fieldset id="condition-radio">
                            <input type="radio" id="New" name="condition" value="New" required/>
                            <label htmlFor="New"> New</label>
                            <br/>
                            <input type="radio" id="Like-New" name="condition" value="Like New" required/>
                            <label htmlFor="Like-New"> Like New</label>
                            <br/>
                            <input type="radio" id="Good" name="condition" value="Good" required/>
                            <label htmlFor="Good"> Good</label>
                            <br/>
                            <input type="radio" id="Used" name="condition" value="Used" required/>
                            <label htmlFor="Used"> Used</label>
                            <br/>
                            <input type="radio" id="Acceptable" name="condition" value="Acceptable" required/>
                            <label htmlFor="Acceptable"> Acceptable</label>
                            <br/>
                            <input type="radio" id="Poor" name="condition" value="Poor" required/>
                            <label htmlFor="Poor"> Poor</label>
                        </fieldset>
                        <br/>
                        <label className="text-black" htmlFor="condition-desc">Condition Description</label>
                        <br/>
                        <div className='w-full'>
                            <textarea className="border border-2 w-full" id="condition-desc" name="condition-desc" onChange={handleTextarea} maxLength="50" required></textarea>
                            <p className='text-right'>{charLength}/50 Characters</p>
                        </div>
                    </div>
                    <button className='btn btn-primary'>Create Listing</button>
                </form>
            </section>
            <Footer/>
        </div>
    )}
}
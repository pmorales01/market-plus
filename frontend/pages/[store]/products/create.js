import NavBar from '/components/NavBar'
import Footer from '/components/Footer'
import { useState } from 'react'

export default function create_product() {
    const categories = ['Appliances', 'Arts & Crafts', 'Automotive Accessories', 'Automotive Parts', 'Books', 'Clothing','Electronics', 'Music', 'Trading Cards', 'Video Games']
    const [showSelected, setShowSelected] = useState(false)

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

    const handleClickAway = ((event) => {
        //
    })

    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <div className="flex w-10/12 h-fit">
                <form method='post' className="grow form-control max-w-full space-y-2">
                    <div className="flex flex-row space-x-2">
                        <label htmlFor="item-name">Item Name</label>
                        <input type="text" id="item-name" name="item-name" required />
                    </div>
                    <h2 className="text-xl">Category (Select all that Apply)</h2>
                    {showSelected && (
                        <div className='flex flex-row flex-wrap space-x-2 gap-y-2'>
                            {selected.map((category, index) => {
                                return (
                                    <button key={index} className='btn rounded-full bg-neutral-200 text-zinc-500 capitalize hover:text-white disabled:bg-slate-300' onClick={removeCategory}>{category}</button>
                                )
                            })}
                        </div>
                    )}
                    <div className='w-48'>
                        <div className='w-fit h-fit flex flex-row items-center'>
                            <input type="text" onClick={showCategories} className="border border-2 h-10 text-xl" onChange={handleSearch} onBlur={handleClickAway}/>
                            <p className="text-4xl bg-slate-300 text-center w-8">&#x2315;</p>
                        </div>
                        {(
                            <ul id="cat-list" onBlur={handleBlur} hidden className='h-40 w-max overflow-y-auto p-4'> 
                            {categories.map((category, index) => (
                                <li key={index}><button id={`cat-${category.split(" ").join("")}`} onClick={addCategory} className="hover:bg-blue-200 w-full text-left disabled:bg-slate-300">{category}</button></li>
                            ))}
                            </ul>
                        )}
                    </div>
                </form>
            </div>
            <Footer/>
        </div>
    )
}
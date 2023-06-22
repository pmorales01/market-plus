import NavBar from '/components/NavBar'
import Footer from '/components/Footer'

export default function create_product() {
    const toggle = (e) => {        
        const buttons = document.getElementById('images').children
        // deselect all the buttons
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('border-2', 'border-black', 'border-dashed')
        }

        // select the current button
        if (e.currentTarget.classList.contains('border-dashed')) {
            e.currentTarget.classList.remove('border-2', 'border-black', 'border-dashed')
        } else {
            e.currentTarget.classList.add('border-2', 'border-black', 'border-dashed')
        }
    }

    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <div className='flex flex-row w-11/12 h-fit bg-blue-600'>
                <div className='w-2/3 flex flex-row'>
                    <div id="images" className='flex flex-col items-center w-1/4 bg-green-200 space-y-3'>
                        <button className='bg-base-200 w-32 h-32 border hover:border-black' onClick={toggle}>
                            <figure>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-250 -250 1028 1028" fill='grey'>
                                    <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                                </svg>
                            </figure>
                        </button>
                        <button className='bg-base-200 w-32 h-32 border hover:border-black' onClick={toggle}>
                        </button>
                        <button className='bg-base-200 w-32 h-32 border hover:border-black' onClick={toggle}>
                        </button>
                    </div>
                    <div className='w-3/4 flex justify-center items-center'>
                        <div className='bg-slate-200 w-11/12 h-11/12 border-solid border-black'>
                        </div>
                    </div>
                </div>
                <div className='w-1/3'>
                    <div className="card w-96 bg-base-100 shadow-xl">
                        <figure><img src="/images/lock.svg" alt="Shoes" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">Shoes!</h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
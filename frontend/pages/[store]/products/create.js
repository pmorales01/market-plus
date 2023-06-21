import NavBar from '/components/NavBar'
import Footer from '/components/Footer'

export default function create_product() {
    const toggle = (e) => {
        if (e.target.classList.contains('border-dashed')) {
            e.target.classList.remove('border-black', 'border-dashed')
        } else {
            e.target.classList.add('border', 'border-black', 'border-dashed')
        }
        console.log(e.target)
    }

    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <div className='flex flex-row w-11/12 h-fit bg-blue-600'>
                <div id="photos" className='w-2/3 flex flex-row'>
                    <div className='flex flex-col items-center w-1/4 bg-green-200 space-y-3'>
                        <button className='bg-base-200 w-32 h-32 border hover:border-black' onClick={toggle}>
                        </button>
                        <button className='bg-base-200 w-32 h-32 border hover:border-black' onClick={toggle}>
                        </button>
                    </div>
                    <div className='w-3/4 flex justify-center items-center'>
                        <div className='bg-slate-200 w-11/12 h-11/12 border-solid border-2 border-black'>
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
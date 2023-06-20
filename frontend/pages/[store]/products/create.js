import NavBar from '/components/NavBar'
import Footer from '/components/Footer'

export default function create_product() {
    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <div className='flex flex-row w-11/12 h-fit bg-blue-600'>
                <div className='w-2/3 flex flex-row'>
                    <div className='flex flex-col items-center w-1/4 bg-green-200 space-y-3'>
                        <div className='bg-slate-200 w-36 h-36 border-dashed border-2 border-black'>
                        </div>
                        <div className='bg-slate-200 w-36 h-36'>
                        </div>
                        <div className='bg-slate-200 w-36 h-36'>
                        </div>
                        <div className='bg-slate-200 w-36 h-36'>
                        </div>
                        <div className='bg-slate-200 w-36 h-36'>
                        </div>
                    </div>
                    <div className='w-3/4 flex justify-center items-center'>
                        <div className='bg-slate-200 w-5/6 h-5/6 border-solid border-2 border-black'>
                        </div>
                    </div>
                </div>
                <div className='w-1/3'>
                    <div class="card w-96 bg-base-100 shadow-xl">
                        <figure><img src="/images/lock.svg" alt="Shoes" /></figure>
                        <div class="card-body">
                            <h2 class="card-title">Shoes!</h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div class="card-actions justify-end">
                                <button class="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
import NavBar from '/components/NavBar'
import Footer from '/components/Footer'

export default function create_product() {
    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <div className='flex flex-row bg-blue-300 w-11/12'>
                <div className='w-2/3 flex flex-row'>
                    <div className='w-1/4'>
                        <img src='/images/lock.svg' className='object-fit' />
                    </div>
                    <div className='w-3/4'>
                        <img src='/images/logo.png' className='object-fit' />
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
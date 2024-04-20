"use client"
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react'
import 'tailwindcss/tailwind.css';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';


export default function NavBar() {
  const [authenticated, setAuthenticated] = useState(false)
  const [category, setCategory] = useState('All')

  useEffect(() => {

    const validate = async () => {
      try {
        var requestOptions = {
            method: 'GET',
            credentials: 'include'
        }; 
        
        // validate jwt
        const response = await fetch("http://127.0.0.1:8000/validate-token", requestOptions)
                   
        // if user is not authenticated (or expired), redirect to login
        if (response.status == 200) {
          setAuthenticated(true)
        }
      } catch (error) {
          console.log(error)
      }``
    }
    validate()
  }, [])

  const navigation = [
    { name: 'Featured', href: '/', current: false },
    { name: 'Nonfiction', href: '/', current: false },
    { name: 'Fiction', href: '/', current: false },
    { name: 'Kids', href: '/', current: false },
    { name: 'Young Adult', href: '/', current: false },
    ...(authenticated ? [{ name: 'Sign Out', href: '/signout', current: false}] :
    [{ name: 'Login', href: '/login', current: false}])
  ]

  return (
    <>
      <div id='banner' className=' carousel w-full h-[40px] bg-[rgb(248,248,248)]'>
        <Swiper
          cssMode={true}
          autoplay={{ delay: 5000 }}
          loop={true}
          scrollbar={true}
          className="mySwiper"
          >
          <SwiperSlide className="flex justify-center items-center banner-font"><Link href='/signup'>Get up to 50% off your first purchase!</Link></SwiperSlide>
          <SwiperSlide className="flex justify-center items-center banner-font">Free Shipping on Orders over $25</SwiperSlide>
          <SwiperSlide className="flex justify-center items-center banner-font">Nonfiction books 50% Off today only!</SwiperSlide>
          <SwiperSlide className="flex justify-center items-center banner-font">Access Exclusive Offers and Rewards</SwiperSlide>
        </Swiper>
      </div>
      <div className='flex flex-row h-[40px]'>
        <Link href='/'>
          <img
            className="h-[40px] xs:max-sm:hidden"
            src="/images/logo.png"
            alt="Your Company"
          />
        </Link>
        <div id='search-bar' className='flex flex-row border-[1px] h-[40px] border-black w-3/5 xs:max-sm:w-11/12'>
          <div id='search-btn' className='self-center px-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </div>
          <input  id='search-input' className='w-full xs:max-sm:w-4/5 text-[#283d44] px-2'/>
          <div id='category-dropdown' className='border-[1px] min-w-fit'>
            <button className='text-[#283d44] bg-[#ddd] p-2 h-full'>{category} <span className='text-[10px]'>&#x25BC;</span></button>
          </div>
        </div>
        <button>Search</button>
        <div id='cart' className='1/5'>

        </div>
      </div>
      <nav>
        <ul className='flex flex-row justify-evenly'>
          {navigation.map((item, index) => (
            <li key={index}>
              <Link href={item.href}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}


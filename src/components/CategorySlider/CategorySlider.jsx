import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function CategorySlider() {

  let [category, setCategory] = useState([])

  async function getCategory() {
    await axios.get('https://ecommerce.routemisr.com/api/v1/categories')
      .then((response) => {
        setCategory(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => { console.log('error', error); });
  }

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="container-fluid my-4">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={10}
        slidesPerView={3}
        autoplay={{ delay: 2000 }}
        loop={true}
      >
    {
      category.map((item)=>{
        return <SwiperSlide>
          <img src={item.image} alt="" className='w-100' style={{ height: '150px', objectFit: 'cover' }} />
          <p className='text-center mt-2'>{item.name}</p>
        </SwiperSlide>
      })
    }
      </Swiper>
    </div>

  )
}

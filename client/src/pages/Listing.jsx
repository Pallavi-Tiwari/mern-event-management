import {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [eventListing, setEventListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();
    const {currentUser} = useSelector((state) => state.user);

    useEffect(()=> {
        const fetchEventListing = async () => {
            try{
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if(data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setEventListing(data);
                setLoading(false);
                setError(false);
            } catch(error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchEventListing();
    }, [params.listingId]);
 return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {eventListing && !loading && !error && (
        <div>
            <Swiper navigation>{eventListing.imageUrls.map((url)=> (
                <SwiperSlide key={url}>
                    <div
                    className='h-[550px]'
                    style={{
                        background: `url(${url}) center no-repeat`,
                        backgroundSize: 'cover',
                    }}
                    ></div>
              </SwiperSlide>
            ))}
            </Swiper>
        </div>
      )}
    </main>
    )
}

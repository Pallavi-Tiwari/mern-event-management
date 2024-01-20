import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [socialListings, setSocialListings] = useState([]);
  const [privateListings, setPrivateListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(()=> {
    const fetchOfferListings = async()=> {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchPrivateListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchPrivateListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=private&limit=4');
        const data = await res.json();
        setPrivateListings(data);
        fetchSocialListings();
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchSocialListings  = async () => {
      try {
        const res = await fetch('/api/listing/get?type=social&limit=4');
        const data = await res.json();
        setSocialListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, [])

  

  return (
    <div>
      {/* Top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          event with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          WePlan is the best place to find your next perfect event for some quality time.
          <br />
          We have a wide range of events for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>
      {/* Slider */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listings */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {privateListings && privateListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent private events</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=private'}>Show more private events</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {privateListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {socialListings && socialListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent social events</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=social'}>Show more social events</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {socialListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

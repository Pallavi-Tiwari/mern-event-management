import {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import Contact from '../components/Contact';
import 'swiper/css/bundle';
import {
    FaChair,
    FaChild,
    FaClock,
    FaHourglassEnd,
    FaMapMarkerAlt,
    FaMoneyBill,
    FaParking,
    FaShare,
  } from 'react-icons/fa';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [eventListing, setEventListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const [count, setCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
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

    const handleChange = (e) => {console.log(typeof(count),count);
        setCount(parseInt(e.target.value));
        setTotalPrice(parseInt(e.target.value) * eventListing.regularPrice);
    }
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
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                <FaShare
                className='text-slate-500'
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                    setCopied(false);
                    }, 2000);
                }}
                />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>  
            <div className='flex flex-row item-center flex-wrap'>
                <p className='text-2xl font-semibold'>
                    {eventListing.name}
                </p>
            </div>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {eventListing.location}
            </p>
            <div className='flex gap-4'>
                <p className='bg-blue-900 w-full max-w-[200px] h-10 text-white text-center p-1 rounded-md'>
                    {eventListing.type === 'private' ? 'Private Event' : 'Social Event'}
                </p>
                <p className='text-2xl font-semibold bg-blue-900 w-full max-w-[150px] h-10 text-white text-center p-1 rounded-md'>
                    ${''}
                    {eventListing.offer
                        ? eventListing.discountPrice.toLocaleString('en-US')
                        : eventListing.regularPrice.toLocaleString('en-US')}
                    {eventListing.type === 'private' && ' /ticket'}
                </p>
                {eventListing.offer && (
                    <p className='text-2xl font-semibold bg-blue-900 w-full max-w-[150px] h-10 text-white text-center p-1 rounded-md'>
                        ${+eventListing.regularPrice - +eventListing.discountPrice} <span className='text-sm'>{'OFF'}</span> 
                    </p>
                )}  
            </div>
                {/* {(count===0) || (count<6) ? 
                    ( <div className='flex gap-4 h-10 text-white text-xl p-1'>
                        <input className='bg-blue-900 w-full max-w-[150px] text-center  rounded-md' 
                        type='number' min={0} max={6} value={count}
                        onChange={handleChange} placeholder='Quantity' required />
                        <p className='bg-green-900 w-full max-w-[250px] text-center  rounded-md' >Total price: $ {totalPrice}</p>
                    </div>)
                        :
                    (<div className='flex gap-4 h-10 text-white text-xl p-1 rounded-md'>
                        <input className='bg-blue-900 w-full max-w-[150px] text-center rounded-md' 
                        type='number' min={0} max={5} value={count}
                        onChange={handleChange} placeholder='Quantity' required />
                        <p className='bg-green-900 w-full max-w-[250px] text-center rounded-md' >Total price: $ {totalPrice}</p>
                        <span className='text-red-900 text-center p-1'>You can buy 5 tickets max.</span>
                    </div>)
                } */}
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {eventListing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaClock className='text-lg' />
                {eventListing.startsAt}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaHourglassEnd className='text-lg' />
                {eventListing.duration > 1
                  ? `${eventListing.duration} mins `
                  : `${eventListing.duration} min `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair  className='text-lg' />
                {eventListing.seats}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {eventListing.parking ? 'Parking' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaMoneyBill className='text-lg' />
                {eventListing.offer ? 'Offer Available' : 'No Offers Available'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChild className='text-lg'/>
                {`Below ${eventListing.ageAllowed} years not allowed`}
              </li>
            </ul>
            {currentUser && eventListing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact WePlan Agent
              </button>
            )}
            {contact && <Contact eventListing={eventListing} />}
          </div>
        </div>
      )}
    </main>
    )
}

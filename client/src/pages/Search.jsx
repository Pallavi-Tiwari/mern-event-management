import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [sidebardata, setSidebardata] = useState({
      searchTerm: '',
      type: 'all',
      parking: false,
      offer: false,
      ageAllowed: false,
      sort: 'created_at',
      order: 'desc',
    });
    
    useEffect( () => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const ageAllowedFromUrl = urlParams.get('ageAllowed');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            ageAllowedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
          ) {
            setSidebardata({
              searchTerm: searchTermFromUrl || '',
              type: typeFromUrl || 'all',
              parking: parkingFromUrl === 'true' ? true : false,
              ageAllowed: ageAllowedFromUrl === 'true' ? true : false,
              offer: offerFromUrl === 'true' ? true : false,
              sort: sortFromUrl || 'created_at',
              order: orderFromUrl || 'desc',
            });
    }

    const fetchListings = async () =>{
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length > 8) {
            setShowMore(true);
        } else {
            setShowMore(false);
        }
        setListings(data);
        setLoading(false); 
    };
        fetchListings();
}, [location.search]);

    const handleChange = (e) => {
        if(e.target.id ==='all'|| e.target.id ==='social'|| e.target.id ==='private' ) {
            setSidebardata({...sidebardata, type:e.target.id});
        }
        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value });
          }
      
        if ( e.target.id === 'parking' || e.target.id === 'offer'|| e.target.id === 'ageAllowed' ) {
            setSidebardata({
                ...sidebardata,
                [e.target.id]:
                e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebardata({ ...sidebardata, sort, order });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('ageAllowed', sidebardata.ageAllowed);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        console.log(searchQuery)
        navigate(`/search?${searchQuery}`);
    }
    const onShowMore = async () => {
        const noOfListings = listings.length;
        const startIndex = noOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input 
                        type='text' 
                        id='searchTerm' placeholder='Search...' 
                        value={sidebardata.searchTerm}
                        onChange={handleChange}
                        className='border rounded-lg p-3 w-full' />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='all'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.type === 'all'} />
                        <span>Social & Private</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='private'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.type === 'private'}
                        />
                        <span>Private</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='social'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.type === 'social'}
                        />
                        <span>Social</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='offer'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.offer}
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>More Filters:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='parking'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.parking} />
                        <span>Parking Lot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='ageAllowed'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.ageAllowed}
                        />
                        <span>Age Restrictions</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select
                        onChange={handleChange}
                        defaultValue={'created_at_desc'} 
                        id='sort_order'
                        className='border rounded-lg p-3'
                    >
                        <option value='regularPrice_desc'>Price - high to low</option>
                        <option value='regularPrice_asc'>Price - low to high</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                    Search
                </button>
            </form>
        </div>
        <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Event Listing Results:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {!loading && listings.length === 0 && (
                    <p className='text-xl text-slate-700'>No listing found!</p>
                )}
                {loading && (
                    <p className='text-xl text-slate-700 text-center w-full'>
                    Loading...
                    </p>
                )}

                {!loading &&
                    listings &&
                    listings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                ))}

                {showMore && (
                    <button
                        onClick={onShowMore}
                        className='text-green-700 hover:underline p-7 text-center w-full'
                    >
                        Show more
                    </button>
                )}
            </div>
        </div>
    </div>
  );
}

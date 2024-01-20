import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      sort: 'created_at',
      order: 'desc',
    });

    const handleChange = (e) => {

    }
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    const onShowMore = async () => {
        const noOfListings = listings.length;
    }
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input type='text' id='searchTerm' placeholder='Search...' className='border rounded-lg p-3 w-full' />
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
                            checked={sidebardata.type === 'all'} />
                        <span>Parking Lot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='ageAllowed'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.type === 'ageAllowed'}
                        />
                        <span>Age Restrictions</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select id='sort_order'>
                        <option>Price - high to low</option>
                        <option>Price - low to high</option>
                        <option>Latest</option>
                        <option>Oldest</option>
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

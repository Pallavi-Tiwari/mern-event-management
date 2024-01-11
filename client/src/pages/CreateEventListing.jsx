import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateEventListing() {
    const { currentUser } = useSelector((state) => state.user);
    const [files, setFiles] = useState([]);
    console.log(files);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startsAt:'',
        duration: 1,
        location: '',
        type: 'social',
        regularPrice: 5,
        discountPrice: 0,
        ageAllowed: 0,
        seats: 1,
        parking: false,
        offer: false,
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loadingEffect, setLoadingEffect] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    console.log(formData);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData ({
                        ...formData, imageUrls: formData.imageUrls.concat(urls),
                    })
                    //formData.imageUrls.push(...urls),
                    console.log('imageUrls', formData.imageUrls);
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    console.log(err)
                    setImageUploadError('Image upload failed (2 mb max per image)');
                    setUploading(false);
                });
        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };


    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'social' || e.target.id === 'private') {
            setFormData({
              ...formData,
              type: e.target.id,
            });
        }

        if (e.target.id === 'parking' || e.target.id === 'offer') {
            setFormData({
                ...formData, [e.target.id]: e.target.checked
            })
        }

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
           setFormData({ 
            ...formData,
            [e.target.id]: e.target.value,
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) return setError('You must upload at least one event related image');
            if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');
            setLoadingEffect(true);
            setError(false);
            const res = await fetch('/api/listing/create',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    useRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoadingEffect(false);
            if(data.success === false){
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch(error) {
            setLoadingEffect(error.message);
            setError(false);
        }

    }
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create an Event Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' placeholder='Event Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required onChange={handleChange} value={formData.value} />
                    <textarea type='text' placeholder='Event Description' className='border p-3 rounded-lg' id='description' required onChange={handleChange} value={formData.value}/>
                    <input type='text' placeholder='Location' className='border p-3 rounded-lg' id='location' required onChange={handleChange} value={formData.value} />
                    <input type='text' placeholder='Starts At' className='border p-3 rounded-lg' id='startsAt' required onChange={handleChange} value={formData.value} />
                    <div className='flex gap-16 flex-wrap'>
                        <div className='flex gap-3'>
                            <input type='checkbox' id='social' className='w-5'  onChange={handleChange} value={formData.value} checked={formData.type === 'social'}/>
                            <span>Social</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='private' className='w-5' onChange={handleChange} value={formData.value} checked={formData.type === 'private'} />
                            <span>Private</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type='checkbox' id='parking' className='w-5' onChange={handleChange} value={formData.value} checked={formData.parking} />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type='checkbox' id='offer' className='w-5' onChange={handleChange} value={formData.value} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-4'>
                            <input type='number' id='duration' min='1' max='720' required onChange={handleChange} value={formData.value} checked={formData.duration} />  
                            <div className='flex flex-col items-center'>
                                <p>Duration</p>
                                <span className='text-xs'>(in mins)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <input type='number' id='ageAllowed' min='0' max='90' required onChange={handleChange} value={formData.value} checked={formData.ageAllowed} />
                            <div className='flex flex-col items-center'>
                                <p>Age Allowed Above</p>
                                <span className='text-xs'>(in years)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <input type='number' id='seat' min='1' max='2000' required onChange={handleChange} value={formData.value} checked={formData.seat} />
                            <p>Seats</p>
                        </div>
                        <div className='flex items-center gap-4'>
                            <input type='number' id='regularPrice' min='5' max='2000' required onChange={handleChange} value={formData.value} checked={formData.regularPrice} />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>($ / ticket)</span>
                            </div>
                        </div>
                        {formData.offer && (
                        <div className='flex items-center gap-4'>
                            <input type='number' id='discountPrice' min='0' max='50' required onChange={handleChange} value={formData.value} checked={formData.discountPrice} />
                            <div className='flex flex-col items-center'>
                                <p>Discounted price</p>
                                <span className='text-xs'>($ / ticket)</span>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} type='file' id='images' className='p-3 border border-gray-300 rounded w-full' accept='image/*' multiple />
                        <button disabled={uploading} onClick={handleImageSubmit} type='button' className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading': 'Upload'}</button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url, index) => (
                            <div key={url} className='flex justify-between p-3 border items-center' >
                                <img src={url} alt='listing image' className='w-20 h-20 object-cover rounded-lg' />
                                <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' >
                                    Delete
                                </button>
                            </div>
                        ))}

                    <button disabled={loadingEffect||uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loadingEffect ? 'Creating Event Listing...' : 'Create Event Listing'}</button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </main>
    )
}

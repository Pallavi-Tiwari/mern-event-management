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
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        seats: 0,
        regularPrice: 0,
        discountPrice: 0,
        offer: false,
        parking: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

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
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

        } catch(error) {
            
        }

    }
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create an Event Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' placeholder='Event Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required onChange={handleChange} value={formData.value} />
                    <textarea type='text' placeholder='Event Description' className='border p-3 rounded-lg' id='description' required  onChange={handleChange} value={formData.value}/>
                    <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' className='w-5'  onChange={handleChange} value={formData.value}/>
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='advertise' className='w-5' onChange={handleChange} value={formData.value} />
                            <span>Seats</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5' onChange={handleChange} value={formData.value} />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' onChange={handleChange} value={formData.value} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='seat' max='50' required onChange={handleChange} value={formData.value} />
                            <p>Seats</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='regularPrice' max='5' required onChange={handleChange} value={formData.value} />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>($ / ticket)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='discountPrice' max='5' required onChange={handleChange} value={formData.value} />
                            <div className='flex flex-col items-center'>
                                <p>Discounted price</p>
                                <span className='text-xs'>($ / ticket)</span>
                            </div>
                        </div>
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

                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Event Listing</button>
                </div>
            </form>
        </main>
    )
}

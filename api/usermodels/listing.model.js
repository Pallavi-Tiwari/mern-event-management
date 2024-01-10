import mongoose from "mongoose";

const listingSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        regularPrice: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            required: true,
        },
        seats: {
            type: Number,
            required: true,
        },
        parking: {
            type: Boolean,
            required: true,
        },
        offer: {
            type: Boolean,
            required: true,
        },
        imageUrls: {
            type: Array,
            required: true,
        },
        useRef: {
            type: String,
            required: true,
        },
    }, {timestamps: true}
)
const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
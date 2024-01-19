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
        type: {
          type: String,
          required: true,
        },
        startsAt: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        location: {
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
        ageAllowed: {
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
import Listing from "../usermodels/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try{
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch(error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        return next(errorHandler(404, 'This event listing not found!'))
    }
    if(req.user.id !== listing.useRef) {
        return next(errorHandler(401, 'You can only delete listing created by this account'));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!'); 
    } catch(error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }
    if(req.user.id !== listing.useRef){
        return next(errorHandler(401, 'You can only update your own listings!'));
    }

    try {
        const updatedEventListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        );
        res.status(200).json(updatedEventListing);
    } catch(error) {
        next(error);
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing) {
            return next(errorHandler(404, 'Event Listing not found!'));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

export const getAllListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit)||9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if(offer === undefined || offer==='false'){
            offer = {$in: [false, true]};
        }

        // let startsAt = req.query.startsAt;
        // if(startsAt === undefined || startsAt==='false'){
        //     startsAt = {$in: [false, true]};
        // }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
        }

        // let duration = req.query.duration;
        // if(duration === undefined || duration==='false'){
        //     duration = {$in: [false, true]};
        // }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
        type = { $in: ['social', 'private', null] };
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';
        const searchConfig = {
            name: {$regex: searchTerm, $options: 'i'},
            offer,
            parking,
            type,
        }
        console.log('search config', searchConfig);
        const listings = await Listing.find(searchConfig).sort(
            {[sort]: order}
        ).limit(limit).skip(startIndex);

        console.log('search result', listings);

        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
}
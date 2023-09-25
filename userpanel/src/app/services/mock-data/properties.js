import {ASSET_IMAGES} from "../../utils/constants/paths";
import {getAssetPath} from "../../utils/appHelpers";

export const propertyTabCategories = [
    {id: 1, name: 'All', slug: 'all'},
    {id: 2, name: 'New Jersey', slug: 'new_jersey'},
    {id: 3, name: 'Colorado', slug: 'colorado'},
    {id: 4, name: 'Albama', slug: 'albama'},
];

export const properties = [
    {
        id: 1,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-1.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-2.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-3.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'Luxury family home at beach side',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 26, 2020',
        availability: 'sale',
        isTrending: true,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'new_jersey',
    },
    {
        id: 2,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-4.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-5.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-6.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'Sunset view Apartment in Colarado',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 25, 2020',
        availability: 'rent',
        isTrending: false,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'colorado',
    },
    {
        id: 3,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-7.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-3.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-5.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'Best property in Albama',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 23, 2020',
        availability: 'rent',
        isTrending: false,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'albama',
    },
    {
        id: 4,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-1.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-2.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-3.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'Best house deal in New jersey',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 24, 2020',
        availability: 'sale',
        isTrending: false,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'new_jersey',
    },
    {
        id: 5,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-4.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-5.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-6.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'Luxury apartment in Colarado',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 28, 2020',
        availability: 'rent',
        isTrending: true,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'colorado',
    },
    {
        id: 6,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-7.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-8.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-3.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'Plot in Albama',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 29, 2020',
        availability: 'sale',
        isTrending: true,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'albama',
    },
    {
        id: 7,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-1.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-2.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-3.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'House in New jersey',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 24, 2020',
        availability: 'sale',
        isTrending: false,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'new_jersey',
    },
    {
        id: 8,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-4.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-5.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-6.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'Flat in Colarado',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 20, 2020',
        availability: 'rent',
        isTrending: true,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'colorado',
    },
    {
        id: 9,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-7.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-8.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-5.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: '3 BHK house in Albama',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 28, 2020',
        availability: 'sale',
        isTrending: false,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'albama',
    },
    {
        id: 10,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-5.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-4.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/property-2.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'Best house for family in New Jersey',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 26, 2020',
        availability: 'rent',
        isTrending: true,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'new_jersey',
    },
    {
        id: 11,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-3.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-7.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/living-room-5.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'Villa in Colarado',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 16, 2020',
        availability: 'rent',
        isTrending: true,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'colorado',
    },
    {
        id: 12,
        images: [
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-8.jpeg`,`368x256`),
                title: 'image 1',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-5.jpeg`,`368x256`),
                title: 'image 2',
            },
            {
                image: getAssetPath(`${ASSET_IMAGES}/properties/bedroom-3.jpeg`,`368x256`),
                title: 'image 3',
            },
        ],
        title: 'Sunrise view apartment in Albama',
        address: '2972, Washington Road, New Jersey',
        bedrooms: 3,
        bathrooms: 3,
        area: '1400 m2',
        owner: {id: 1, name: 'John Nash'},
        publishedDate: 'June 28, 2020',
        availability: 'sale',
        isTrending: false,
        price: '$670,500',
        pricePerSqFt: '$587/sqft',
        category: 'albama',
    },
];

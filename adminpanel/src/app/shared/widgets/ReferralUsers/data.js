import {ASSET_AVATARS} from "../../../utils/constants/paths";
import {getAssetPath} from "../../../utils/appHelpers";

export const popularAuthors = [
    {
        id: 1,
        name: 'Haylie',
        profile_pic: getAssetPath(`${ASSET_AVATARS}/avatar5.jpg`,"52x52"),
        readers: 'Haylie Dorwar',
        articles: '2023-15-04',
    },
    {
        id: 2,
        name: 'Rayna',
        profile_pic: getAssetPath(`${ASSET_AVATARS}/avatar3.jpg`,"52x52"),
        readers: 'Rayna Schleifer',
        articles: '2023-15-04',
    },
    {
        id: 3,
        name: 'Cristofer',
        profile_pic: getAssetPath(`${ASSET_AVATARS}/avatar7.jpg`,"52x52"),
        readers: 'Cristofer Herwitz',
        articles: '2023-15-04',
    },
    {
        id: 4,
        name: 'Jenny',
        profile_pic: getAssetPath(`${ASSET_AVATARS}/avatar9.jpg`,"52x52"),
        readers: 'Jenny Lee',
        articles: '2023-15-04',
    },
    {
        id: 5,
        name: 'Jemas',
        profile_pic: getAssetPath(`${ASSET_AVATARS}/avatar11.jpg`,"52x52"),
        readers: 'Jemas Dorwart',
        articles: '2023-15-04',
    },
    {
        id: 6,
        name: 'Rayna',
        profile_pic: getAssetPath(`${ASSET_AVATARS}/avatar13.jpg`,"52x52"),
        readers: 'Rayna Schleifer',
        articles: '2023-15-04',
    },
];

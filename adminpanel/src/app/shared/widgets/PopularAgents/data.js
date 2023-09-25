import {ASSET_AVATARS} from "../../../utils/constants/paths";
import {getAssetPath} from "../../../utils/appHelpers";
export const agents = [
    {
        id: 1,
        avatar: getAssetPath(`${ASSET_AVATARS}/avatar10.jpg`, `60x60`),
        title: "Albert Hall",
        rating: "Referrals: 3",
        desc: "Deposit: $399"
    },
    {
        id: 2,
        avatar: getAssetPath(`${ASSET_AVATARS}/avatar6.jpg`, `60x60`),
        title: "John Hall",
        rating: "Referrals: 4",
        desc: "Deposit: $299"
    },
    {
        id: 3,
        avatar: getAssetPath(`${ASSET_AVATARS}/avatar3.jpg`, `60x60`),
        title: "Jackson Hall",
        rating: "Referrals: 1",
        desc: "Deposit: $0"
    },
    {
        id: 4,
        avatar: getAssetPath(`${ASSET_AVATARS}/avatar7.jpg`, `60x60`),
        title: "Jonty Hall",
        rating: "Referrals: 0",
        desc: "Deposit: $100"
    }
];

import React from 'react';
import Header from "./Header";
import JumboContentLayout from "@jumbo/components/JumboContentLayout";
import useJumboTheme from "@jumbo/hooks/useJumboTheme";
import {alpha} from "@mui/material/styles";
import ProfileForm from "./components/ProfileForm";
import UserProfileSidebar from "./UserProfileSidebar";
import {ASSET_IMAGES} from "../../../utils/constants/paths";
import {getAssetPath} from "../../../utils/appHelpers";

const useProfileLayout = () => {
    const {theme} = useJumboTheme();
    return React.useMemo(() => ({
        header: {
            sx: {
                mt: -4,
                    mb: -7.25,
                    mx: {xs: -4, lg: -6},
                p: {xs: theme.spacing(6, 4, 11), lg: theme.spacing(6, 6, 11)},
                background: `#002447 url(${getAssetPath(`${ASSET_IMAGES}/profile-bg.jpg`,"1920x580")}) no-repeat center`,
                    backgroundSize: 'cover',
                    color: 'common.white',
                    position: 'relative',

                    '&::after': {
                    display: 'inline-block',
                        position: 'absolute',
                        content: `''`,
                        inset: 0,
                        backgroundColor: alpha(theme.palette.common.black, .65)
                }
            }
        },
        sidebar: {
            sx: {
                mr: 3.75,
                    width: {xs: '100%', lg: '33%'},
                [theme.breakpoints.down('lg')]: {
                    minHeight: 0,
                        mr: 0,
                        order: 2
                }
            }
        },
        wrapper: {
            sx: {
                [theme.breakpoints.down('lg')]: {
                    flexDirection: 'column'
                }
            }
        },
        main: {
            sx: {
                [theme.breakpoints.down('lg')]: {
                    minHeight: 0
                }
            }
        }
    }), [theme])
}

const UserProfile = () => {
    const profileLayout = useProfileLayout()


    return (
            <JumboContentLayout
                header={<Header/>}
                sidebar={<UserProfileSidebar/>}
                layoutOptions={profileLayout}
            >
                    <ProfileForm />

            </JumboContentLayout>

    );
};

export default UserProfile;

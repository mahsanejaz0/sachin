import React, { useContext } from 'react';
import Stack from "@mui/material/Stack";
import useJumboLayoutSidebar from "@jumbo/hooks/useJumboLayoutSidebar";
import AuthUserDropdown from "../../../../shared/widgets/AuthUserDropdown";
import NotificationsDropdown from "../../../../shared/NotificationsDropdown";
import MessagesDropdown from "../../../../shared/MessagesDropdown";
import {IconButton, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Logo from "../../../../shared/Logo";
import {SIDEBAR_STYLES, SIDEBAR_VARIANTS} from "@jumbo/utils/constants";
import useJumboHeaderTheme from "@jumbo/hooks/useJumboHeaderTheme";
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';

const Header = () => {
    const {sidebarOptions, setSidebarOptions} = useJumboLayoutSidebar();
    const {headerTheme} = useJumboHeaderTheme();
    const {loginUserData} = useContext(CustomProvider);
    let userData = loginUserData

    return (
        <React.Fragment>
            {
                (
                    sidebarOptions.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER
                    || sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY
                    || (sidebarOptions.variant === SIDEBAR_VARIANTS.PERSISTENT && !sidebarOptions.open)
                ) &&
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{
                            ml: sidebarOptions.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER ? -2 : 0,
                            mr: 3,
                        }}
                        onClick={() => setSidebarOptions({open: !sidebarOptions.open})}
                    >
                        {
                            sidebarOptions?.open ? <MenuOpenIcon/> : <MenuIcon/>
                        }
                    </IconButton>
            }
            {
                sidebarOptions?.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER &&
                <Logo sx={{mr: 3}} mode={headerTheme.type ?? "light"}/>
            }
           
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ml: "auto"}}>

                {/* <p>Your Referrer: <b>{userData.sponsornuserame}</b></p> */}
                {/* <MessagesDropdown/> */}
                {/* <NotificationsDropdown/> */}
                <AuthUserDropdown/>
            </Stack>
        </React.Fragment>
    );
};


export default Header;

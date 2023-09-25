import React from 'react';
import Avatar from "@mui/material/Avatar";
import {authUser} from "./fake-db";
import {ListItemIcon, ListItemText, ThemeProvider, Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from "react-router-dom";
import JumboDdPopover from "@jumbo/components/JumboDdPopover";
import Div from "@jumbo/shared/Div";
import useJumboTheme from "@jumbo/hooks/useJumboTheme";
import useJumboAuth from "@jumbo/hooks/useJumboAuth";
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';

const AuthUserDropdown = () => {
    const navigate = useNavigate();
    const {theme} = useJumboTheme();
    const {setAuthToken} = useJumboAuth();
    const {loginUserData} = useContext(CustomProvider);
    let userData = loginUserData
    const onLogout = () => {
        localStorage.setItem('token', null)
        setAuthToken(false);
        navigate("/login")
    };
    const onProfile = () => {
        navigate("/profile")
    };

    return (
        <ThemeProvider theme={theme}>
            <JumboDdPopover
                triggerButton={
                    <Avatar
                        src={userData?.profilepictureurl}
                        sizes={"small"}
                        sx={{boxShadow: 25, cursor: 'pointer'}}
                    />
                }
            >
                <Div sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    p: theme => theme.spacing(2.5),
                }}>
                    <Avatar src={userData?.profilepictureurl} alt={userData?.firstname} sx={{width: 60, height: 60, mb: 2}}/>
                    <Typography variant={"h5"}>{userData?.firstname}</Typography>
                    <Typography variant={"body1"} color="text.secondary">{userData?.email}</Typography>
                </Div>
                <Divider/>
                <nav>
                    <List disablePadding sx={{pb: 1}}>

                        <ListItemButton onClick={onProfile}>
                            <ListItemIcon sx={{minWidth: 36}}>
                                <EditOutlinedIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Profile" sx={{my: 0}}/>
                        </ListItemButton>

                        <ListItemButton onClick={onLogout}>
                            <ListItemIcon sx={{minWidth: 36}}>
                                <LogoutIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Logout" sx={{my: 0}}/>
                        </ListItemButton>
                    </List>
                </nav>
            </JumboDdPopover>
        </ThemeProvider>
    );
};

export default AuthUserDropdown;

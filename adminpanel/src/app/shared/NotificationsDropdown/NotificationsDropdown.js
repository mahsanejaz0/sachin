import React from 'react';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import NotificationBirthday from "./NotificationBirthday";
import NotificationInvitation from "./NotificationInvitation";
import NotificationSharedPost from "./NotificationSharedPost";
import NotificationPost from "./NotificationPost";
import {notifications} from "./fake-data";
import List from "@mui/material/List";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Divider from "@mui/material/Divider";
import JumboIconButton from "@jumbo/components/JumboIconButton";
import JumboDdPopover from "@jumbo/components/JumboDdPopover";
import Div from "@jumbo/shared/Div";
import {CardActions, ThemeProvider} from "@mui/material";
import useJumboHeaderTheme from "@jumbo/hooks/useJumboHeaderTheme";
import useJumboTheme from "@jumbo/hooks/useJumboTheme";
import { useEffect } from 'react';
import { getnotifications, updatenotificationstatus } from 'backendServices/ApiCalls';

const NotificationComponents = {
    "POSTING": NotificationPost,
    "SHARED_POST": NotificationSharedPost,
    "INVITATION": NotificationInvitation,
    "transaction": NotificationBirthday
};

const NotificationsDropdown = () => {
    const {theme} = useJumboTheme();
    const {headerTheme} = useJumboHeaderTheme();
    const [notificationsData, setNotificationsData] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(true)

    function getChartData(){
        getnotifications((response) => {
            if(response?.data?.status === "success")
            {
                setNotificationsData(response?.data?.data)
                setIsLoading(false)

            }
            else{
                setIsLoading(false)
            }
            
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    useEffect(() => {
        getChartData()
    }, [])
 
    const clearnotifications = () =>{
        updatenotificationstatus((response) => {

            
        }, (error) => {
            console.log(error?.response?.data);
        })

    }
    const notifications = notificationsData?.entries

    if(isLoading)
    {
        return <div></div>
    }
    const newnotification = notificationsData?.entries[0].seen;

    return (
        <ThemeProvider theme={theme}>
            <JumboDdPopover
                triggerButton={
                    <ThemeProvider theme={headerTheme}>
                        <JumboIconButton onClick={()=>{ clearnotifications() }}  badge={{variant: "dot"}} newnotification={newnotification} elevation={25}>
                            <NotificationImportantOutlinedIcon sx={{fontSize: '1.25rem'}}/>
                        </JumboIconButton>
                    </ThemeProvider>
                }
                disableInsideClick
            >
                <Div sx={{width: 360, maxWidth: '100%'}}>
                    <CardHeader
                        title={"Notifications"}
                    />
                    <List disablePadding>
                        {
                            notifications?.map((item, index) => {
                                const NotificationComponent = NotificationComponents['transaction'];
                                return (NotificationComponent) ?
                                    <NotificationComponent key={index} item={item}/>
                                    :
                                    null;
                            })
                        }
                    </List>
                    <Divider/>

                </Div>
            </JumboDdPopover>
        </ThemeProvider>
    );
};

export default NotificationsDropdown;

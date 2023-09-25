import React from 'react';
import Avatar from "@mui/material/Avatar";
import ContentHeader from "../../../layouts/shared/headers/ContentHeader";
import {Box, Button, CircularProgress, Divider, Link, List, ListItem, ListItemIcon, ListItemText, Popover, TextField, Typography} from "@mui/material";
import Div from "@jumbo/shared/Div";
import Badge from "@mui/material/Badge";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useState } from 'react';
import { updateProfilePicture } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';

const Header = () => {
    const {loginUserData,setloginUserData} = useContext(CustomProvider);
    let userData = loginUserData



    const [anchorEl, setAnchorEl] = useState(null);
    const [image, setImage] = useState(null);
    const [isBtnLoading, setBtnIsLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const [alertData, setalertData] = useState({
        show:false,
        message:"",
        variant:""
    })
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleUpload = (e) => {
        if (e.target.files && e.target.files.length > 0) {
           const selectedFile = e.target.files[0];
            if (selectedFile.type.startsWith("image/")) {
                setImage(selectedFile);
              } else {
                setalertData({
                    show:true,
                    message:'Invalid file type. Please select an image file.',
                    variant:"error"
                })
              }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setBtnIsLoading(true);
        setIsButtonDisabled(true);
        if (!image) {
            setalertData({
                show:true,
                message:'Invalid file type. Please select an image file.',
                variant:"error"
            })
            setBtnIsLoading(false);
            setIsButtonDisabled(false);
            return;
        }



        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result; // Extract base64 encoded string
            const formData = new FormData();
            formData.append('image', base64Data);

            updateProfilePicture(formData, (response) => {
                console.log(response);
                setBtnIsLoading(false);
                setIsButtonDisabled(false);
                if(response?.data?.status === "error")
                {
                    setalertData({
                        show:true,
                        message:response?.data?.message,
                        variant:"error"
                    })
                }
                else if(response?.data?.status === "success")
                {
                    setAnchorEl(null);
                    setalertData({
                        show:true,
                        message:response?.data?.message,
                        variant:"success"
                    })
                    setloginUserData((prevState) => ({
                        ...prevState,
                        profilepictureurl: response?.data?.pictureurl,
                      }));
                }
                else{
                    setalertData({
                        show:true,
                        message:'Something went wrong please try again later',
                        variant:"error"
                    })
    
                }
            }, (error) => {
                setBtnIsLoading(false);
                setIsButtonDisabled(false);
                console.log(error?.response?.data);
                setalertData({
                    show:true,
                    message:'Something went wrong please try again',
                    variant:"error"
                })
            });
        };
    
        reader.readAsDataURL(image);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'user-popover' : undefined;
    return (
        <ContentHeader
            avatar={
                <Badge 
               sx={{
                width: 100
               }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                badgeContent={
                    <React.Fragment>
                        <CameraAltIcon
                            sx={{color: 'inherit', fontSize: '1.5rem'}}
                            aria-describedby={id}
                            onClick={handleClick}
                        />
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'right',
                            }}
                            sx={{
                                '& .MuiPaper-root': {
                                    border: 1,
                                    borderColor: 'divider'

                                },
                            }}
                        >
        {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
        }
                            <Div sx={{p: 3, pb: 2, minWidth: 276}}>
                                <Div
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Avatar
                                        sx={{width: 60, height: 60, mr: 2}}
                                        alt={userData.firstname}
                                        src={userData.profilepictureurl}
                                    />
                                    <Div sx={{flex: '1 1 auto'}}>
                                        <Typography variant={"h5"} mb={.35}>{userData.firstname}</Typography>
                                        {/* <Typography
                                            variant={"body1"}
                                            color={"text.secondary"}
                                        >Life must be big</Typography> */}
                                    </Div>
                                </Div>
                                <List >
                                 

            <Box 
              component='form'
             onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',                  
                    '& .MuiTextField-root': {width: '34ch'},
                }}
                alignItems="center"
            >
      
      <ListItem sx={{px: 0, pb: 0}}>
                                        <ListItemText
                                            primary={
                                                <TextField 
                                                onChange={handleUpload}
                                                name='file'
                                                type='file'
                                                margin="normal"
                                                InputProps={{endAdornment: 
                                                    <CameraAltIcon fontSize={"small"} color={"success"}/>
                                                }}
                                        
                                                />
                                           
                                            }
                                        />
                                    </ListItem>
               

                                    
                        <Button
                            style={{ width: "50%", marginTop: 20 }}
                            variant="contained"
                            type="submit"
                            disabled={isButtonDisabled}
                        >
                            {isBtnLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Update"
                            )}
                        </Button>
            </Box>
                                    
                                    
                                </List>
                            </Div>
                        </Popover>
                    </React.Fragment>
                }
                sx={{
                    mr: 2,
                    '& .MuiBadge-badge': {
                        height: 35,
                        width: 35,
                        minWidth: 16,
                        overflow: 'hidden',
                        border: 1,
                        borderColor: 'common.white',
                        color: 'common.white',
                        bgcolor: 'primary.main',
                        cursor: 'pointer',
                        right: 12,
                        bottom: 12,
                    }
                }}
            >
                <Avatar sx={{width: 100, height: 100}} alt={userData.firstname} src={userData.profilepictureurl}/>
            </Badge>
            }
            title={userData.firstname+' '+userData.lastname}
            subheader={<Typography fontSize={12} variant={'body1'} color={'inherit'} mt={.5}>{userData.country}</Typography>}

            sx={{
                position: 'relative',
                zIndex: 1,

                '& .MuiCardHeader-action': {
                    alignSelf: 'center'
                }
            }}
        />
    );
};

export default Header;

import React, {Suspense} from 'react';
import {Alert, AlertTitle, IconButton, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import menus from "./menus";
import JumboVerticalNavbar from "@jumbo/components/JumboVerticalNavbar/JumboVerticalNavbar";
import {DrawerHeader} from "@jumbo/components/JumboLayout/style";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import useJumboLayoutSidebar from "@jumbo/hooks/useJumboLayoutSidebar";
import useJumboSidebarTheme from "@jumbo/hooks/useJumboSidebarTheme";
import {SIDEBAR_STYLES, SIDEBAR_VIEWS} from "@jumbo/utils/constants/layout";
import Logo from "../../../../shared/Logo";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Zoom from "@mui/material/Zoom";
import Div from "@jumbo/shared/Div";
import SidebarSkeleton from "./SidebarSkeleton";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
    import { ContentCopy } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import { Fade } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';
import { useState } from 'react';
import {Form, Formik} from "formik";
import * as yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { invitation } from 'backendServices/ApiCalls';

const validationSchema = yup.object({
    fname: yup
        .string('Enter recipient first name')
        .required('first name is required'),
    lname: yup
        .string('Enter recipient last name')
        .required('last name is required'),
    email: yup
        .string('Enter recipient email address')
        .required('email is required'),
    phone: yup
        .string('Enter recipient phone number')
        .required('phone number is required'),
    message: yup
    .string('Enter message')
    .required('message is required'),
  });
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const Sidebar = () => {
   
    
    
    const {loginUserData,handleOpen,handleClose,open, setOpen,alertData, setalertData} = useContext(CustomProvider)

    const referrallink = loginUserData?.referrallink

    const handleCopy=()=>{
        navigator.clipboard.writeText(referrallink);
        setalertData({
            show:true,
            message:"Referral link copied to clipboard",
            variant:"success"
        })
      }
     

  const onSubmitForm = (data,setSubmitting,resetForm) => {
    console.log("data",data)
    let params = {
        "firstname":data.fname,
        "lastname":data.lname,
        "email":data.email,
        "message":data.message

  }
  invitation(params, (response) => {
    console.log("respons",response)
    
    if( response?.data?.status === "error"){
      setalertData({
        show:true,
        message:response?.data?.message,
        variant:"error"
    }) 
        setSubmitting(false)
    }else if(response?.data?.status === "success"){

      setalertData({
        show:true,
        message:response?.data?.message,
        variant:"success"
    })
        setSubmitting(false)
        resetForm();

    }
   
}, (error) => {
    console.log(error?.response?.data);
})
}
    
    return (
        <React.Fragment>

            <SidebarHeader/>
            <JumboScrollbar
                autoHide
                autoHideDuration={200}
                autoHideTimeout={500}
            >
                <Suspense
                    fallback={
                        <Div
                            sx={{
                                display: 'flex',
                                minWidth: 0,
                                alignItems: 'center',
                                alignContent: 'center',
                                px: 3
                            }}
                        >
                            <SidebarSkeleton/>
                        </Div>
                    }
                >
                <Button sx={{ml:3}} size="small" onClick={handleOpen} variant="contained" endIcon={<PersonAddAltIcon/>}>
                     Invite Users
                </Button>
                    <JumboVerticalNavbar translate items={menus}/>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout:1000,
                    }}
                   
                >
                    <Fade in={open}>
                        <Div sx={style} alignItems="center" >
                            <Typography id="transition-modal-title" variant="h4" component="h2">
                            Send Invitation Link

                    <CloseIcon  onClick={handleClose}  sx={{float:'right',color:'black', '&:hover': {
            cursor: 'pointer'
        }}}/>
                            </Typography>
        {
            alertData.show && (<Alert severity="success">{alertData.message}</Alert>)
        }
                            <center>
{
    loginUserData?.status === 'pending' ? 
    (<Alert severity="warning">"You must complete your donation before referring others." Thanks</Alert>)
    : loginUserData.status === 'downgraded' ? (
       
        <Alert severity="error" sx={{marginBottom:'20px',textAlign:'left'}}>
            <AlertTitle><strong>Alert!</strong></AlertTitle>
            you account has been downgraded because you did not reffer 2 active members. 
            you can no longer participate in the program if you want to do so you have to create a new account.
        </Alert>
    
    )
    :
    (
        <Formik
        validateOnChange={true}
        initialValues={{
            message: '',
            phone: '',
            email: '',
            lname: '',
            fname: '',
        }}
        validationSchema={validationSchema}
         onSubmit={(data, { setSubmitting, resetForm }) => {
setSubmitting(true);
onSubmitForm(data,setSubmitting, resetForm);
}}
    >
        {({isSubmitting}) => (
            <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>

<Box 

sx={{
    display: 'flex',
    flexDirection: 'column',                  
    '& .MuiTextField-root': {width: '34ch'},
}}
alignItems="center"
>
                  
                  
                  <Div sx={{mt: 2,}}>
                  <TextField sx={{width:'30ch'}}

label={'Invite users with this link'} 
type='text'
disabled
value={referrallink}
margin="normal"
InputProps={{endAdornment: 
<IconButton>
 <ContentCopy onClick={handleCopy} />
</IconButton>}}
/></Div>
</Box>
</Form>
)}
</Formik>
    )

}

                </center>
                        </Div>
                        
                    </Fade>
                </Modal>
                </Suspense>
            </JumboScrollbar>
        </React.Fragment>
    );
};

const SidebarHeader = () => {
    const {sidebarOptions, setSidebarOptions} = useJumboLayoutSidebar();
    const {sidebarTheme} = useJumboSidebarTheme();

    const isMiniAndClosed = React.useMemo(() => {
        return sidebarOptions?.view === SIDEBAR_VIEWS.MINI && !sidebarOptions?.open;
    }, [sidebarOptions.view, sidebarOptions.open]);


    return (
        <React.Fragment>
            {
                sidebarOptions?.style !== SIDEBAR_STYLES.CLIPPED_UNDER_HEADER &&
                <DrawerHeader>
                    <Logo mini={isMiniAndClosed} mode={sidebarTheme.type}/>
                    {
                        sidebarOptions?.view !== SIDEBAR_VIEWS.MINI &&
                        <Zoom in={sidebarOptions?.open}>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ml: 0, mr: -1.5}}
                                onClick={() => setSidebarOptions({open: false})}
                            >
                                <MenuOpenIcon/>
                            </IconButton>
                        </Zoom>
                    }
                </DrawerHeader>
            }
        </React.Fragment>
    )
};

export default Sidebar;

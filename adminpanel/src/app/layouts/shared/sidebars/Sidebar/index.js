import React, {Suspense} from 'react';
import {Alert, IconButton, TextField} from "@mui/material";
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
import { useLocation, useNavigate } from 'react-router-dom';
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


   
    const navigate = useNavigate();
    const location =  useLocation();
    
    const {loginUserData} = useContext(CustomProvider)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setalertData({
            show:false,
            message:"",
            variant:""
        })
    };
    
    let filteredMenus = [];
    if(loginUserData){
        var allowedroutes = loginUserData.allowedroutes;   
        
        const filterMenu = (menu) => {
            if (menu.children) {
              const filteredChildren = menu.children
                .map((child) => filterMenu(child))
                .filter((child) => child !== null);
        
              if (filteredChildren.length > 0) {
                return {
                  ...menu,
                  children: filteredChildren,
                };
              }
            }
        
            return allowedroutes.includes(menu.uri) ? menu : null;
          };
        
          const hasAllowedDescendant = (menu) => {
            if (menu.children) {
              for (const child of menu.children) {
                if (allowedroutes.includes(child.uri)) {
                  return true;
                }
        
                if (hasAllowedDescendant(child)) {
                  return true;
                }
              }
            }
        
            return false;
          };
        
        
          filteredMenus = menus
            .map((menu) => filterMenu(menu))
            .filter((menu) => menu !== null && (menu.children || hasAllowedDescendant(menu)));
        
          
//  filteredMenus = menus.map((menu) => ({
//     ...menu,
//     children: menu.children.filter((child) => allowedroutes.includes(child.uri)),
//   }));

    var url = location.pathname;
const index = url.indexOf('/', url.indexOf('/') + 1);
if (index !== -1) {
  url = url.slice(0, index);
}


    const urlExistsInTestArr = allowedroutes?.includes(url);
    if (!urlExistsInTestArr) {
      navigate('/404')
    }
    
    }

  
    const referrallink = 'http://localhost:3000/signup/'+loginUserData.randomcode
    const [alertData, setalertData] = useState({
        show:false,
        message:"",
        variant:""
    })
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
                {/* <Button sx={{ml:3}} size="small" onClick={handleOpen} variant="contained" endIcon={<PersonAddAltIcon/>}>
                     Send Invitation
                </Button> */}
                    <JumboVerticalNavbar translate items={filteredMenus}/>
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
               
               label={'Your Referral Link'} 
               type='text'
               disabled
               value={referrallink}
               margin="normal"
               InputProps={{endAdornment: 
               <IconButton>
                 <ContentCopy onClick={handleCopy} />
               </IconButton>}}
                /></Div>
                                    <Div sx={{mt: 2,}}>
                                    <JumboTextField
                                        fullWidth
                                        name="fname"
                                        label="Enter First Name"
                                        type="text"
                                    /></Div>
                                    <Div sx={{mt: 2,}}>
                                    <JumboTextField
                                        fullWidth
                                        name="lname"
                                        label="Enter Last Name"
                                        type="text"
                                    /></Div>
                                    <Div sx={{mt: 2,}}>
                                    <JumboTextField
                                        fullWidth
                                        name="email"
                                        label="Enter Email"
                                        type="text"
                                    /></Div>
                                    <Div sx={{mt: 2,}}>
                                    <JumboTextField
                                        fullWidth
                                        name="phone"
                                        label="Enter Phone Number"
                                        type="text"
                                    /></Div>
                                    <Div sx={{mt: 2,mb:1}}>
                                    <JumboTextField
                                        multiline="multiline"
                                        fullWidth
                                        name="message"
                                        label="Enter Message"
                                        type="text"
                                    /></Div>
                                    
                                 
                            <LoadingButton
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{mb: 3}}
                            loading={isSubmitting}
                            >Submit</LoadingButton>
            </Box>
            </Form>
             )}
             </Formik>
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

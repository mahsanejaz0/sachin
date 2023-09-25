import React, { useContext, useEffect, useRef, useState } from 'react';
import './tree.css'
import {Button, CircularProgress,Grid, List, ListItem, ListItemIcon, ListItemText, Typography} from '@mui/material';
import MuiPopper from '@mui/material/Popper';
import { getBinaryTreeData } from 'backendServices/ApiCalls';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';
import { Link, useParams } from 'react-router-dom';
import Div from '@jumbo/shared/Div/Div';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {styled} from '@mui/material/styles';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";

const Popper = styled(MuiPopper, {
  shouldForwardProp: (prop) => prop !== 'arrow',
})(({theme, arrow}) => ({
  zIndex: 1,
  '& > div': {
      position: 'relative',
  },
  '&[data-popper-placement*="bottom"]': {
      '& > div': {
          marginTop: arrow ? 2 : 0,
      },
      '& .MuiPopper-arrow': {
          top: 0,
          left: 0,
          marginTop: '-0.9em',
          width: '3em',
          height: '1em',
          '&::before': {
              borderWidth: '0 1em 1em 1em',
              borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
          },
      },
  },
  '&[data-popper-placement*="top"]': {
      '& > div': {
          marginBottom: arrow ? 2 : 0,
      },
      '& .MuiPopper-arrow': {
          bottom: 0,
          left: 0,
          marginBottom: '-0.9em',
          width: '3em',
          height: '1em',
          '&::before': {
              borderWidth: '1em 1em 0 1em',
              borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
          },
      },
  },
  '&[data-popper-placement*="right"]': {
      '& > div': {
          marginLeft: arrow ? 2 : 0,
      },
      '& .MuiPopper-arrow': {
          left: 0,
          marginLeft: '-0.9em',
          height: '3em',
          width: '1em',
          '&::before': {
              borderWidth: '1em 1em 1em 0',
              borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
          },
      },
  },
  '&[data-popper-placement*="left"]': {
      '& > div': {
          marginRight: arrow ? 2 : 0,
      },
      '& .MuiPopper-arrow': {
          right: 0,
          marginRight: '-0.9em',
          height: '3em',
          width: '1em',
          '&::before': {
              borderWidth: '1em 0 1em 1em',
              borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
          },
      },
  },
}));


const BinaryTree = () => {

  const [userHierarchyData,setUserHierarchyData]=useState()
  const {loginUserData} = useContext(CustomProvider);
  const [loading,setLoading]=useState(true)
  const {randomcode} = useParams();
  // State for popover anchor element
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState([]);
  const arrowRef = useRef(null);
  const containerRef = useRef(null); // Ref to the container element

  // Function to handle popover open
  const handlePopoverOpen = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  // Function to handle popover close
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleNodeClick = (content,event) => {
    setPopoverContent(content);
    handlePopoverOpen(event);
  };
  
  let userData = loginUserData
  let userrandomcode = 'JKKJ62GJHF';
  if(randomcode)
  {
    userrandomcode = randomcode
  }
  const HierArchyData =()=>{
    setLoading(true)
    getBinaryTreeData(userrandomcode, (response) => {
      setUserHierarchyData(response?.data?.data)
      console.log("response?.data?.data",response?.data?.data) 
      setLoading(false)
      }, (error) => {
          console.log(error?.response?.data);
      })
  }
  
  useEffect(()=>{
    HierArchyData();
    console.log("useeffect")
  },[loginUserData, randomcode])
  
  
  useEffect(() => {
    // Attach click event listener to handle clicks outside the Popper
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        console.log('clicked')
        handlePopoverClose();
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);


  if(loading){
    return  <Div
    sx={{
        display: 'flex',
        minWidth: 0,
        alignItems: 'center',
        alignContent: 'center',
        height: '100%',
    }}
  >
    <CircularProgress sx={{m: '-40px auto 0'}}/>
  </Div>
  }

  return (
    <Grid container spacing={3.75}>
    <Grid item xs={12} md={12} lg={12}>
    <section
    className="management-hierarchy"
    id="tree"
    style={{ backgroundColor: "secondary" }}
  >

    
<Popper
    open={Boolean(popoverAnchorEl)}
    anchorEl={popoverAnchorEl}
    placement="right"
    disablePortal={false}
    modifiers={[
      {
        name: 'flip',
        enabled: true,
        options: {
          altBoundary: true,
          rootBoundary: 'document',
          padding: 8,
        },
      },
      {
        name: 'preventOverflow',
        enabled: true,
        options: {
          altAxis: true,
          altBoundary: true,
          tether: true,
          rootBoundary: 'document',
          padding: 8,
        },
      },

    ]}
>
        
        <JumboCardQuick title={"Details"} noWrapper sx={{ mt: { xs: 2 }}}>
            <List disablePadding sx={{mb: 2}}>
                <ListItem alignItems="flex-start" sx={{p: theme => theme.spacing(.3, 2)}}>
                    <ListItemIcon sx={{minWidth: 36, color: 'text.secondary'}}>
                        <AccountCircleIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary={<Typography variant="body1" color="text.secondary">Member</Typography>}
                        secondary={<Link variant="body1" underline="none">{popoverContent.userfullname}</Link>}
                    />
                </ListItem>

                <ListItem alignItems="flex-start" sx={{p: theme => theme.spacing(.3, 2)}}>
                    <ListItemIcon sx={{minWidth: 36, color: 'text.secondary'}}>
                        <SupervisedUserCircleIcon/>
                    </ListItemIcon>
                    <ListItemText

                        primary={<Typography variant="body1" color="text.secondary">Sponsor</Typography>}
                        secondary={<Typography variant="body1" color="text.primary">{popoverContent.sponsorfullname}</Typography>}
                    />
                </ListItem>

                <ListItem alignItems='center'>
                  <Button component={Link} to={popoverContent.link} color='primary' variant="contained" size='small'>View Tree</Button>
                </ListItem>

            </List>
        </JumboCardQuick>
                 
</Popper>
    <div className="hv-container">
      <div id="wrapper" className="hv-wrapper">
        {/* start */}
        {/* Key component */}
        <div id="container" className="hv-item custom_zoom"  ref={containerRef}>
          <div className="hv-item-parent">
            <div style={{ textDecoration: 'none' }} className="person"
                onClick={(event) => handleNodeClick({
                  "userfullname":userHierarchyData?.user1?.fullname,
                  "sponsorfullname":userHierarchyData?.user1?.sponsorfullname,
                  "link": userHierarchyData?.user1?.randomcode && '/binary-tree/'+userHierarchyData?.user1?.randomcode
                }, event)}
            >
              <img src={userHierarchyData?.picturelink+(userHierarchyData?.user1?.profilepicture || 'profile.png')} alt="" style={{ marginBottom: 5, width: 80, height: 80 }} />
              <p
                className="name"
                style={{ backgroundColor: "#fff", color: "white" }}
              >
                {userHierarchyData?.user1?.username || 'empty'}
                <br />
                {userHierarchyData?.user1?.sponsorname}
              </p>
            </div>
            
          </div>
          <div className="hv-item-children">
            <div className="hv-item-child">
              {/* Key component */}
              <div className="hv-item">
                <div className="hv-item-parent">
                 
                    <div style={{ textDecoration: 'none' }} className="person"
               onClick={(event) => handleNodeClick({
                "userfullname":userHierarchyData?.user2?.fullname,
                "sponsorfullname":userHierarchyData?.user2?.sponsorfullname,
                "link": userHierarchyData?.user2?.randomcode && '/binary-tree/'+userHierarchyData?.user2?.randomcode
              }, event)}
                    >
                      <img src={userHierarchyData?.picturelink+(userHierarchyData?.user2?.profilepicture || 'profile.png')} style={{ marginBottom: 5, width: 80, height: 80 }} />
                      <p
                        className="name"
                        style={{ backgroundColor: "#fff", color: "white" }}
                      >
                {userHierarchyData?.user2?.username || 'empty'}
                <br />
                {userHierarchyData?.user2?.sponsorname}
                      </p>
                    </div>
                </div>

                <div className="hv-item-children">
                  <div className="hv-item-child">
                    <div className="hv-item-child">
                      {/* Key component */}
                      <div className="hv-item">
                        <div className="">
                         
                            <div  style={{ textDecoration: 'none' }} className="person"
                          onClick={(event) => handleNodeClick({
                            "userfullname":userHierarchyData?.user4?.fullname,
                            "sponsorfullname":userHierarchyData?.user4?.sponsorfullname,
                            "link": userHierarchyData?.user4?.randomcode && '/binary-tree/'+userHierarchyData?.user4?.randomcode
                          }, event)}
                            >
                              <img
                                src={userHierarchyData?.picturelink+(userHierarchyData?.user4?.profilepicture || 'profile.png')}
                                style={{ marginBottom: 5, width: 80, height: 80 }}
                              />
                              <p
                                className="name"
                                style={{
                                  backgroundColor: "#fff",
                                  color: "white"
                                }}
                              >
                {userHierarchyData?.user4?.username || 'empty'}
                <br />
                {userHierarchyData?.user4?.sponsorname}
                              </p>
                            </div>
                        </div>
                       
                      </div>
                    </div>
                  </div>
                  <div className="hv-item-child">
                    <div className="hv-item-child">
                      {/* Key component */}
                      <div className="hv-item" style={{ marginBottom: 100 }}>
                        <div className="">
                          
                            <div  style={{ textDecoration: 'none' }} className="person"
                              onClick={(event) => handleNodeClick({
                                "userfullname":userHierarchyData?.user5?.fullname,
                                "sponsorfullname":userHierarchyData?.user5?.sponsorfullname,
                                "link": userHierarchyData?.user5?.randomcode && '/binary-tree/'+userHierarchyData?.user5?.randomcode
                              }, event)}
                            >
                              <img
                                src={userHierarchyData?.picturelink+(userHierarchyData?.user5?.profilepicture || 'profile.png')}
                                style={{ marginBottom: 5, width: 80, height: 80 }}
                              />
                              <p
                                className="name"
                                style={{
                                  backgroundColor: "#fff",
                                  color: "white"
                                }}
                              >
                {userHierarchyData?.user5?.username || 'empty'}
                <br />
                {userHierarchyData?.user5?.sponsorname}
                              </p>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hv-item-child">
              {/* Key component */}
              <div className="hv-item">
                <div className="hv-item-parent">
                 
                    <div style={{ textDecoration: 'none' }} className="person"
                        onClick={(event) => handleNodeClick({
                          "userfullname":userHierarchyData?.user3?.fullname,
                          "sponsorfullname":userHierarchyData?.user3?.sponsorfullname,
                          "link": userHierarchyData?.user3?.randomcode && '/binary-tree/'+userHierarchyData?.user3?.randomcode
                        }, event)}
                    >
                      <img src={userHierarchyData?.picturelink+(userHierarchyData?.user3?.profilepicture || 'profile.png')} style={{ marginBottom: 5, width: 80, height: 80 }} />
                      <p
                        className="name"
                        style={{ backgroundColor: "#fff", color: "white" }}
                      >
                {userHierarchyData?.user3?.username || 'empty'}
                <br />
                {userHierarchyData?.user3?.sponsorname}
                      </p>
                    </div>
                </div>
                <div className="hv-item-children">
                  <div className="hv-item-child">
                    <div className="hv-item-child">
                      {/* Key component */}
                      <div className="hv-item">
                        <div className="">
                         
                            <div  style={{ textDecoration: 'none' }} className="person"
                              onClick={(event) => handleNodeClick({
                                "userfullname":userHierarchyData?.user6?.fullname,
                                "sponsorfullname":userHierarchyData?.user6?.sponsorfullname,
                                "link": userHierarchyData?.user6?.randomcode && '/binary-tree/'+userHierarchyData?.user6?.randomcode
                              }, event)}
                            >
                              <img
                                src={userHierarchyData?.picturelink+(userHierarchyData?.user6?.profilepicture || 'profile.png')}
                                style={{ marginBottom: 5, width: 80, height: 80 }}
                              />
                              <p
                                className="name"
                                style={{
                                  backgroundColor: "#fff",
                                  color: "white"
                                }}
                              >
                {userHierarchyData?.user6?.username || 'empty'}
                <br />
                {userHierarchyData?.user6?.sponsorname}
                              </p>
                            </div>
                        </div>
                      </div>
                    </div>{" "}
                  </div>
                  <div className="hv-item-child">
                    <div className="hv-item-child">
                      {/* Key component */}
                      <div className="hv-item">
                        <div className="">
                          
                            <div  style={{ textDecoration: 'none' }} className="person"
                              onClick={(event) => handleNodeClick({
                                "userfullname":userHierarchyData?.user7?.fullname,
                                "sponsorfullname":userHierarchyData?.user7?.sponsorfullname,
                                "link": userHierarchyData?.user7?.randomcode && '/binary-tree/'+userHierarchyData?.user7?.randomcode
                              }, event)}
                            >
                              <img
                                src={userHierarchyData?.picturelink+(userHierarchyData?.user7?.profilepicture || 'profile.png')}
                                style={{ marginBottom: 5, width: 80, height: 80 }}
                              />
                              <p
                                className="name"
                                style={{
                                  backgroundColor: "#fff",
                                  color: "white"
                                }}
                              >
                                {userHierarchyData?.user7?.username || 'empty'}
                                <br />
                                {userHierarchyData?.user7?.sponsorname}
                              </p>
                            </div>
                        </div>
                      </div>
                    </div>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end */}
      </div>
    </div>
  </section>
    </Grid>
    </Grid>
   
  
  )}

export default BinaryTree;

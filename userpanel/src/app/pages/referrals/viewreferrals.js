import React, { useEffect, useState } from 'react';
import PopularAgents from "../../shared/widgets/PopularAgents";
import { CircularProgress, Grid } from '@mui/material';
import { roidata, referralusers } from 'backendServices/ApiCalls';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import Div from '@jumbo/shared/Div/Div';

export default function ViewReferrals() {
  const {...authOptions} = useJumboAuth()
  const [picturelink,setPictureLink]=useState([])
  const [referralusersdata,setReferralUsersData]=useState([])
  const [loading,setLoading]=useState(true)
  
  const ReferralUsers =()=>{
    referralusers((response) => {
        setReferralUsersData(response?.data?.data?.entries)
        setPictureLink(response?.data?.data?.picturelink)
        setLoading(false)
    }, (error) => {
        console.log(error?.response?.data);
        setLoading(true)
    })
} 


  useEffect(()=>{
      ReferralUsers();
  },[])

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
            <Grid item xs={12}>
                <PopularAgents picturelink={picturelink} data={referralusersdata}/>
            </Grid>
  )
}

import React, { useEffect, useState } from 'react';
import PopularAgents from "../../shared/widgets/PopularAgents";
import { Grid } from '@mui/material';
import { roidata, referralusers } from 'backendServices/ApiCalls';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';

export default function ViewReferrals() {
  const {...authOptions} = useJumboAuth()
  const [picturelink,setPictureLink]=useState([])
  const [referralusersdata,setReferralUsersData]=useState([])

  
  const ReferralUsers =()=>{
    referralusers((response) => {
        setReferralUsersData(response?.data?.data?.entries)
        setPictureLink(response?.data?.data?.picturelink)
    }, (error) => {
        console.log(error?.response?.data);
    })
} 


  useEffect(()=>{
      ReferralUsers();
  },[])
  return (
            <Grid item xs={12}>
                <PopularAgents picturelink={picturelink} data={referralusersdata}/>
            </Grid>
  )
}

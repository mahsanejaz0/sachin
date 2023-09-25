import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { postRequest, referralbonusreport } from 'backendServices/ApiCalls';
import { CircularProgress } from '@mui/material';
import Div from '@jumbo/shared/Div/Div';

const VISIBLE_FIELDS = ['sr', 'sender', 'amount', 'date'];
const ReferralBonusReport = () => {
  const [loading,setLoading]=useState(true)
  const [referralbonusdata,setReferralBonusData]=useState([])
  let params = {
    status: 'all',
    type:'referralbonus',
    usertype:'receiver'
  };
  const ReferralData =()=>{
    setLoading(true)
    postRequest('/selecttransactions',params,(response) => {
      if(response?.data?.status === "success") {
          setReferralBonusData(response?.data?.data)
          setLoading(false)
      }
      }, (error) => {
          console.log(error?.response?.data); 
          setLoading(false)
      })
  }
    
useEffect(()=>{
    ReferralData();
},[])


const initialState= {initialState:{
  columns:{
      columnVisibilityModel:{
          id: false,
          avatar: false,
          website: false,
          email: false,
          phone: false,
          username: false,
          city: false,
          company: false,
          position: false,
          lastUpdated: false,
          salary: false,
      }
  }
}
}




const gridDesign = {
  '& .MuiDataGrid-toolbarContainer': {
    '& .MuiButton-text': {
      fontSize: '13px !important',
      color: '#fff',
    },
    '& .MuiBadge-badge': {
      backgroundColor: '#074682',
    },
    '& .MuiInput-root':{
      borderRadius: 2,
      paddingLeft: 2,
      overflow: 'hidden',
    },

  }
}
      // Otherwise filter will be applied on fields such as the hidden column id
      const columns = [
       
        {
          field: "amount",
          headerName: "Amount",  
          dataGeneratorUniquenessEnabled: true,
          width: 150,
          editable: true,
          groupable: false,
          aggregable: false,
          renderCell: (params) => `$${params.value}`
      },
      {
        field: "senderusername",
        headerName: "Sender",  
        dataGeneratorUniquenessEnabled: true,
        width: 200,
        editable: true,
        groupable: false,
        aggregable: false,
    },
  {
            field: "details",
            headerName: "Details",  
            dataGeneratorUniquenessEnabled: true,
            width: 400,
            editable: true,
            groupable: false,
            aggregable: false,  
        },
        {
            field: "createdat",
            headerName: "Date",  
            dataGeneratorUniquenessEnabled: true,
            width: 100,
            editable: true,
            groupable: false,
            aggregable: false,  
            renderCell:(params) => {
              const dateObject = new Date(params.row.createdat);
            // Extract the year, month, and day components
            const year = dateObject.getFullYear();
            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
            const day = dateObject.getDate().toString().padStart(2, '0');
            // Create a formatted date string (e.g., "YYYY-MM-DD")
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate
            }  
        }

    ]
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
    const rows= referralbonusdata

  return (
    <JumboDemoCard
    title={"Referral Bonus Summary"}
    wrapperSx={{backgroundColor: 'background.paper', pt: 0}}
>
    <Box sx={{ height: 460, width: 1 }}>
    <DataGrid
        initialState={{
          initialState,
          pagination: { paginationModel: { pageSize: 6 } },
        }}
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        sx={gridDesign}
        pageSizeOptions={[6, 12, 18, 24, 30]}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </Box>
  </JumboDemoCard>
  )
}

export default ReferralBonusReport
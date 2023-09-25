import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { demodata } from './reportdata';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { postRequest, roidata } from 'backendServices/ApiCalls';
import { CircularProgress } from '@mui/material';
import Div from '@jumbo/shared/Div/Div';

const VISIBLE_FIELDS = ['sr', 'sender', 'amount', 'date'];
const RoiReport = () => {
  const [loading,setLoading]=useState(true)
const [userroidata,setUserRoiData]=useState([])
const RoiData =()=>{
  let params = {
    status: 'all',
    type:'roi',
    usertype:'receiver'
  };
  setLoading(true)
  postRequest('/selecttransactions',params,(response) => {
    setUserRoiData(response?.data?.data)
        setLoading(false)
    }, (error) => {
        console.log(error?.response?.data);
        setLoading(false)
    })
}

useEffect(()=>{
    RoiData();
},[])

const generateRowId = () => {
  // Generate a random string or use any other logic to create a unique ID
  return `row-${Math.random().toString(36).substr(2, 9)}`;
};
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




const data = demodata;
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
            field: "id",
            headerName: "ID",
            width: 200,
            editable: true,
            valueGetter: (params) => params.row.id, // Use custom ID or generate one if it doesn't exist

        },
        {
            field: "amount",
            headerName: "Amount",  
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
            width: 250,
            editable: true,
            groupable: false,
            aggregable: false,  
        },
        {
            field: "createdat",
            headerName: "Date",  
            dataGeneratorUniquenessEnabled: true,
            width: 200,
            editable: true,
            groupable: false,
            aggregable: false,    
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
    const rows= userroidata


  return (
    <JumboDemoCard
    title={"ROI Summary"}
    wrapperSx={{backgroundColor: 'background.paper', pt: 0}}
>
    <Box sx={{ height: 460, width: 1 }}>
    <DataGrid
        initialState={{
          initialState,
          pagination: { paginationModel: { pageSize: 6 } },
        }}
        rows={rows}
        getRowId={(row) => generateRowId()} 
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

export default RoiReport
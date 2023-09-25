import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { demodata } from './reportdata';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { roidata } from 'backendServices/ApiCalls';

const VISIBLE_FIELDS = ['sr', 'sender', 'amount', 'date'];
const RoiReport = () => {
  
const [userroidata,setUserRoiData]=useState([])
const RoiData =()=>{
    roidata((response) => {
        setUserRoiData(response?.data?.data?.entries)
    }, (error) => {
        console.log(error?.response?.data);
    })
}

useEffect(()=>{
    console.log('useeffect')
    RoiData();
},[])

console.log("userroidata",userroidata)

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
            dataGeneratorUniquenessEnabled: true,
            width: 200,
            editable: true,
            groupable: false,
            aggregable: false,
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

    const rows= userroidata

    console.log(data)
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
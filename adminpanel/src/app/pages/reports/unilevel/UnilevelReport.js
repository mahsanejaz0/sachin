import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { postRequest } from 'backendServices/ApiCalls';

const VISIBLE_FIELDS = ['sr', 'sender', 'amount', 'date'];
const ReferralBonusReport = () => {
  
  const [unilevelbonus,setUnilevelBonusData]=useState([])
  const UnilevelData =()=>{
    let params = {
      type:"unilevelbonus"
  }
  postRequest('/report',params,(response) => {
          setUnilevelBonusData(response?.data?.data)
      }, (error) => {
          console.log(error?.response?.data); 
      })
  }
  console.log("unilevelbonus",unilevelbonus)
    
useEffect(()=>{
    console.log('useeffect')
    UnilevelData();
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
            width: 200,
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

    const rows= unilevelbonus

  return (
    <JumboDemoCard
    title={"Unilevel Bonus Summary"}
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
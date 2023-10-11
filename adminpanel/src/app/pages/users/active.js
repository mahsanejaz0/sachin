import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import {createusersession, getusers } from 'backendServices/ApiCalls';
import {Link} from "react-router-dom";
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { AddTask, Login } from '@mui/icons-material';
import Div from '@jumbo/shared/Div/Div';



const VISIBLE_FIELDS = ['sr', 'amount', 'status','date'];
const Active = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [usersdata,setUsersData]=useState([])
  const [loadingStates, setLoadingStates] = useState({});
  let params = {
    status:'approved',
  }

  const generateRowId = () => {
    // Generate a random string or use any other logic to create a unique ID
    return `row-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  
  const columns = [
    {
      field: "id",
      headerName: "Sr#",
      width: 50,
      editable: true,
      groupable: false,
      aggregable: false,
      valueGetter: (params) => params.row.id, // Use custom ID or generate one if it doesn't exist
  
    },
  {
    field: "username",
    headerName: "Username",  
    dataGeneratorUniquenessEnabled: true,
    width: 150,
    editable: true,
    groupable: false,
    aggregable: false,
  },
  
  {
    field: "fullname", // New column for Full Name
    headerName: "Full Name",
    dataGeneratorUniquenessEnabled: true,
    width: 200,
    editable: true,
    groupable: false,
    aggregable: false,
  },
  
  {
    field: "email",
    headerName: "email",  
    dataGeneratorUniquenessEnabled: true,
    width: 200,
    editable: true,
    groupable: false,
    aggregable: false,
  },

  
  {
    field: "mobile",
    headerName: "Mobile",  
    dataGeneratorUniquenessEnabled: true,
    width: 130,
    editable: true,
    groupable: false,
    aggregable: false,
  },
  
  {
    field: "current_balance",
    headerName: "Wallet Balance",  
    dataGeneratorUniquenessEnabled: true,
    width: 150,
    editable: true,
    groupable: false,
    aggregable: false,
  },
  
  // {
  //   field: "actions",
  //   headerName: "Actions",
  //   width: 120,
  //   editable: true,
  //   groupable: false,
  //   aggregable: false,
  //   renderCell: (params) => {
  //     const randomcode = params?.row?.randomcode;
  //     const username = params?.row?.username;
  //     const tree = '/treeview/' + randomcode;
    
  //     const isLoading = loadingStates[params.row.userid] || false;
    
  //     return (
  //       <>
  //         <Tooltip title="View Tree">
  //           <Link to={tree}>
  //             <ReduceCapacityIcon color="warning" sx={{ fontSize: 20 }} />
  //           </Link>
  //         </Tooltip>
  //         {/* <Tooltip title={"Login to " + username + " account"}>
  //           <IconButton
  //             onClick={() => handleCreateUserSession(params.row.userid)}
  //             disabled={isLoading} // Disable the button while loading is true
  //           >
  //             {isLoading ? (
  //               <CircularProgress color='error' size={20} /> // Show the loading progress
  //             ) : (
  //               <Login color="error" />
  //             )}
  //           </IconButton>
  //         </Tooltip> */}
  //       </>
  //     );
  //   },
    
  // },
  
  
  ]
  
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
  
  
    const handleCreateUserSession = (userId) => {
      setLoadingStates((prevState) => ({
        ...prevState,
        [userId]: true,
      }));
      setIsLoading(true);
      let params = {
        userId
      }
      createusersession(params,(response) => {

        if(response?.data?.status === "success") {
          window.open(response?.data?.accessurl, '_blank');
            setIsLoading(false);
            setLoadingStates((prevState) => ({
              ...prevState,
              [userId]: false,
            }));
        }
        }, (error) => {
            console.log(error?.response?.data); 
        })

    };


  const UsersData =()=>{
    getusers(params,(response) => {
      if(response?.data?.status === "success") {
          setUsersData(response?.data?.userdata)
          setIsMainLoading(false)
      }
      }, (error) => {
          console.log(error?.response?.data); 
          setIsMainLoading(false)
      })
  }

    
useEffect(()=>{
    UsersData();
},[])



const rows= usersdata

let idCounter = 1; // Initialize the counter

// Assign a unique sequential ID to each row
const rowsWithId = rows.map((row) => ({
  ...row,
  id: idCounter++, // Assign the current counter value and then increment it
  fullname: row.firstname + ' ' + row.lastname,
}));
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

if(isMainLoading){
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
    <JumboDemoCard
    title={"Active Users"}
    wrapperSx={{backgroundColor: 'background.paper', pt: 0}}
>

    <Box sx={{ height: 800, width: 1 }}>
    <DataGrid
        initialState={{
          initialState,
          pagination: { paginationModel: { pageSize: 15 } },
        }}
        rows={rowsWithId}
       
        getRowId={(row) => generateRowId()} 
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        sx={gridDesign}
        pageSizeOptions={[15, 30, 75, 100]}
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

export default Active
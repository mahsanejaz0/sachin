import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import {getadmins, removeadmin } from 'backendServices/ApiCalls';
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from "@mui/material";
import Alert from "@mui/material/Alert";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';



const VISIBLE_FIELDS = ['sr', 'amount', 'status','date'];
const Inactive = () => {
  const [alertData, setalertData] = useState({
    show:false,
    message:"",
    variant:""
})
  
  const [usersdata,setUsersData]=useState([]) 

  const UsersData =()=>{
    getadmins((response) => {
      if(response?.data?.status === "success") {
          setUsersData(response?.data?.data?.entries)
      }
      }, (error) => {
          console.log(error?.response?.data); 
      })
  }


  console.log("usersdata",usersdata) 
    
useEffect(()=>{
    console.log('useeffect')
    UsersData();
},[])
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
  aggregable: false,
},

{
  field: "",
  headerName: "Full Name",  
  dataGeneratorUniquenessEnabled: true,
  width: 200,
  editable: true,
  groupable: false,
  aggregable: false,
  aggregable: false,
  renderCell: (params) => {
    const firstname = params?.row?.firstname;
    const lastname = params?.row?.lastname;
    return <span>{firstname+' '+lastname}</span>;
  }
},

{
  field: "email",
  headerName: "email",  
  dataGeneratorUniquenessEnabled: true,
  width: 200,
  editable: true,
  groupable: false,
  aggregable: false,
  aggregable: false,
},




{
  field: "delete",
  headerName: "Delete",
  width: 120,
  editable: true,
  groupable: false,
  aggregable: false,
  renderCell: (params) => (
    <IconButton
      onClick={() => handleDelete(params.row.userid)} // Call the delete function with the row's ID
    >
      <DeleteIcon />
    </IconButton>
  ),
},





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



const handleDelete=(id)=>{
  let params = {
    userid:id,
  }
  removeadmin(params,(response) => {
      if(response?.data?.status === "success") {
        setalertData({
          show:true,
          message:'User Deleted',
          variant:"success"
      })
       UsersData();
      }
      }, (error) => {
          console.log(error?.response?.data); 
      })

}


const rows= usersdata

let idCounter = 1; // Initialize the counter

// Assign a unique sequential ID to each row
const rowsWithId = rows.map((row) => ({
  ...row,
  id: idCounter++, // Assign the current counter value and then increment it
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

  return (
    <JumboDemoCard
    title={"Mini Admins List"}
    wrapperSx={{backgroundColor: 'background.paper', pt: 0}}
>
{
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
        }

    <Box sx={{ height: 400, width: 1 }}>
    <DataGrid
        initialState={{
          initialState,
          pagination: { paginationModel: { pageSize: 6 } },
        }}
        rows={rowsWithId}
       
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

export default Inactive
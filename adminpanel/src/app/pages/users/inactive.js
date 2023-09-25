import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import {getusers, deleteuser, deployuser, verifyUserEmailManual, createusersession } from 'backendServices/ApiCalls';
import DeleteIcon from '@mui/icons-material/Delete';
import {CircularProgress, IconButton, Tooltip} from "@mui/material";
import Button from '@mui/material/Button';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AddTask, Login } from '@mui/icons-material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import Div from '@jumbo/shared/Div/Div';

const VISIBLE_FIELDS = ['sr', 'amount', 'status','date'];
const Inactive = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [alertData, setalertData] = useState({
    show:false,
    message:"",
    variant:""
})
  const [isLoading, setIsLoading] = useState(false);
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const [usersdata,setUsersData]=useState([])


  let params = {
    status:'pending',
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
  field: "emailstatus",
  headerName: "Email Status",  
  dataGeneratorUniquenessEnabled: true,
  width: 150,
  editable: true,
  groupable: false,
  aggregable: false,
},


{
  field: "mobile",
  headerName: "Mobile",  
  dataGeneratorUniquenessEnabled: true,
  width: 100,
  editable: true,
  groupable: false,
  aggregable: false,
},

{
  field: "actions",
  headerName: "Actions",
  width: 140,
  editable: true,
  groupable: false,
  aggregable: false,
  renderCell: (params) => {
    const username = params?.row?.username;
    return (
    <>
    <Tooltip title="Delete">
                <IconButton onClick={() => handleActionClick(params.row.userid, 'delete')}>
                  <DeleteIcon color='error' />
                </IconButton>
    </Tooltip>
    {/* <Tooltip title="Manual Approve User">
                <IconButton onClick={() => handleActionClick(params.row.userid, 'manual_approve')}>
                  <AddTask color='warning' />
                </IconButton>
    </Tooltip> */}
    {
      params.row.emailstatus === 'unverified' ? (
        <Tooltip title="Verify Email Status">
          <IconButton onClick={() => handleActionClick(params.row.userid, 'verify_email')}>
            <MarkEmailReadIcon color="success" />
          </IconButton>
        </Tooltip>
      )
      :
      null
    }
          {/* <Tooltip title={"Login to " + username + " account"}>
            <IconButton
              onClick={() => handleCreateUserSession(params.row.userid)}
              disabled={isLoading} // Disable the button while loading is true
            >
              {isLoading ? (
                <CircularProgress color='info' size={20} /> // Show the loading progress
              ) : (
                <Login color="info" />
              )}
            </IconButton>
          </Tooltip> */}
    </>
  )},
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


const handleDelete = () => {
  if (selectedUserId) {
    let params = {
      userid: selectedUserId,
    };
    deleteuser(
      params,
      (response) => {
        if (response?.data?.status === 'success') {
          setalertData({
            show: true,
            message: 'User Deleted',
            variant: 'success',
          });
          UsersData();
        }
      },
      (error) => {
        console.log(error?.response?.data);
      }
    );
  }
  setOpenDialog(false);
};


const handleManualApprove = () => {
  if (selectedUserId) {
    let params = {
      userid: selectedUserId,
      investmentamount:10
    };
    deployuser(
      params,
      (response) => {
        if (response?.data?.status === 'success') {
          setOpenApproveDialog(false);
          setalertData({
            show: true,
            message: 'User Approved Manually',
            variant: 'success',
          });
          UsersData();
        }
      },
      (error) => {
        console.log(error?.response?.data);
      }
    );
  }

};


const handleManualApproveEmail = () => {
  setIsLoading(true)
  if (selectedUserId) {
    let params = {
      userid: selectedUserId,
    };
    verifyUserEmailManual(
      params,
      (response) => {
        if (response?.data?.status === 'success') {
          setalertData({
            show: true,
            message: 'Email verified successfully',
            variant: 'success',
          });
          UsersData();
          setIsLoading(false)
          setOpenEmailDialog(false);
  
        }
      },
      (error) => {
        console.log(error?.response?.data);
      }
    );
  }

};


const handleCloseDialog = () => {
  setSelectedUserId(null);
  setOpenDialog(false);
};

const handleCloseApproveDialog = () => {
  setSelectedUserId(null);
  setOpenApproveDialog(false);
};


const handleCloseEmailDialog = () => {
  setSelectedUserId(null);
  setOpenEmailDialog(false);
};

const handleActionClick = (id,action) => {
  setSelectedUserId(id)
  if(action === 'delete'){
  setOpenDialog(true) 
  }
  else if(action === 'manual_approve')
  {
    setOpenApproveDialog(true)
  }
  else if(action === 'verify_email')
  {
    setOpenEmailDialog(true)
  }
  
};

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
    title={"Inactive Users"}
    wrapperSx={{backgroundColor: 'background.paper', pt: 0}}
    
>
<Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
</Dialog>

<Dialog open={openApproveDialog} onClose={handleCloseApproveDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to approve this user's payment manually?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleManualApprove} color="success" autoFocus>
            Approve
          </Button>
        </DialogActions>
</Dialog>



<Dialog open={openEmailDialog} onClose={handleCloseEmailDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to verify this user email manually?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleManualApproveEmail} color="success" autoFocus>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : 
            'Verify'
          }
            
          </Button>
        </DialogActions>
</Dialog>
{
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
        }

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

export default Inactive
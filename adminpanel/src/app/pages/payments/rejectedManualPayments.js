import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import {deleteuser, deploymanualpaymentuser, getmanualpayments, rejectmanualpaymentuser } from 'backendServices/ApiCalls';
import {IconButton, Tooltip} from "@mui/material";
import Button from '@mui/material/Button';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

const VISIBLE_FIELDS = ['sr', 'amount', 'status','date'];
const RejectedManualPayments = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const [alertData, setalertData] = useState({
    show:false,
    message:"",
    variant:""
})
  
  const [usersdata,setPaymentsData]=useState([]) 

  const PaymentsData =(status)=>{
    let params = {
        status:status,
      }
    getmanualpayments(params,(response) => {
      if(response?.data?.status === "success") {
          setPaymentsData(response?.data?.data?.entries)
      }
      }, (error) => {
          console.log(error?.response?.data); 
      })
  }


    
useEffect(()=>{
    PaymentsData('rejected');

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
    field: "paymentusername",
    headerName: "Wise User Name",  
    dataGeneratorUniquenessEnabled: true,
    width: 150,
    editable: true,
    groupable: false,
    aggregable: false,
    aggregable: false,
  },

{
  field: "formattedpaymentdatetime",
  headerName: "Date Time",  
  dataGeneratorUniquenessEnabled: true,
  width: 200,
  editable: true,
  groupable: false,
  aggregable: false,
  aggregable: false,
},

{
  field: "paymentamount",
  headerName: "Amount",  
  dataGeneratorUniquenessEnabled: true,
  width: 150,
  editable: true,
  groupable: false,
  aggregable: false,
  aggregable: false,
  renderCell: (params) => `$${params.value}`

},

{
  field: "paymentaccountid",
  headerName: "Transaction Number",  
  dataGeneratorUniquenessEnabled: true,
  width: 200,
  editable: true,
  groupable: false,
  aggregable: false,
  aggregable: false,
},

{
  field: "status",
  headerName: "Status",  
  dataGeneratorUniquenessEnabled: true,
  width: 80,
  editable: true,
  groupable: false,
  aggregable: false,
},
{
  field: "approved_by",
  headerName: "Rejected By",  
  dataGeneratorUniquenessEnabled: true,
  width: 200,
  editable: true,
  groupable: false,
  aggregable: false,
}


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


const handleReject = () => {
  if (selectedPaymentId) {
    let params = {
        paymentid: selectedPaymentId,
    };
    rejectmanualpaymentuser(
      params,
      (response) => {
        if (response?.data?.status === 'success') {
          setalertData({
            show: true,
            message: 'Payment Rejected',
            variant: 'warning',
          });
          PaymentsData('rejected');
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
  if (selectedPaymentId) {
    let params = {
      paymentid: selectedPaymentId,
      investmentamount:10
    };
    deploymanualpaymentuser(
      params,
      (response) => {
        if (response?.data?.status === 'success') {
          setOpenApproveDialog(false);
          setalertData({
            show: true,
            message: 'User Approved successfully',
            variant: 'success',
          });
          PaymentsData('rejected');
        }
      },
      (error) => {
        console.log(error?.response?.data);
      }
    );
  }

};


const handleCloseDialog = () => {
  setSelectedPaymentId(null);
  setOpenDialog(false);
};

const handleCloseApproveDialog = () => {
  setSelectedPaymentId(null);
  setOpenApproveDialog(false);
};

const handleActionClick = (id,action) => {
  setSelectedPaymentId(id)
  if(action === 'Reject'){
  setOpenDialog(true) 
  }
  else if(action === 'Approve')
  {
    setOpenApproveDialog(true)
  }
  
};

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
    title={'Rejected Wise Payments'}
    wrapperSx={{backgroundColor: 'background.paper', pt: 0}}
    
>
<Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to reject this payment?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReject} color="error" autoFocus>
            Reject
          </Button>
        </DialogActions>
</Dialog>

<Dialog open={openApproveDialog} onClose={handleCloseApproveDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to approve this payment?</DialogContentText>
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

export default RejectedManualPayments
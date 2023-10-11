import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { getdepositlist, postRequest } from 'backendServices/ApiCalls';
import { Chip, IconButton, Tooltip, Grid } from '@mui/material';
import { FileCopy as FileCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const VISIBLE_FIELDS = ['sr', 'amount', 'status', 'details', 'rejectreason', 'createdat'];

const PayoutReports = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [copiedRows, setCopiedRows] = useState([]);
  const [usersData, setUsersData] = useState([]);

  let params = {
    status: 'all',
    type: 'payout',
    usertype: 'receiver'
  };

  const UsersData = () => {
    postRequest(
      '/selecttransactions',
      params,
      (response) => {
        if (response?.data?.status === 'success') {
          setUsersData(response?.data?.data);
        }
      },
      (error) => {
        console.log(error?.response?.data);
      }
    );
  };

  useEffect(() => {
    UsersData();
  }, []);

  const generateRowId = () => {
    return `row-${Math.random().toString(36).substr(2, 9)}`;
  };



  const rows = usersData;

  let idCounter = 1;

  const rowsWithId = rows.map((row) => ({
    ...row,
    id: idCounter++,
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
      '& .MuiInput-root': {
        borderRadius: 2,
        paddingLeft: 2,
        overflow: 'hidden',
      },
    },
  };

  const initialState = {
    initialState: {
      columns: {
        columnVisibilityModel: {
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
      field: "final_amount",
      headerName: "Final Amount",
      dataGeneratorUniquenessEnabled: true,
      width: 150,
      editable: true,
      groupable: false,
      aggregable: false,
      renderCell: (params) => `$${params.value}`
    },
    {
      field: "status",
      headerName: "Status",
      dataGeneratorUniquenessEnabled: true,
      width: 150,
      editable: true,
      groupable: false,
      aggregable: false,
    },
    {
      field: "payoutaccount1",
      headerName: "Crypto Coin",
      dataGeneratorUniquenessEnabled: true,
      width: 200,
      editable: true,
      groupable: false,
      aggregable: false,
    },
    {
      field: "payoutaccount2",
      headerName: "Wallet Address",
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
      renderCell: (params) => {
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



  return (
    <JumboDemoCard
      title={"Payout Summary"}
      wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}
    >
      <Box sx={{ height: 460, width: 1 }}>
        <DataGrid
          initialState={{
            initialState,
            pagination: { paginationModel: { pageSize: 6 } },
          }}
          rows={rowsWithId}
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
};

export default PayoutReports;

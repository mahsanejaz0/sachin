import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { getdepositlist, postRequest } from 'backendServices/ApiCalls';
import { Chip, IconButton, Tooltip, Grid } from '@mui/material';
import { FileCopy as FileCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const VISIBLE_FIELDS = ['sr', 'amount', 'hash', 'status', 'details', 'createdat'];

const DepositReport = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [copiedRows, setCopiedRows] = useState([]);
  const [usersData, setUsersData] = useState([]);

  let params = {
    status: 'all',
    type: 'deposit',
    usertype: 'sender'
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
      field: "final_amount",
      headerName: "Final Amount",
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



  return (
    <JumboDemoCard
      title={"Deposit Summary"}
      wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}
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
  );
};

export default DepositReport;

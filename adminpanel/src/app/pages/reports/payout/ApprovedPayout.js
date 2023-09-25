import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { getpayoutlist, postRequest } from 'backendServices/ApiCalls';
import { Chip,IconButton, Tooltip, Grid } from '@mui/material';
import { FileCopy as FileCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const VISIBLE_FIELDS = ['sr','receiverusername', 'amount', 'payoutaccount1', 'payoutaccount2', 'createdat'];

const ApprovedPayout = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [copiedRows, setCopiedRows] = useState([]);
  const [usersData, setUsersData] = useState([]);

  let params = {
    status: 'rejected',
    type:'payout',
    usertype:'receiver'
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



  return (
    <JumboDemoCard title={'Approved payouts'} wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}>

      <Box sx={{ height: 400, width: 1 }}>
        <DataGrid
          initialState={{
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
                },
              },
            },
            pagination: { paginationModel: { pageSize: 24 } },
          }}
          rows={rowsWithId}
          getRowId={(row) => generateRowId()}
          columns={[
            ...VISIBLE_FIELDS.map((field) => {
              if (field === 'sr') {
                return {
                  field,
                  headerName: 'Sr',
                  width: 150,
                  renderCell: (params) => <strong>{params.row.id}</strong>,
                };
              } else if (field === 'receiverusername') {
                return {
                  field,
                  headerName: 'Username',
                  width: 150,
                };
              } else if (field === 'amount') {
                return {
                  field,
                  headerName: 'Amount',
                  width: 150,
                };
              }else if (field === 'createdat') {
                return {
                  field,
                  headerName: 'Date',
                  width: 150,
                };
              }
              else if (field === 'payoutaccount1') {
                return {
                  field,
                  headerName: 'Payout Method',
                  width: 150,
                };
              }
              else if (field === 'payoutaccount2') {
                return {
                  field,
                  headerName: 'Payout Address',
                  width: 150,
                  renderCell: (params) => {
                    const isCopied = copiedRows.includes(params.row.id);
                    
                    const handleCopyClick = () => {
                      navigator.clipboard.writeText(params.value)
                        .then(() => {
                          setCopiedRows((prevCopiedRows) => [...prevCopiedRows, params.row.id]);
                        })
                        .catch((error) => {
                          console.error('Copy failed:', error);
                        });
                    };
          
                    return (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {isCopied ? (
                          <CheckCircleIcon style={{ marginRight: '4px', color: 'green' }} />
                        ) : (
                          <Tooltip title="Copy Hash" placement="top">
                            <IconButton
                              onClick={handleCopyClick}
                              size="small"
                              style={{ marginRight: '4px' }}
                            >
                              <FileCopyIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <span>{params.value}</span>
                      </div>
                    );
                  },
                };
              }
              return {
                field,
                headerName: field,
                width: 150,
              };;
            }),
            
          ]}
          slots={{ toolbar: GridToolbar }}
          sx={gridDesign}
          pageSizeOptions={[24, 48, 96]}
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

export default ApprovedPayout;

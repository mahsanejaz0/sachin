import * as React from 'react';
import Modal from '@mui/material/Modal';
import Div from "@jumbo/shared/Div";
import { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,  Paper } from '@mui/material';
import { getproduct } from 'backendServices/ApiCalls';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const KeepMountedModal = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [cartItems, setCartItems] = useState([]);
  const [imageurl, setImageUrl] = useState(null);


    const GetAllProducts = () => {
        getproduct(
          (response) => {
            setImageUrl(response?.data?.imageURL);
            if (response?.data === 'success') {
              console.log('response get Successfully');
            }
          },
          (error) => {
            console.log(error?.response?.data);
          }
        );
      };
    
      useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
        GetAllProducts();
      }, []);
    

    return (

        <Div>
            <Button variant='contained' color='warning' onClick={handleOpen}>View Order History</Button>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Div sx={style}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead style={{ fontWeight: 'bolder' }}>
                                <TableRow >
                                    <TableCell></TableCell>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {cartItems.map((item) => (
                                    <>
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <img src={`${imageurl}${item.picture}`} alt={item.title} height="40"
                                                    style={{ borderRadius: "50%", width: '40px' }} />

                                            </TableCell>
                                            <TableCell > {item.title}</TableCell>
                                            <TableCell>${item.price}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                        </TableRow>

                                    </>
                                ))}


                            </TableBody>
                        </Table>
                    </TableContainer>
                </Div>
            </Modal>
        </Div>

    );
};
export default KeepMountedModal;

import React, { useState, useEffect } from 'react';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Divider, IconButton, Icon } from '@mui/material';
import { getproduct } from 'backendServices/ApiCalls';
import { Link } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';

const Cart = () => {

  const [imageurl, setImageUrl] = useState(null);
  const { cartItems, setCartItems ,handleRemoveFromCart} = useContext(CustomProvider)

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

  // Calculate the subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

 

  if (cartItems.length === 0) {
    return (
      <Typography variant='h3' color='#F39711' p={2} bgcolor='#272727' sx={{ textAlign: 'center' }}>
        Your Cart is Empty
      </Typography>
    );
  }

  return (
    <>
      <Typography variant='h3' color='#F39711' p={2} bgcolor='#272727' sx={{ textAlign: 'center' }}>
        Your Cart
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead style={{ fontWeight: 'bolder' }}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Action</TableCell> {/* Add this cell for the delete button */}
            </TableRow>
          </TableHead>

          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img src={`${imageurl}${item.picture}`} alt={item.title} height="40"
                    style={{ borderRadius: "50%", width: '40px' }} />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleRemoveFromCart(item.id)}
                    variant="contained"
                    color='error'
                    size="small"
                    startIcon={<Delete />}>
                    Delete Item
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant='h3'
        m={1}
        p={1}
        sx={{ textAlign: 'right', margin: 3 }}
      >
        Subtotal: ${subtotal}
        <Button variant='contained' color='warning' size='small' sx={{ marginRight: 5, marginLeft: 2 }}>
          <Link to='/checkout' style={{ textDecoration: 'none', color: 'white' }}>
            Proceed To Checkout
          </Link>
        </Button>
      </Typography>
    </>
  );
};

export default Cart;

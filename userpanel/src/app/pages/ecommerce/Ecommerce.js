import { Button, Card, CardActionArea, CardContent, CircularProgress, Container, Grid, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { getproduct } from 'backendServices/ApiCalls';
import { useEffect } from 'react';
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';
import { Star } from '@mui/icons-material';


const Ecommerce = () => {

  const { addToCart, setCartItems, isLoading, setIsLoading } = useContext(CustomProvider);


  const [manageProducts, setManageProducts] = useState([])
  const [imageurl, setImageUrl] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [nonFeaturedProducts, setNonFeaturedProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const GetAllProducts = () => {
    getproduct((response) => {
      setManageProducts(response?.data?.data);
      setImageUrl(response?.data?.imageURL)
      if (response?.data === "success") { // change in everyone
        console.log("response get Successfully");
      }
    }, (error) => {
      console.log(error?.response?.data);
    })
  }

  useEffect(() => {
    GetAllProducts();
  }, [])

  useEffect(() => {
    // Separate featured and non-featured products
    const featured = manageProducts.filter(product => product.list === 1);
    const nonFeatured = manageProducts.filter(product => product.list === 0);
    setFeaturedProducts(featured);
    setNonFeaturedProducts(nonFeatured);
  }, [manageProducts]);


  return (
    <>
      <Container>
        <Typography variant='h3' color='#F39711' p={2} textAlign='center' sx={{ backgroundColor: '#272727' }}>Product Items</Typography>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Featured Products"  sx={{color : "#F39711"}}/>
          <Tab label="Non-Featured Products"  sx={{color : "#F39711"}}/>
        </Tabs>

        <Grid container spacing={2} mt={3}>
          {(selectedTab === 0 ? featuredProducts : nonFeaturedProducts).map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card>
                <CardActionArea>


                  <CardContent>
                    <img
                      height="100%"
                      width="100%"
                      src={`${imageurl}${item.picture}`}
                      alt={item.title}
                      style={{ borderRadius: "5px", border: "none", boxShadow: '0px 0px 4px 0px ' }}
                    />
                    <Typography pt={2} variant="h5" fontWeight='bold' color="darkgray">{item.title}</Typography>
                    <Typography variant="h4" color="darkgray">
                      4.5<Star sx={{ color: 'yellow', pt: 1 }} />
                    </Typography>
                    <Typography variant="h6" color="darkgray">
                      $ {item.price}
                    </Typography>

                    <Button variant="contained" color='warning' sx={{ backgroundColor: '#272727' }}
                      onClick={() => addToCart(item)} disabled={isLoading === item.id}>
                      {setIsLoading === item.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        'Add to Cart '
                      )}
                    </Button>

                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>


    </>
  )
}

export default Ecommerce

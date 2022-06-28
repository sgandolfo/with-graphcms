import { useContext, useEffect, useState } from 'react';
import { Flex, Box, Divider, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import CartContext from '../lib/context/Cart';
import graphql from '../lib/graphql';
import getProductById from '../lib/graphql/queries/getProductById';
import loadStripe from '../lib/stripe';

const Cart = () => {

  const { items } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const hasProducts = Object.keys(items).length;

  useEffect(() => {
    //only fetch data if user has selected any products
    if (!hasProducts) {
      return;
    }

    // fetch all products that are in the cart based on their IDs
    graphql.request(getProductById, {
      ids: Object.keys(items)
    })
    // Once the data is fetched, set the products state to the result of the query
      .then((data) => {
        setProducts(data.products);
      })
      .catch((err) => console.log(err));

  }, [JSON.stringify(products)]);

  const getTotal = () => {
    if (!products.length) return 0;

    return Object.keys(items).map((id) => products.find((product) => product.id === id).price * (items[id] / 100)).reduce((x,y) => x + y, 0).toFixed(2);
  };

  const handlePayment = async () => {

    const stripe = await loadStripe();

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items
      })
    });

    const { session } = await res.json();
    await stripe.redirectToCheckout({
      sessionId: session.id
    });

  };

  return (
    <Box
      rounded='xl'
      boxShadow='2xl'
      w='container.lg'
      p='16'
      bgColor='white'
    >
      <Text as='h1' fontSize='2xl' fontWeight='bold'>
        Cart
      </Text>
      <Divider my='10' />
      <Box>
        {!hasProducts ? (<Text>The cart is empty.</Text>) : (
          <>
            {products.map((product) => (
              <Flex
                key={product.id}
                justifyContent='space-between'
                mb='4'
              >
                <Box>
                  <Link href={`/product/${product.slug}`} passHref >
                    <Text
                      as='a'
                      fontWeight='bold'
                      _hover={{
                        textDecoration: 'underline',
                        color: 'blue.500'
                      }}
                    >
                      {product.name}
                      <Text
                        as='span'
                        color='gray.500'
                      >
                        {' '}
                      x {items[product.id]}
                      </Text>
                    </Text>
                  </Link>
                </Box>
                <Box>
                    €{(items[product.id] * (product.price / 100)).toFixed(2)}
                </Box>
              </Flex>
            ))}
            <Divider my='10' />
            <Flex
              alignItems='center'
              justifyContent='space-between'
            >
              <Text fontSize='xl' fontWeight='bold'>
                Total: €{getTotal()}
              </Text>
              <Button colorScheme='blue' onClick={handlePayment}> Pay Now </Button>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Cart;
import graphql from '../../lib/graphql';
import getAllProducts from '../../lib/graphql/queries/getAllProducts';
import getProductDetail from '../../lib/graphql/queries/getProductDetail';
import { Box, Flex, Grid, Text, Image, Divider, Button, Select } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import CartContext from '../../lib/context/Cart';

export const getStaticPaths = async () => {

  const { products } = await graphql.request(getAllProducts);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug,
    },
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps = async ({ params }) => {

  const { products } = await graphql.request(getProductDetail, {
    slug: params.slug
  });

  return {
    props:{
      product: products[0]
    }
  };
};

const SelectQuantity = (props) => {
  const quantity = [...Array.from({ length: 10 })];
  return (
    <Select placeholder='Quantity'
      onChange={(event) => props.onChange(event.target.value)}>
      {quantity.map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </Select>
  );
};

const ProductPage = ({ product }) => {

  const [quantity, setQuantity] = useState(0);
  const { items, setItems } = useContext(CartContext);

  const alreadyInCart = product.id in items;

  const addToCart = () => {
    setItems({
      ...items,
      [product.id]: quantity
    });
  };

  return (
    <Flex rounded='xl' boxShadow='2xl' w='full' p='16' bgColor='white'>
      <Image width='96' height='96' src={product.images[0].url} alt={product.name}/>
      <Box ml='12' width='container.xs'>
        <Text as='h1' fontSize='4xl' fontWeight='bold'>
          {product.name}
        </Text>
        <Text lineHeight='none' fontSize='xl' my='3' fontWeight='bold' textColor='blue.500'>
          €{product.price / 100}
        </Text>
        <Text maxW='96' textAlign='justify' fontSize='sm'>
          {product.description}
        </Text>
        <Divider my='6' />
        <Grid gridTemplateColumns='2fr 1fr' gap='5' alignItems='center'>
          <SelectQuantity onChange={(quantity) => setQuantity(parseInt(quantity))} />
          <Button colorScheme='blue' onClick={addToCart}>
            {alreadyInCart ? 'Update' : 'Add to cart'}
          </Button>
        </Grid>
      </Box>
    </Flex>
  );
};

export default ProductPage;
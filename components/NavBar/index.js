import { useContext } from 'react';
import Link from 'next/link';
import { Flex, Box, Button, Text } from '@chakra-ui/react';
import { MdShoppingCart } from 'react-icons/md';
import CartContext from '../../lib/context/Cart';

const NavBar = () => {

  const { items } = useContext(CartContext);

  const itemCount = Object.values(items).reduce((x,y) => x + y, 0);

  return (
    <Box position='fixed' top={0} left={0} w='full' bgColor='white' boxShadow='md'>
      <Flex width='container.xl' m='auto' p='5' justifyContent='space-between'>
        <Link href='/' passHref>
          <Text textColor='blue.800' fontWeight='bold' fontSize='2xl' as='a'>
            My e-commerce
          </Text>
        </Link>
        <Box>
          <Link href='/cart' passHref>
            <Button as='a'>
              <MdShoppingCart />
              <Text ml='3'>{itemCount}</Text>
            </Button>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { VStack, Box, Heading, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import useSWR from 'swr';


const Success = () => {

  const router = useRouter();

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data } = useSWR(
    () => `/api/checkout/${router.query.session_id}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      console.log('success');
    }
  }, [data]);

  return (
    <Box
      backgroundColor='white'
      width='50vh'
      height='20vh'
      margin='2rem auto'
    >
      <VStack width='100%' spacing='1.5rem'>
        <Box mt='5'>
          <CheckIcon color='green' />
        </Box>
        <Box>
          <Heading
            as='h1'
            fontSize='lg'
          >
              Thanks for your order!
          </Heading>
        </Box>
        <Box>
          <Text
            fontSize='sm'
          >
                Check your receipt in your inbox.
          </Text>
        </Box>
      </VStack>
    </Box>
  );

};

export default Success;
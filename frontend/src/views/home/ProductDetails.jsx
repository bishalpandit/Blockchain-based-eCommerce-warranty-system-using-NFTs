import {
    Box,
    chakra,
    Container,
    Stack,
    Text,
    Image,
    Flex,
    VStack,
    Button,
    Heading,
    SimpleGrid,
    StackDivider,
    useColorModeValue,
    VisuallyHidden,
    List,
    ListItem,
    ChakraProvider
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';

export default function Simple() {
    return (

        <ChakraProvider  resetCss={false} w="100%">
            <Container maxW={'7xl'}>
                <SimpleGrid
                    columns={{ base: 1, lg: 2 }}
                    spacing={{ base: 8, md: 10 }}
                    py={{ base: 18, md: 24 }}>
                    <Flex>
                        <Image
                            rounded={'md'}
                            alt={'product image'}
                            src={
                                'https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080'
                            }
                            fit={'cover'}
                            align={'center'}
                            w={'100%'}
                            h={{ base: '100%', sm: '400px', lg: '500px' }}
                        />
                    </Flex>
                    <Stack spacing={{ base: 6, md: 10 }}>
                        <Box as={'header'}>
                            <Heading
                                lineHeight={1.1}
                                fontWeight={600}
                                fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                                Automatic Watch
                            </Heading>
                            <Heading as='h5' size='sm' color="gray.500" ps="3">
                                By SamSung
                            </Heading>
                            <Text
                                color={useColorModeValue('gray.900', 'gray.400')}
                                fontWeight={300}
                                fontSize={'2xl'}>
                                $350.00 USD
                            </Text>
                        </Box>

                        <Stack
                            spacing={{ base: 4, sm: 6 }}
                            direction={'column'}
                            divider={
                                <StackDivider
                                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                                />
                            }>

                            <Text fontSize={'lg'}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
                                aliquid amet at delectus doloribus dolorum expedita hic, ipsum
                                maxime modi nam officiis porro, quae, quisquam quos
                                reprehenderit velit? Natus, totam.
                            </Text>
                            <Box>
                                <Heading
                                    as='h5' size='sm'
                                    fontSize={{ base: '16px', lg: '18px' }}
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    mb={'4'}>
                                    Features
                                </Heading>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                                    <List spacing={2}>
                                        <ListItem>Chronograph</ListItem>
                                        <ListItem>Master Chronometer Certified</ListItem>{' '}
                                        <ListItem>Tachymeter</ListItem>
                                    </List>
                                    <List spacing={2}>
                                        <ListItem>Anti‑magnetic</ListItem>
                                        <ListItem>Chronometer</ListItem>
                                        <ListItem>Small seconds</ListItem>
                                    </List>
                                </SimpleGrid>
                            </Box>
                            <Box>
                            <Heading
                                    as='h5' size='sm'
                                    fontSize={{ base: '16px', lg: '18px' }}
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    mb={'4'}>
                                    Product Details
                                </Heading>

                                <List spacing={2}>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Warranty:
                                        </Text>{' '}
                                        6 Months
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Between lugs:
                                        </Text>{' '}
                                        20 mm
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Bracelet:
                                        </Text>{' '}
                                        leather strap
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Case:
                                        </Text>{' '}
                                        Steel
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Case diameter:
                                        </Text>{' '}
                                        42 mm
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Dial color:
                                        </Text>{' '}
                                        Black
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Crystal:
                                        </Text>{' '}
                                        Domed, scratch‑resistant sapphire crystal with anti‑reflective
                                        treatment inside
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Water resistance:
                                        </Text>{' '}
                                        5 bar (50 metres / 167 feet){' '}
                                    </ListItem>
                                </List>
                            </Box>
                        </Stack>

                        <Button
                            w={['50%', '50%']}
                            mt={8}
                            size={'md'}
                            borderRadius={'15px'}
                            py={'7'}
                            bg={"teal.400"}
                            color={useColorModeValue('white', 'gray.900')}
                            textTransform={'uppercase'}
                            _hover={{
                                transform: 'translateY(2px)',
                                boxShadow: 'lg',
                            }}>
                            Buy Now
                        </Button>


                    </Stack>
                </SimpleGrid>
            </Container>
        </ChakraProvider>

    );
}
import { ReactNode, useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Badge,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import logo from '../../images/logo.png';
import { useEffect } from 'react';
import web3Modal from 'web3modal'
import { ethers } from "ethers";

const Links = [{ to: '/dashboard', value: 'Dashboard' }];

const NavLink = ({ children }) => (
  <Link
    to={children.to}>
    {children.value}
  </Link>
);

const CircleIcon = (props) => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fill='currentColor'
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
  </Icon>
)

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [account, setAccount] = useState('0x00000000000')
  const toast = useToast();

  async function getAccount() {
    // const accounts = await windows.ethereum.request({ method: 'eth_requestAccounts' });
    // const account = accounts[0];
    // showAccount.innerHTML = account;
    if (typeof window.ethereum !== 'undefined') {
      // const acc = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // console.log(acc)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const acc = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      console.log(acc[0])
      setAccount(acc[0])
      console.log(account)
      toast({
        title: "Metamask Connected",
        description: `Address : ${account}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
    });
    } else {
      toast({
        title: "Metamask Not Found",
        description: "Instal Metamask",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
    });
    }
  }

  window.ethereum.on('chainChanged', (chainId) => {
    window.location.reload();
  });

  window.ethereum.on('accountsChanged', (accounts) => {
    setAccount(accounts[0])
    toast({
      title: "Account Changed",
      description: `Address :${account}`,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  });

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Link p={2} to="/">
              <img src={logo} alt="logo" width="65px" />
            </Link>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.value}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Button
              variant={'solid'}
              colorScheme={'teal'}
              size={'sm'}
              mr={4}
              leftIcon={account === '' ? <AddIcon />: <CircleIcon boxSize={4} />}
              onClick={getAccount}
              >
              {account === '' ? "Connect to wallet" : "Connected"}
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <Badge colorScheme='twitter' variant='outline'>Address: {account}</Badge>
                <br />{" "}
                <MenuItem>Your Product for Sale</MenuItem>
                <MenuItem>Transfer Ownership</MenuItem>
                <MenuItem>Create your Product</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
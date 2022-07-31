import { ReactNode, useCallback, useState } from 'react';
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
  useColorMode,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import logo from '../../images/logo.png';
import { useEffect } from 'react';
import web3Modal from 'web3modal'
import { ethers } from "ethers";
import { BiUserCircle } from 'react-icons/bi';

const Links = [{ to: '/dashboard', value: 'Dashboard' },
{ to: '/verify/', value: 'Verify Ownership' },
];

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
  const [account, setAccount] = useState('')
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  async function getAccount() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const acc = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      console.log(acc[0])
      setAccount(acc[0])
      toast({
        title: "Metamask Connected",
        description: `Address : ${acc[0]}`,
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

  const onAccountChange = useCallback(
    (accounts) => {
      setAccount(accounts[0]);
      if (accounts[0] !== account) {
        toast({
          title:  `${!accounts[0]? "Disconnected": `Account Changed`}`,
          description: `${!accounts[0]? '': `Address ${accounts[0]}`}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    },
    [setAccount, account],
  );

  useEffect(() => {
    if (account) {
      window.ethereum.on('accountsChanged', onAccountChange);
      return () => {
        window.ethereum.removeListener('accountsChanged', onAccountChange);
      }
    }
  }, [window, onAccountChange])


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
              leftIcon={account  ?  <CircleIcon boxSize={4} />: <AddIcon /> }
              onClick={getAccount}
            >
              {account?  "Connected": "Connect to wallet"}
            </Button>
            <Button mr={4} onClick={toggleColorMode}>
              {colorMode === 'light' ? 'Dark' : 'Light'}
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
                    <BiUserCircle />
                  }
                />
              </MenuButton>
              <MenuList>
                {
                  account &&
                  <MenuItem><Badge colorScheme='twitter' variant='outline'>Address: {account}</Badge></MenuItem>
                }
                <Link to="/dashboard/create-product">
                  <MenuItem>Create Product</MenuItem>
                </Link>
                <Link to="/dashboard">
                  <MenuItem>Purchase History</MenuItem>
                </Link>
                <Link to="/verify">
                  <MenuItem>Verify Ownership</MenuItem>
                </Link>
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
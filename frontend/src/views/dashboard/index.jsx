import {
  Box
} from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom'

import SidebarWithHeader from '../../components/layout/Sidebar';
import CreateProduct from './CreateProduct';
import Main from './Main';

//Provides Layout and Routing for Dashboard

function index() {
  return (
    <Box>
      <SidebarWithHeader>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/create-product' element={<CreateProduct />}/>
        </Routes>
      </SidebarWithHeader>
    </Box>
  )
}

export default index
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import Dashboard from './views/dashboard'
import Home from './views/home'
import NotFound from './components/NotFound'
import CreateProduct from './views/dashboard/CreateProduct'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />}/>
            <Route path='/*' element={<Home />} />
            <Route path="*" element={<NotFound />} />
         
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

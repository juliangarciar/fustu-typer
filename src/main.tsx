import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"
import Game from './game'
import { setAxiosFactory, setBaseUrl } from './api/axios-client'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'
import axios, { AxiosError } from 'axios'

const theme = extendTheme({
    colors: {
        brand: {
            100: "#f7fafc",
            900: "#1a202c",
        },
    },
    fonts: {
        heading: `Inter, sans-serif`,
        body: `Inter, 'Raleway', sans-serif`,
    },
});

const queryClient = new QueryClient();

setBaseUrl('http://localhost:3333');
setAxiosFactory(() => {

    axios.interceptors.request.use((config: any) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
    });

    return axios;
})


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
            <Game />
        </ChakraProvider>
    </QueryClientProvider>
)

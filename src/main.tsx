import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"
import Game from './game'

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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ChakraProvider theme={theme}>
        <Game />
    </ChakraProvider>
)

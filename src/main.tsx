import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import axios from 'axios'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { setAxiosFactory, setBaseUrl } from './api/axios-client'
import Game from './game'
import './index.css'

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

if (process.env.NODE_ENV == 'development') {
    setBaseUrl("http://localhost:3333");
}

setAxiosFactory(() => {

    axios.interceptors.request.use((config: any) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
    });

    axios.interceptors.response.use((config) => {
        // WHY is this hack necessary!?
        if (config.status < 300)
            config.status = 201;
        return config;
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

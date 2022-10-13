import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import axios from 'axios'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { setAxiosFactory, setBaseUrl } from './api/axios-client'
import { TyperGameStateProvider } from './common/typer-gamestate-context'
import './index.css'
import { TyperMain } from './typer-main'

const theme = extendTheme({
    fonts: {
        heading: `Inter, sans-serif`,
        body: `Inter, 'Raleway', sans-serif`,
        mono: "Menlo, monospace",
    },
    fontSizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "0.875rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
        "8xl": "6rem",
        "9xl": "8rem",
    },
    fontWeights: {
        hairline: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
    },
    lineHeights: {
        normal: "normal",
        none: 1,
        shorter: 1.25,
        short: 1.375,
        base: 1.5,
        tall: 1.625,
        taller: "2",
        "3": ".75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "7": "1.75rem",
        "8": "2rem",
        "9": "2.25rem",
        "10": "2.5rem",
    },
    letterSpacings: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
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
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
            <TyperGameStateProvider>
                <TyperMain />
            </TyperGameStateProvider>
        </ChakraProvider>
    </QueryClientProvider>
)

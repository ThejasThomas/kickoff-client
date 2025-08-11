import { store } from "@/store/store";
import type React from "react";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "./ToastContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


export  function  AppProvider({children } :{children:React.ReactNode}) {
    return (
        <StrictMode>
            <Provider store={store}>
            <QueryClientProvider client={queryClient}>

            
                <ToastContainer>{children}</ToastContainer>
            
            </QueryClientProvider>
            </Provider>

        </StrictMode>
    )
}
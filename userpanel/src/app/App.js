import React, {Suspense} from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import JumboApp from "@jumbo/components/JumboApp";
import AppLayout from "./AppLayout";
import JumboTheme from "@jumbo/components/JumboTheme";
import AppRoutes from "./AppRoutes";
import configureStore, {history} from './redux/store';
import JumboDialog from "@jumbo/components/JumboDialog";
import JumboDialogProvider from "@jumbo/components/JumboDialog/JumboDialogProvider";
import JumboAuthProvider from "@jumbo/components/JumboAuthProvider/JumboAuthProvider";
import BasicAuth from "./auth-providers/BasicAuth/BasicAuth";
import { SnackbarProvider } from "notistack";
import AppProvider from "./AppProvider";
import {config} from "./config/main";
import JumboRTL from "@jumbo/JumboRTL/JumboRTL";
import Spinner from "./shared/Spinner";
import { useEffect } from "react";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const store = configureStore();


function App() {
    useEffect(() => {
        window.addEventListener('error', e => {
          if (e.message === 'ResizeObserver loop limit exceeded' || e.message === 'Script error.') {
            const resizeObserverErrDiv = document.getElementById(
              'webpack-dev-server-client-overlay-div'
            )
            const resizeObserverErr = document.getElementById(
              'webpack-dev-server-client-overlay'
            )
            if (resizeObserverErr) {
              resizeObserverErr.setAttribute('style', 'display: none');
            }
            if (resizeObserverErrDiv) {
              resizeObserverErrDiv.setAttribute('style', 'display: none');
            }
          }
        })
      }, [])
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <BrowserRouter history={history}>
                    <AppProvider>
                        <JumboApp activeLayout={config.defaultLayout}>
                            <JumboTheme init={config.theme}>
                                <JumboRTL>
                                    <JumboDialogProvider>
                                        <JumboDialog/>
                                        <SnackbarProvider
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            maxSnack={3}>
                                            <JumboAuthProvider>
                                            <BasicAuth>
                                            <AppLayout>
                                                <Suspense fallback={<Spinner/>}>
                                                    <AppRoutes/>
                                                </Suspense>
                                            </AppLayout>
                                            </BasicAuth>
                                            </JumboAuthProvider>
                                        </SnackbarProvider>
                                    </JumboDialogProvider>
                                </JumboRTL>
                            </JumboTheme>
                        </JumboApp>
                    </AppProvider>
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    );
}

export default App;

import React from "react";
import { ConnectedRouter } from "react-router-redux";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "assets/vendors/style";
import "styles/wieldy.less";
import configureStore, { history } from "./appRedux/store";
import Main from "./pages/entry";
import Trial from "./pages/Trial";

export const store = configureStore();
const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<BrowserRouter>
						<Routes>
							<Route path="/*" element={<Main />} />
						</Routes>
					</BrowserRouter>
				</ConnectedRouter>
			</Provider>
		</QueryClientProvider>
	);
};

export default App;

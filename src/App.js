import React from "react";
import { ConnectedRouter } from "react-router-redux";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "assets/vendors/style";
import "styles/wieldy.less";
import configureStore from "./appRedux/store";
import Main from "./pages/Main";

export const store = configureStore();
const queryClient = new QueryClient();

const App = () => {
	const test={name:"Hello"}
	const test1=test?.name
	console.log(test1)
	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<BrowserRouter>
					<Routes>
						<Route path="/*" element={<Main />} />
					</Routes>
				</BrowserRouter>
			</Provider>
		</QueryClientProvider>
	);
};

export default App;

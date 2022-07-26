import React from "react";
import { ConnectedRouter } from "react-router-redux";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";

import "assets/vendors/style";
import "styles/wieldy.less";
import configureStore, { history } from "./appRedux/store";
import Main from "./pages/entry";

export const store = configureStore();

const App = () => (
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<Switch>
				<Route path="/" component={Main} />
			</Switch>
		</ConnectedRouter>
	</Provider>
);

export default App;

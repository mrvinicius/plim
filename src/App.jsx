import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';
import NavBar from './nav-bar';
import BottomBar from './bottom-bar/Bottom-bar';
import ShoppingList from './shopping-list/Shopping-list';
import PurchaseHistory from './purchase-history/Purchase-history';

export const AppContext = React.createContext()

function App() {
	const [isNavOpen, setIsNavOpen] = useState(false);

	return (
		<div id="app" className="App">
			<Router>
				<NavBar isOpen={isNavOpen} close={() => setIsNavOpen(false)} />

				<AppContext.Provider value={() => setIsNavOpen(true)}>
					<Route exact path="/" component={ShoppingList} />
					<Route path="/history" component={PurchaseHistory} />
				</AppContext.Provider>

				{/* <BottomBar>
					<Switch>
						<Route exact path="/" render={() =>
							<button className="btn black-light">
								<img src={process.env.PUBLIC_URL + '/play-circle.svg'} className="btn__icon" alt="" />
								Iniciar compra
							</button>
						} />
					</Switch>
				</BottomBar> */}
			</Router>
			{/* 
			<div id="bottomBarWrapper"
				role="toolbar"
				className="Bottom-bar white side-gaps-pad" /> */}

		</div>
	);
}


export default App;
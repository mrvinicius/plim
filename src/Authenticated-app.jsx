import React, { useState } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	// Switch
} from "react-router-dom";

import './Authenticated-app.css';
import NavBar from './global/nav-bar';
// import BottomBar from './global/bottom-bar/Bottom-bar';
import ShoppingList from './shopping-list/Shopping-list';
import PurchaseHistory from './purchase-history/Purchase-history';

export const AppContext = React.createContext()

function AuthenticatedApp() {
	const [isNavOpen, setIsNavOpen] = useState(false);

	function toggleNav(isOpen) {
		document.body.style.overflow = isOpen ? 'hidden' : 'auto'
		setIsNavOpen(isOpen)
	}

	return (
		<div className="App">
			<Router>
				<NavBar isOpen={isNavOpen} close={() => toggleNav(false)} />

				<AppContext.Provider value={{ toggleNav, isNavOpen }}>
					<Route exact path="/" component={ShoppingList} />
					<Route path="/history" component={PurchaseHistory} />
					<Route path="/entrar" render={props => <Redirect to="/" />} />
					<Route path="/cadastro" render={props => <Redirect to="/" />} />
				</AppContext.Provider>

				{/* <BottomBar>
					<Switch>
						<Route exact path="/" render={() =>
							<button className="btn black-light">
								<img src={process.env.PUBLIC_URL + '/icons/play-circle.svg'} className="btn__icon" alt="" />
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


export default AuthenticatedApp;
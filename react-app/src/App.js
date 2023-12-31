import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage/index.js";
import ProductDetail from "./components/ProductDetail";
import ShoppingCart from "./components/ShoppingCart";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/shoppingCart'>
            <ShoppingCart />
          </Route>
          <Route exact path="/" >
            <SplashPage />
          </Route>
          <Route exact path="/:category" >
            <SplashPage />
          </Route>
          <Route exact path='/products/:productId/display'>
            <ProductDetail />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;

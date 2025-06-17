//router
// import IndexRouters from "./router/index"

//scss
import "./assets/scss/socialv.scss";
import "./assets/scss/customizer.scss";
import socket from "./socket";

// Redux Selector / Action
import { useDispatch, useSelector } from "react-redux";

// import state selectors
import { setSetting } from "./store/setting/actions";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";


function App(props) {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(setSetting());
  }, [dispatch]);

  

  return (
    <div className="App">
      {/* <IndexRouters /> */}
      {props.children}
      <ToastContainer />
    </div>
  );
}

export default App;

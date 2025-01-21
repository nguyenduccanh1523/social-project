//router
// import IndexRouters from "./router/index"

//scss
import "./assets/scss/socialv.scss";
import "./assets/scss/customizer.scss";

// Redux Selector / Action
import { useDispatch } from "react-redux";

// import state selectors
import { setSetting } from "./store/setting/actions";
import { useEffect } from "react";

function App(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSetting());
  }, [dispatch]);
  return (
    <div className="App">
      {/* <IndexRouters /> */}
      {props.children}
    </div>
  );
}

export default App;

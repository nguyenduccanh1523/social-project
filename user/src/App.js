import { Routes, Route } from "react-router-dom";
import LoginForm from "./views/auth/login"
import Home from "./views/app/home"


function App() {
  return (
    <div className=" bg-primary">
      <Routes>
        <Route path="login" element={<LoginForm />} />
        <Route path="/*" element={<Home />} />
        {/* <Route path={path.home} element={<Home />}>
          <Route path="*" element={<Homepage />} />
          <Route path={path.register} element={<Login />} />
          <Route path={path.login} element={<Login />} />
          <Route path={path.CHO_THUE_CAN_HO} element={<RentalApartment />} />
          <Route path={path.CHO_THUE_MAT_BANG} element={<RentalSpace />} />
          <Route path={path.CHO_THUE_PHONG_TRO} element={<RentalRoom />} />
          <Route path={path.NHA_CHO_THUE} element={<RentalHouse />} />
          <Route path={path.TIM_NGUOI_O_GHEP} element={<FindRoomate />} />
          <Route path={path.DETAL_POST__TITLE__POSTID} element={<DetailPost />} />
          <Route path={'chi-tiet/*'} element={<DetailPost />} />
        </Route> */}
      </Routes>
    </div>
  );
}

export default App;

import React from "react";
// import Sidebar from "./Sidebar";
import Header from "../../components/partials/header";
import Footer from "../../components/partials/footer";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* <Sidebar /> */}
      <Header />
      <div className="flex flex-col min-h-screen">
        {/* Main content */}
        <div className="flex-grow">
          <Outlet />
        </div>
        {/* Footer */}
        <Footer />
        {/* <RightSidebar /> */}
      </div>
    </>
  );
};

export default Home;
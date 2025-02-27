import React from "react";

// auth
// import ConfirmMail from "../views/dashboard/auth/confirm-mail";
// import LockScreen from "../views/dashboard/auth/lock-screen";
// import Recoverpw from "../views/dashboard/auth/recoverpw";
import SignIn from "../views/dashboard/auth/sign-in";
import SignUp from "../views/dashboard/auth/sign-up";

// errors
import Error404 from "../views/dashboard/errors/error404";
import Error500 from "../views/dashboard/errors/error500";


//extrpages



export const SimpleRouter = [
  
//   {
//     path: "auth/confirm-mail",
//     element: <ConfirmMail />,
//   },
//   {
//     path: "auth/lock-screen",
//     element: <LockScreen />,
//   },
//   {
//     path: "auth/recoverpw",
//     element: <Recoverpw />,
//   },
  
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
  {
    path: "*",
    element: <Error500 />,
  }
//   {
//     path: "extra-pages/pages-comingsoon",
//     element: <ComingSoon />,
//   },
];

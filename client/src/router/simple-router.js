import React from "react";

// auth
// import ConfirmMail from "../views/dashboard/auth/confirm-mail";
// import LockScreen from "../views/dashboard/auth/lock-screen";
// import Recoverpw from "../views/dashboard/auth/recoverpw";
import SignIn from "../views/dashboard/auth/sign-in";
import SignUp from "../views/dashboard/auth/sign-up";
import ResetPassword from "../views/dashboard/auth/resetPassword";

// errors
import Error404 from "../views/dashboard/errors/error404";
import Error500 from "../views/dashboard/errors/error500";
import ForgotPassword from "../views/dashboard/auth/forgot-password";
import Recoverpw from "../views/dashboard/auth/confirm-mail";

//extrpages



export const SimpleRouter = [


  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/confirm-mail",
    element: <Recoverpw />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "*",
    element: <Error404 />,
  },
  {
    path: "*",
    element: <Error500 />,
  },
  
//   {
//     path: "extra-pages/pages-comingsoon",
//     element: <ComingSoon />,
//   },
];

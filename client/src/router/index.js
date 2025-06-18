import React from "react";

//layoutpages
import Default from "../layouts/dashboard/default";
import { DefaultRouter } from "./default-router";
import ProtectedRoute from "./ProtectedRoute";
import Maintenance from "../views/dashboard/errors/maintaince";
import AdminRoutes from "../routes/admin.routes";

const isMaintaince = process.env.REACT_APP_MAINTAINCE === "true";

export const IndexRouters = [
  {
    path: "/",
    element: isMaintaince ? <Maintenance /> : (
      <ProtectedRoute>
        <Default />
      </ProtectedRoute>
    ),
    children: [
      ...DefaultRouter,
      ...(isMaintaince ? [] : [{ path: "/pages-maintenance", element: <Maintenance /> }]),
    ],
  },
  {
    path: "/admin/*",
    element: <AdminRoutes />
  },
  ...(isMaintaince ? [{ path: "*", element: <Maintenance /> }] : []),
];

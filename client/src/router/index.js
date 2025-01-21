import React from "react";

//layoutpages
import Default from "../layouts/dashboard/default";

import { DefaultRouter } from "./default-router";
import ProtectedRoute  from "./ProtectedRoute";
//import { Layout1Router } from "./layout1-router";

export const IndexRouters = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Default />
      </ProtectedRoute>
    ),
    children: [...DefaultRouter],
  },
];

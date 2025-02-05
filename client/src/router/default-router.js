import Homepage from "../views/dashboard/app/home";
import PrivacyPolicy from "../views/dashboard/extrapages/privacy-policy";
import TermsofService from "../views/dashboard/extrapages/terms-of-service";
import UserProfile from "../views/dashboard/app/user-profile";
import Groups from "../views/dashboard/app/groups";

export const DefaultRouter = [
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-of-service",
    element: <TermsofService />,
  },
  {
    path:"/user-profile",
    element:<UserProfile/>
  },
  {
    path:"/groups",
    element:<Groups/>
  }
];

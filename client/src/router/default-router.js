import Homepage from "../views/dashboard/app/home";
import PrivacyPolicy from "../views/dashboard/extrapages/privacy-policy";
import TermsofService from "../views/dashboard/extrapages/terms-of-service";
import UserProfile from "../views/dashboard/app/user-profile";
import Groups from "../views/dashboard/app/groups";
import MyGroups from "../views/dashboard/app/my-group";
import GroupDetail from "../views/dashboard/app/group-detail";
import Chat from "../views/dashboard/app/chat";
import Blog from "../views/dashboard/app/blog";
import Pages from "../views/dashboard/app/pages";
import PageLists from "../views/dashboard/component/pages/pageLists"
import PageDetail from "../views/dashboard/component/pages/page-detail"

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
  },
  {
    path:"/my-groups",
    element:<MyGroups/>
  },
  {
    path:"/group-detail/:id",
    element:<GroupDetail/>
  },
  {
    path:"/chat",
    element:<Chat/>
  },
  {
    path:"/blogs",
    element:<Blog />
  },
  {
    path:"/pages",
    element:<Pages />
  },
  {
    path:"/page-lists/:id",
    element:<PageLists />
  },
  {
    path:"/page/:id",
    element:<PageDetail />
  }
];

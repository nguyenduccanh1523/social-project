import Homepage from "../views/dashboard/app/home";
import PrivacyPolicy from "../views/dashboard/extrapages/privacy-policy";
import TermsofService from "../views/dashboard/extrapages/terms-of-service";
import UserProfile from "../views/dashboard/app/user-profile";
import Groups from "../views/dashboard/app/groups";
import MyGroups from "../views/dashboard/component/Group/my-group";
import GroupDetail from "../views/dashboard/component/Group/group-detail";
import Chat from "../views/dashboard/app/chat";
import Blog from "../views/dashboard/app/blog";
import Pages from "../views/dashboard/app/pages";
import MyPage from "../views/dashboard/component/pages/my-pages";
import PageLists from "../views/dashboard/component/pages/pageLists"
import PageDetail from "../views/dashboard/component/pages/page-detail"
import Faq from "../views/dashboard/component/Support/Fag"
import Guider from "../views/dashboard/component/Support/Guider"
import Contact from "../views/dashboard/component/Support/Contact"
import Update from "../views/dashboard/component/Support/Update"
import UserPrivacySetting from "../views/dashboard/component/SettingUser/privacyUser"
import UserAccountSetting from "../views/dashboard/component/SettingUser/accountSetting"
import Story from "../views/dashboard/app/story"
import Event from "../views/dashboard/app/event"
import ProfileEvent from "../views/dashboard/component/Event/myEvent"
import EventDetail from "../views/dashboard/component/Event/detail"
import MarkPost from "../views/dashboard/app/markpost"
import ListPost from "../views/dashboard/component/MarkPost/ListPost"
import ListBlog from "../views/dashboard/component/MarkPost/ListBlog"
import FriendList from "../views/dashboard/component/Friends/FriendList"
import FriendRequest from "../views/dashboard/component/Friends/FriendRequest"
import FriendProfile from "../views/dashboard/component/Friends/FriendProfile"
import MyBlog from "../views/dashboard/component/Blog/MyBlog";
import Notification from "../views/dashboard/app/notification";
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
    path: "/user-profile",
    element: <UserProfile />
  },
  {
    path: "/groups",
    element: <Groups />
  },
  {
    path: "/my-groups",
    element: <MyGroups />
  },
  {
    path: "/group-detail/:id",
    element: <GroupDetail />
  },
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/blogs",
    element: <Blog />
  },
  {
    path: "my-blogs",
    element: <MyBlog />
  },
  {
    path: "/my-pages",
    element: <MyPage />
  },
  {
    path: "/pages",
    element: <Pages />
  },
  {
    path: "/page-lists/:id",
    element: <PageLists />
  },
  {
    path: "/page/:id",
    element: <PageDetail />
  },
  {
    path: "/faq",
    element: <Faq />
  },
  {
    path: "/guide",
    element: <Guider />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/update",
    element: <Update />
  },
  {
    path: "/privacy-setting",
    element: <UserPrivacySetting />
  },
  {
    path: "/account-setting",
    element: <UserAccountSetting />
  },
  {
    path: "/stories",
    element: <Story />
  },
  {
    path: "/events",
    element: <Event />
  },
  {
    path: "/my-events",
    element: <ProfileEvent />
  },
  {
    path: "/event-detail/:id",
    element: <EventDetail />
  },
  {
    path: "/mark-post",
    element: <MarkPost />
  },
  {
    path: "/mark-post/post",
    element: <ListPost />
  },
  {
    path: "/mark-post/blog",
    element: <ListBlog />
  },
  {
    path: "/friend-list",
    element: <FriendList />
  },
  {
    path: "/friend-request",
    element: <FriendRequest />
  },
  {
    path: "/friend-profile/:id",
    element: <FriendProfile />
  },
  {
    path: "/notification",
    element: <Notification />
  }


];

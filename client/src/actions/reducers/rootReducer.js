import authReducer from "./authReducer";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import { persistReducer } from "redux-persist";
import  userReducer  from "./userReducer";
import userSocialsReducer from "./userSocialReducer";
import friendReducer from "./friendReducer";
import groupReducer from "./groupReducer";
import postReducer from "./postReducer";
import mediaReducer from "./mediaReducer";
import tagReducer from "./tagReducer";
import converReducer from "./converReducer";
import participantReducer from "./participantReducer";
import supportReducer from "./supportReducer";
import nationReducer from "./nationReducer";
import reportReducer from "./reportReducer";

const commonConfig = {
    storage,
    stateReconciler: autoMergeLevel2
}

const authConfig = {
    ...commonConfig,
    key: 'auth',
    whitelist: ['isLoggedIn', 'token']
}

const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    user: userReducer,
    userSocials: userSocialsReducer,
    friend: friendReducer,
    group: groupReducer,
    post: postReducer,
    media: mediaReducer,
    tag: tagReducer,
    conversation: converReducer,
    participant: participantReducer,
    support: supportReducer,
    nation: nationReducer,
    report: reportReducer
})

export default rootReducer
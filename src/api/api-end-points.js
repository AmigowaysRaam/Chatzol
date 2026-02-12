const BASE_URL = "https://chatzol.scriptzol.in/";


// https://alpha-verse.com/api/?url=generate-token

export const API_BASE_URL = `${BASE_URL}api/?url=`;

/* ******  Authentication APIs Start ****** */

const APP_GENERATE_TOKEN = {
  url: `${API_BASE_URL}generate-token`,
  method: "POST",
  responseDataKey: "data",
};

const REGISTER_USER = {
  url: `${API_BASE_URL}app-register-user`,
  method: "POST",
  responseDataKey: "",
};

const REGISTER_USER_CONFIRM = {
  url: `${API_BASE_URL}register-user-confirm`,
  method: "POST",
};

const REGISTER_USER_CONFIRM_PIN = {
  url: `${API_BASE_URL}app-register-user-confirm-pin`,
  method: "POST",
};

const LOGIN_USER = {
  url: `${API_BASE_URL}app-login-user`,
  method: "POST",
};

const LOGIN_USER_CONFIRM_PIN = {
  url: `${API_BASE_URL}app-login-user-confirm-pin`,
  method: "POST",
};

const FORGOT_USER_MPIN = {
  url: `${API_BASE_URL}forgot-user-mpin`,
  method: "POST",
};

const RESET_USER_MPIN = {
  url: `${API_BASE_URL}reset-user-mpin`,
  method: "POST",
};

const EDIT_PROFILE_USER = {
  url: `${API_BASE_URL}app-edit-profile-user`,
  method: "POST",
};

const UPDATE_PROFILE_USER = {
  url: `${API_BASE_URL}app-update-profile-user`,
  method: "POST",
};

const UPDATE_PROFILE_USER_NEW_PHONE = {
  url: `${API_BASE_URL}update-profile-user-new-phone`,
  method: "POST",
};

const CHANGE_USER_MPIN = {
  url: `${API_BASE_URL}change-user-mpin`,
  method: "POST",
};

const SEARCH_USER = {
  url: `${API_BASE_URL}app-search-user`,
  method: "POST",
};

const LIST_CONVERSATION = {
  url: `${API_BASE_URL}app-list-conversation`,
  method: "POST",
};

const LIST_MESSAGES = {
  url: `${API_BASE_URL}app-list-messages`,
  method: "POST",

};

const SEND_MESSAGE = {
  url: `${API_BASE_URL}app-send-message`,
  method: "POST",
};

const CREATE_CONVERSATION = {
  url: `${API_BASE_URL}app-create-conversation`,
  method: "POST",
};

const CHECK_FLAMES = {
  url: `${API_BASE_URL}app-check-flames`,
  method: "POST",
};

const CREATE_COMMUNITY = {
  url: `${API_BASE_URL}app-create-community`,
  method: "POST",
};

const ADD_GROUP_COMMUNITY = {
  url: `${API_BASE_URL}app-add-group-community`,
  method: "POST",
};

const CHANGE_PASSWORD_API = {
  url: `${API_BASE_URL}app-change-user-password`,
  method: "POST",
};
const CHECKEMAILEXIST = {
  url: `${API_BASE_URL}app-forgot-user-password`,
  method: "POST",
};

const CREATE_PASSWORDON_FORGET = {
  url: `${API_BASE_URL}app-update-user-password`,
  method: "POST",

};

const CREATE_GROUP_API = {
  url: `${API_BASE_URL}app-create-group`,
  method: "POST",

};

const SENDGROUP_MESSAGE = {
  url: `${API_BASE_URL}app-send-message-group`,
  method: "POST",
};
const LIST_GROUP_MESSAGES = {
  url: `${API_BASE_URL}app-list-messages-group`,
  method: "POST",
};

// GETUSERGROUP
const GETUSERGROUP = {
  url: `${API_BASE_URL}app-list-groups`,
  method: "POST",
};
// GETCOMMUNITYLIST
const GETCOMMUNITYLIST = {
  url: `${API_BASE_URL}app-list-community`,
  method: "POST",
};

// GET_GROUP_DETAILS_BY_ID
const GET_GROUP_DETAILS_BY_ID = {
  url: `${API_BASE_URL}app-group-detail`,
  method: "POST",
};

// ADD_GROUP_MEMBERS
const ADD_GROUP_MEMBERS = {
  url: `${API_BASE_URL}app-add-members-group`,
  method: "POST",
};

// GET_USERSLAM_QUESTIONS
const GET_USERSLAM_QUESTIONS = {
  url: `${API_BASE_URL}app-slam-book`,
  method: "POST",
};
// SEND_SLAM_TO_USER
const SEND_SLAM_TO_USER = {
  url: `${API_BASE_URL}app-send-slam-book-message`,
  method: "POST",
};

const GET_SLAM_QUESTION_FROM_USER = {
  url: `${API_BASE_URL}app-slam-book-conversation`,
  method: "POST",
};

const UPDATE_FCM_TOKEN = {
  url: `${API_BASE_URL}app-user-update-fcm-token`,
  method: 'POST',
  responseDataKey: 'data',
};

// SENT_ANSWERS_SLAMBOOK
const SENT_ANSWERS_SLAMBOOK = {
  url: `${API_BASE_URL}app-send-slam-book-message-reply`,
  method: 'POST',
  responseDataKey: 'data',
};

// GET_STICKERS_LIST
const GET_STICKERS_LIST = {
  url: `${API_BASE_URL}app-chat-stickers`,
  method: 'POST',
  responseDataKey: 'data',
};

// GET_WALLPAPER_LIST
const GET_WALLPAPER_LIST = {
  url: `${API_BASE_URL}app-wallpapers`,
  method: 'POST',
  responseDataKey: 'data',
};
// GET_SLAM_CONVO
const GET_SLAM_CONVO = {
  url: `${API_BASE_URL}app-slam-book-conversation-users`,
  method: 'POST',
  responseDataKey: 'data',
};

// SEND_COMMUNITY_MESSAGE
const SEND_COMMUNITY_MESSAGE = {
  url: `${API_BASE_URL}app-send-community-group`,
  method: 'POST',
  responseDataKey: 'data',
};

// LIST_COMMUNITY_MESSAGES
const LIST_COMMUNITY_MESSAGES = {
  url: `${API_BASE_URL}app-list-community-messages`,
  method: 'POST',
  responseDataKey: 'data',
};



// CHANGE_WALLPAPER_API
const CHANGE_WALLPAPER_API = {
  url: `${API_BASE_URL}app-update-bg`,
  method: 'POST',
  responseDataKey: 'data',
};

// REMOVE_MEMBER
const REMOVE_MEMBER = {
  url: `${API_BASE_URL}app-remove-members-group`,
  method: 'POST',
  responseDataKey: 'data',
};

// GET_COMMUNITY_DETAILS_BY_ID
const GET_COMMUNITY_DETAILS_BY_ID = {
  url: `${API_BASE_URL}app-community-detail`,
  method: 'POST',
  responseDataKey: 'data',
};

// 
const REMOVE_GROUP_MEMBER = {
  url: `${API_BASE_URL}app-remove-group-community`,
  method: 'POST',
  responseDataKey: 'data',
};

// GET_SITE_DATA
const GET_SITE_DATA = {
  url: `${API_BASE_URL}get-front-settings`,
  method: 'POST',
  responseDataKey: 'data',
};

// ALLOWCOMMUNITY
const ALLOWCOMMUNITY = {
  url: `${API_BASE_URL}app-allow-add-community`,
  method: 'POST',
  responseDataKey: 'data',
};

const UPDATE_USER_STATUS = {
  url: `${API_BASE_URL}app-update-user-connectivity`,
  method: 'POST',
  responseDataKey: 'data',
};


const GET_USER_STATUS = {
  url: `${API_BASE_URL}app-get-user-connectivity`,
  method: 'POST',
  responseDataKey: 'data',
};
// BLOCK_USER_BY_ID
const BLOCK_USER_BY_ID = {
  url: `${API_BASE_URL}app-block-user`,
  method: 'POST',
  responseDataKey: 'data',
};

// GET_BLOCKED_USER_LIST
const GET_BLOCKED_USER_LIST = {
  url: `${API_BASE_URL}app-blocked-user-list`,
  method: 'POST',
  responseDataKey: 'data',
};

// REPORT_USER_BY_ID
const REPORT_USER_BY_ID = {
  url: `${API_BASE_URL}app-report-user`,
  method: 'POST',
  responseDataKey: 'data',
};

// 
const DELETE_MESSAGES = {
  url: `${API_BASE_URL}app-delete-message`,
  method: 'POST',
  responseDataKey: 'data',
};

// DELETE_GROUP_MESSAGES
const DELETE_GROUP_MESSAGES = {
  url: `${API_BASE_URL}app-delete-message-group`,
  method: 'POST',
  responseDataKey: 'data',
};

// MUTE_API

const MUTE_API = {
  url: `${API_BASE_URL}app-mute-unmute-conversation`,
  method: 'POST',
  responseDataKey: 'data',
};

// DELETE_CONVO_API

const DELETE_CONVO_API = {
  url: `${API_BASE_URL}app-delete-conversation`,
  method: 'POST',
  responseDataKey: 'data',
};

// REACT_CONVO_MESSAGES
const REACT_CONVO_MESSAGES = {
  url: `${API_BASE_URL}app-react-message`,
  method: 'POST',
  responseDataKey: 'data',
};

// STAR_MESSAGE_CONVO_API
const STAR_MESSAGE_CONVO_API = {
  url: `${API_BASE_URL}app-star-message`,
  method: 'POST',
  responseDataKey: 'data',
};

// GET_STARTED_MESSAGE
const GET_STARTED_MESSAGE = {
  url: `${API_BASE_URL}app-starred-messages`,
  method: 'POST',
  responseDataKey: 'data',
};

// MAKE_FAV_CONVO
const MAKE_FAV_CONVO = {
  url: `${API_BASE_URL}app-favourite-conversation`,
  method: 'POST',
  responseDataKey: 'data',
};

// UNSTAR_MESSAGES_API
const UNSTAR_MESSAGES_API = {
  url: `${API_BASE_URL}app-unstar-all-messages`,
  method: 'POST',
  responseDataKey: 'data',
};

// PIN_CHAT_API
const PIN_CHAT_API = {
  url: `${API_BASE_URL}app-pin-conversation`,
  method: 'POST',
  responseDataKey: 'data',
};

// MESSAGE_FORWARD_API
const MESSAGE_FORWARD_API = {
  url: `${API_BASE_URL}app-forward-messages`,
  method: 'POST',
  responseDataKey: 'data',
};

// getOwnUpdate
const GET_UPDATE_STATUS = {
  url: `${API_BASE_URL}app-list-my-status`,
  method: 'POST',
  responseDataKey: 'data',
};
// DELETE_GET_UPDATE_STATUS
const DELETE_GET_UPDATE_STATUS = {
  url: `${API_BASE_URL}app-delete-status`,
  method: 'POST',
  responseDataKey: 'data',
};

// GET_STORY_UPDATE_STATUS
const GET_STORY_UPDATE_STATUS = {
  url: `${API_BASE_URL}app-list-status`,
  method: 'POST',
  responseDataKey: 'data',
};

// STORY_LIKE_STATUS
const STORY_LIKE_STATUS = {
  url: `${API_BASE_URL}app-like-status`,
  method: 'POST',
  responseDataKey: 'data',
};

// START_CALL_API
const START_CALL_API = {
  url: `${API_BASE_URL}app-create-call`,
  method: 'POST',
  responseDataKey: 'data',
};
// END_CALL_API

const END_CALL_API = {
  url: `${API_BASE_URL}app-end-call`,
  method: 'POST',
  responseDataKey: 'data',
};

// USER_ANSWER_CALL_API
const USER_ANSWER_CALL_API = {
  url: `${API_BASE_URL}app-attend-call`,
  method: 'POST',
  responseDataKey: 'data',
};

// GET_CALL_HISTORY_ID
const GET_CALL_HISTORY_ID = {
  url: `${API_BASE_URL}app-call-history`,
  method: 'POST',
  responseDataKey: 'data',
};

// GET_MEDIA_SHARED_LIST
const GET_MEDIA_SHARED_LIST = {
  url: `${API_BASE_URL}app-list-message-media`,
  method: 'POST',
  responseDataKey: 'data',
};
// 
export const API_REQUESTS = {
  USER_ANSWER_CALL_API,
  GET_MEDIA_SHARED_LIST,
  GET_CALL_HISTORY_ID,
  START_CALL_API,
  END_CALL_API,
  STORY_LIKE_STATUS,
  GET_STORY_UPDATE_STATUS,
  DELETE_GET_UPDATE_STATUS,
  GET_UPDATE_STATUS,
  MESSAGE_FORWARD_API,
  PIN_CHAT_API,
  GET_STARTED_MESSAGE,
  UNSTAR_MESSAGES_API,
  MAKE_FAV_CONVO,
  REACT_CONVO_MESSAGES,
  STAR_MESSAGE_CONVO_API,
  DELETE_CONVO_API,
  MUTE_API,
  DELETE_MESSAGES,
  DELETE_GROUP_MESSAGES,
  REPORT_USER_BY_ID,
  BLOCK_USER_BY_ID,
  GET_USER_STATUS,
  GET_BLOCKED_USER_LIST,
  UPDATE_USER_STATUS,
  REMOVE_GROUP_MEMBER,
  GET_SITE_DATA,
  ALLOWCOMMUNITY,
  GET_COMMUNITY_DETAILS_BY_ID,
  REMOVE_MEMBER,
  CHANGE_WALLPAPER_API,
  LIST_COMMUNITY_MESSAGES,
  SEND_COMMUNITY_MESSAGE,
  GET_SLAM_CONVO,
  GET_WALLPAPER_LIST,
  SENT_ANSWERS_SLAMBOOK,
  GET_STICKERS_LIST,
  UPDATE_FCM_TOKEN,
  GET_SLAM_QUESTION_FROM_USER,
  SEND_SLAM_TO_USER,
  GET_USERSLAM_QUESTIONS,
  GET_GROUP_DETAILS_BY_ID,
  ADD_GROUP_MEMBERS,
  GETCOMMUNITYLIST,
  GETUSERGROUP,
  LIST_GROUP_MESSAGES,
  SENDGROUP_MESSAGE,
  CREATE_GROUP_API,
  CREATE_PASSWORDON_FORGET,
  APP_GENERATE_TOKEN,
  REGISTER_USER,
  REGISTER_USER_CONFIRM,
  REGISTER_USER_CONFIRM_PIN,
  LOGIN_USER,
  LOGIN_USER_CONFIRM_PIN,
  FORGOT_USER_MPIN,
  RESET_USER_MPIN,
  EDIT_PROFILE_USER,
  UPDATE_PROFILE_USER,
  UPDATE_PROFILE_USER_NEW_PHONE,
  CHANGE_USER_MPIN,
  SEARCH_USER,
  LIST_CONVERSATION,
  LIST_MESSAGES,
  SEND_MESSAGE,
  CREATE_CONVERSATION,
  CHECK_FLAMES,
  CREATE_COMMUNITY,
  ADD_GROUP_COMMUNITY,
  CHANGE_PASSWORD_API,
  CHECKEMAILEXIST
};

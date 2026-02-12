import axios from "axios";
import {
  APP_GENERATE_TOKEN_REQUEST,
  APP_GENERATE_TOKEN_SUCCESS,
  APP_GENERATE_TOKEN_FAILURE,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  REGISTER_USER_CONFIRM_REQUEST,
  REGISTER_USER_CONFIRM_SUCCESS,
  REGISTER_USER_CONFIRM_FAILURE,
  REGISTER_USER_CONFIRM_PIN_REQUEST,
  REGISTER_USER_CONFIRM_PIN_SUCCESS,
  REGISTER_USER_CONFIRM_PIN_FAILURE,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT,
  LOGIN_USER_CONFIRM_PIN_REQUEST,
  LOGIN_USER_CONFIRM_PIN_SUCCESS,
  LOGIN_USER_CONFIRM_PIN_FAILURE,
  FORGOT_USER_MPIN_REQUEST,
  FORGOT_USER_MPIN_SUCCESS,
  FORGOT_USER_MPIN_FAILURE,
  RESET_USER_MPIN_REQUEST,
  RESET_USER_MPIN_SUCCESS,
  RESET_USER_MPIN_FAILURE,
  EDIT_PROFILE_USER_REQUEST,
  EDIT_PROFILE_USER_SUCCESS,
  EDIT_PROFILE_USER_FAILURE,
  UPDATE_PROFILE_USER_REQUEST,
  UPDATE_PROFILE_USER_SUCCESS,
  UPDATE_PROFILE_USER_FAILURE,
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILURE,
  LIST_CONVERSATION_REQUEST,
  LIST_CONVERSATION_SUCCESS,
  LIST_CONVERSATION_FAILURE,
  LIST_MESSAGES_REQUEST,
  LIST_MESSAGES_SUCCESS,
  LIST_MESSAGES_FAILURE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  CREATE_CONVERSATION_REQUEST,
  CREATE_CONVERSATION_SUCCESS,
  CREATE_CONVERSATION_FAILURE,
  CHECK_FLAMES_REQUEST,
  CHECK_FLAMES_SUCCESS,
  CHECK_FLAMES_FAILURE,
  CREATE_COMMUNITY_REQUEST,
  CREATE_COMMUNITY_SUCCESS,
  CREATE_COMMUNITY_FAILURE,
  ADD_GROUP_COMMUNITY_REQUEST,
  ADD_GROUP_COMMUNITY_SUCCESS,
  ADD_GROUP_COMMUNITY_FAILURE,
  UPDATE_PROFILE_USER_NEW_PHONE_REQUEST,
  UPDATE_PROFILE_USER_NEW_PHONE_SUCCESS,
  UPDATE_PROFILE_USER_NEW_PHONE_FAILURE,
  CHANGE_USER_MPIN_REQUEST,
  CHANGE_USER_MPIN_SUCCESS,
  CHANGE_USER_MPIN_FAILURE,
  CHANGEPASSWORD_REQUEST,
  CHANGEPASSWORD_SUCCESS,
  CHANGEPASSWORD_FAILURE,

  CHECKEMAILEXIST_REQUEST,
  CHECKEMAILEXIST_SUCCESS,
  CHECKEMAILEXIST_FAILURE,


  CREATEPASSWORD_FORGET_REQUEST,
  CREATEPASSWORD_FORGET_SUCCESS,
  CREATEPASSWORD_FORGET_FAILURE,

  SENDGROUPMESSAGE_REQUEST,
  SENDGROUPMESSAGE_SUCCESS,
  SENDGROUPMESSAGE_FAILURE,

  GETGROUPMESSAGE_REQUEST,
  GETGROUPMESSAGE_SUCCESS,
  GETGROUPMESSAGE_FAILURE,


  GETGROUPLIST_REQUEST,
  GETGROUPLIST_SUCCESS,
  GETGROUPLIST_FAILURE,

  GETCOMMUNITYLIST_REQUEST,
  GETCOMMUNITYLIST_SUCCESS,
  GETCOMMUNITYLIST_FAILURE,

  GETGROUP_DETAILS_REQUEST,
  GETGROUP_DETAILS_SUCCESS,
  GETGROUP_DETAILS_FAILURE,

  ADD_GROUP_MEMEBERS_REQUEST,
  ADD_GROUP_MEMEBERS_SUCCESS,
  ADD_GROUP_MEMEBERS_FAILURE,

  GET_USER_SLAM_QUESTIONS_REQUEST,
  GET_USER_SLAM_QUESTIONS_SUCCESS,
  GET_USER_SLAM_QUESTIONS_FAILURE,

  SEND_USER_SLAM_QUESTIONS_REQUEST,
  SEND_USER_SLAM_QUESTIONS_SUCCESS,
  SEND_USER_SLAM_QUESTIONS_FAILURE,


  SEND_USER_SLAM_QUESTIONS_CHAT_REQUEST,
  SEND_USER_SLAM_QUESTIONS_CHAT_SUCCESS,
  SEND_USER_SLAM_QUESTIONS_CHAT_FAILURE,


  SEND_USER_SLAM_QUESTIONS__ANSWER_REQUEST,
  SEND_USER_SLAM_QUESTIONS__ANSWER_SUCCESS,
  SEND_USER_SLAM_QUESTIONS__ANSWER_FAILURE,


  GET_STICKERS_ARRAY_REQUEST,
  GET_STICKERS_ARRAY_SUCCESS,
  GET_STICKERS_ARRAY_FAILURE,

  GET_WALLPAPER_ARRAY_REQUEST,
  GET_WALLPAPER_ARRAY_SUCCESS,
  GET_WALLPAPER_ARRAY_FAILURE,

  GET_SLAM_CONVO_ARRAY_REQUEST,
  GET_SLAM_CONVO_ARRAY_SUCCESS,
  GET_SLAM_CONVO_ARRAY_FAILURE,



  SEND_COMMUNITY_MESSAGE_REQUEST,
  SEND_COMMUNITY_MESSAGE_SUCCESS,
  SEND_COMMUNITY_MESSAGE_FAILURE,

  GET_COMMUNITY_MESSAGE_REQUEST,
  GET_COMMUNITY_MESSAGE_SUCCESS,
  GET_COMMUNITY_MESSAGE_FAILURE,

  CHANGE_WALLPAPER_REQUEST,
  CHANGE_WALLPAPER_SUCCESS,
  CHANGE_WALLPAPER_FAILURE,

  REMOVEGROUP_MEMBERS_REQUEST,
  REMOVEGROUP_MEMBERS_SUCCESS,
  REMOVEGROUP_MEMBERS_FAILURE,

  GET_COMMUNITY_DETAILS_REQUEST,
  GET_COMMUNITY_DETAILS_SUCCESS,
  GET_COMMUNITY_DETAILS_FAILURE,


  REMOVE_GROUP_REQUEST,
  REMOVE_GROUP_SUCCESS,
  REMOVE_GROUP_FAILURE,


  GET_SITE_DETAILS_REQUEST,
  GET_SITE_DETAILS_SUCCESS,
  GET_SITE_DETAILS_FAILURE,

  ALLOW_COMMUNITY_FLAG_REQUEST,
  ALLOW_COMMUNITY_FLAG_SUCCESS,
  ALLOW_COMMUNITY_FLAG_FAILURE,

  UPDATE_USERTSTUS_REQUEST,
  UPDATE_USERTSTUS_SUCCESS,
  UPDATE_USERTSTUS_FAILURE,

  GET_USER_REQUEST,
  GET_USERS_SUCCESS,
  GET_USER_FAILURE,


  BLOCK_USER_REQUEST,
  BLOCK_USERS_SUCCESS,
  BLOCK_USER_FAILURE,


  GET_BLOCK_USER_REQUEST,
  GET_BLOCK_USERS_SUCCESS,
  GET_BLOCK_USER_FAILURE,

  UNBLOCK_USER_REQUEST,
  UNBLOCK_USER_SUCCESS,
  UNBLOCK_USER_FAILURE,

  REPORT_USER_REQUEST,
  REPORT_USER_SUCCESS,
  REPORT_USER_FAILURE,



  DELETE_MESSAGES_REQUEST,
  DELETE_MESSAGES_SUCCESS,
  DELETE_MESSAGES_FAILURE,

  DELETE_GROUP_MESSAGES_REQUEST,
  DELETE_GROUP_MESSAGES_SUCCESS,
  DELETE_GROUP_MESSAGES_FAILURE,


  MUTE_MESSAGES_REQUEST,
  MUTE_MESSAGES_SUCCESS,
  MUTE_MESSAGES_FAILURE,

  DELETE_MESSAGES_CONVO_REQUEST,
  DELETE_MESSAGES_CONVO_SUCCESS,
  DELETE_MESSAGES_CONVO_FAILURE,

  REACT_MESSAGES_CONVO_REQUEST,
  REACT_MESSAGES_CONVO_SUCCESS,
  REACT_MESSAGES_CONVO_FAILURE,


  STAR_MESSAGES_CONVO_REQUEST,
  STAR_MESSAGES_CONVO_SUCCESS,
  STAR_MESSAGES_CONVO_FAILURE,

  GET_STAR_MESSAGES_CONVO_REQUEST,
  GET_STAR_MESSAGES_CONVO_SUCCESS,
  GET_STAR_MESSAGES_CONVO_FAILURE,

  MAKE_FAV_MESSAGES_CONVO_REQUEST,
  MAKE_FAV_MESSAGES_CONVO_SUCCESS,
  MAKE_FAV_MESSAGES_CONVO_FAILURE,

  UN_STAR_MESSAGES_CONVO_REQUEST,
  UN_STAR_MESSAGES_CONVO_SUCCESS,
  UN_STAR_MESSAGES_CONVO_FAILURE,

  PIN_CHAT_CONVO_REQUEST,
  PIN_CHAT_CONVO_SUCCESS,
  PIN_CHAT_CONVO_FAILURE,


  FORWARD_CHAT_CONVO_REQUEST,
  FORWARD_CHAT_CONVO_SUCCESS,
  FORWARD_CHAT_CONVO_FAILURE,

  GET_OWN_STATUS_REQUEST,
  GET_OWN_STATUS_SUCCESS,
  GET_OWN_STATUS_FAILURE,


  DELETE_OWN_STATUS_REQUEST,
  DELETE_OWN_STATUS_SUCCESS,
  DELETE_OWN_STATUS_FAILURE,

  STORYLIST_OWN_STATUS_REQUEST,
  STORYLIST_OWN_STATUS_SUCCESS,
  STORYLIST_OWN_STATUS_FAILURE,

  STORY_LIKE_STATUS_REQUEST,
  STORY_LIKE_STATUS_SUCCESS,
  STORY_LIKE_STATUS_FAILURE,

} from "./actionsTypes";
import { API_REQUESTS } from "../api/api-end-points";
import { current } from "@reduxjs/toolkit";

// Utility function for async requests
const sendRequest = async (requestConfig, data = {}, headers = {}) => {
  // console.log("sendRequestAsyng", requestConfig, data);
  const { url, method } = requestConfig;
  const response = await axios({
    url,
    method,
    data,
    headers,
  });
  return response.data;
};

// Action Creators
//get Group Details

export const getGroupDetails = (userId, groupId, callback) => async (dispatch) => {
  dispatch({ type: GETGROUP_DETAILS_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_GROUP_DETAILS_BY_ID;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        groupid: groupId,

      },
      {}
    );
    dispatch({ type: GETGROUP_DETAILS_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GETGROUP_DETAILS_FAILURE, error: error.message });
  }
};


//BLockUSER
export const blockUser = (userId, toUserid, callback) => async (dispatch) => {
  dispatch({ type: BLOCK_USER_REQUEST });
  try {
    const endpoint = API_REQUESTS.BLOCK_USER_BY_ID;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        blockuserid: toUserid,

      },
    );
    dispatch({ type: BLOCK_USERS_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: BLOCK_USER_FAILURE, error: error.message });
  }
};




// reportuserid
export const reportUser = (userId, toUserid, callback) => async (dispatch) => {
  dispatch({ type: REPORT_USER_REQUEST });
  try {
    const endpoint = API_REQUESTS.REPORT_USER_BY_ID;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        reportuserid: toUserid,

      },
    );
    dispatch({ type: REPORT_USER_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: REPORT_USER_FAILURE, error: error.message });
  }
};




// getCommunityDetails
export const getCommunityDetails = (userId, communityId, callback) => async (dispatch) => {
  dispatch({ type: GET_COMMUNITY_DETAILS_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_COMMUNITY_DETAILS_BY_ID;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        communityid: communityId,
      },
      {}
    );
    dispatch({ type: GET_COMMUNITY_DETAILS_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GET_COMMUNITY_DETAILS_FAILURE, error: error.message });
  }
};


//addGroupMemebers
export const removeGroupMember = (memeberId, groupId, userId, callback) => async (dispatch) => {
  dispatch({ type: REMOVEGROUP_MEMBERS_REQUEST });
  try {
    const endpoint = API_REQUESTS.REMOVE_MEMBER;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        groupid: groupId,
        membersid: memeberId

      },
      {}
    );
    dispatch({ type: REMOVEGROUP_MEMBERS_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: REMOVEGROUP_MEMBERS_FAILURE, error: error.message });
  }
};

// removeGroupCommunity
export const removeGroupCommunity = (userId, communityid, groupId, callback) => async (dispatch) => {
  dispatch({ type: REMOVE_GROUP_REQUEST });
  try {
    const endpoint = API_REQUESTS.REMOVE_GROUP_MEMBER;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        groupsid: groupId,
        communityid: communityid

      },
      {}
    );
    dispatch({ type: REMOVE_GROUP_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: REMOVE_GROUP_FAILURE, error: error.message });
  }
};





// allowGroupCommunity
export const allowGroupCommunity = (userId, callback) => async (dispatch) => {
  dispatch({ type: ALLOW_COMMUNITY_FLAG_REQUEST });
  try {
    const endpoint = API_REQUESTS.ALLOWCOMMUNITY;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
      },
      {}
    );
    dispatch({ type: ALLOW_COMMUNITY_FLAG_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: ALLOW_COMMUNITY_FLAG_FAILURE, error: error.message });
  }
};




export const addGroupMemebers = (userId, groupId, selectedMembers, callback) => async (dispatch) => {
  dispatch({ type: ADD_GROUP_MEMEBERS_REQUEST });
  try {
    const endpoint = API_REQUESTS.ADD_GROUP_MEMBERS;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        groupid: groupId,
        membersid: selectedMembers.join(",")
      },
    );
    dispatch({ type: ADD_GROUP_MEMEBERS_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: ADD_GROUP_MEMEBERS_FAILURE, error: error.message });
  }

};





// getUsersSlamQuestions
export const getUsersSlamQuestions = (userId, callback) => async (dispatch) => {
  dispatch({ type: GET_USER_SLAM_QUESTIONS_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_USERSLAM_QUESTIONS;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,

      },
    );
    dispatch({ type: GET_USER_SLAM_QUESTIONS_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GET_USER_SLAM_QUESTIONS_FAILURE, error: error.message });
  }
};


// 


export const getSiteSettings = (userId, callback) => async (dispatch) => {
  dispatch({ type: GET_SITE_DETAILS_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_SITE_DATA;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,

      },
    );
    dispatch({ type: GET_SITE_DETAILS_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GET_SITE_DETAILS_FAILURE, error: error.message });
  }
};


// getConnectivity
export const getConnectivity = (touserId, callback) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_USER_STATUS;

    const response = await sendRequest(
      endpoint,
      {
        userid: touserId,

      },
    );
    dispatch({ type: GET_USERS_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GET_USER_FAILURE, error: error.message });
  }
};



// getUsersSlamQuestionsChat
export const getUsersSlamQuestionsChat = (userId, toUserId, conversationid, callback) => async (dispatch) => {
  dispatch({ type: SEND_USER_SLAM_QUESTIONS_CHAT_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_SLAM_QUESTION_FROM_USER;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        touserid: toUserId,
        conversationid: conversationid

      },
    );
    // alert(JSON.stringify(response))
    dispatch({ type: SEND_USER_SLAM_QUESTIONS_CHAT_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: SEND_USER_SLAM_QUESTIONS_CHAT_FAILURE, error: error.message });
  }
};


// // getUsersSlamQuestionsChat
// export const getUsersSlamQuestionsChat = (userId, toUserId, callback) => async (dispatch) => {
//   dispatch({ type: SEND_USER_SLAM_QUESTIONS_CHAT_REQUEST });
//   try {
//     const endpoint = API_REQUESTS.GET_SLAM_QUESTION_FROM_USER;

//     const response = await sendRequest(
//       endpoint,
//       {
//         userid: userId,
//         touserid: toUserId,

//       },
//     );
//     dispatch({ type: SEND_USER_SLAM_QUESTIONS_CHAT_SUCCESS, payload: response });
//     callback(response);
//     return response;
//   } catch (error) {
//     dispatch({ type: SEND_USER_SLAM_QUESTIONS_CHAT_FAILURE, error: error.message });
//   }
// };


// sendUsersSlamQuestions
export const sendUsersSlamQuestions = (userId, toUserId, selectedQuestions, themeSend, flamesGameOption, callback) => async (dispatch) => {
  dispatch({ type: SEND_USER_SLAM_QUESTIONS_REQUEST });
  try {
    const endpoint = API_REQUESTS.SEND_SLAM_TO_USER;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        touserid: toUserId,
        theme: themeSend,
        flames: flamesGameOption,
        slambooksid: selectedQuestions.join(',')
      },
    );
    dispatch({ type: SEND_USER_SLAM_QUESTIONS_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: SEND_USER_SLAM_QUESTIONS_FAILURE, error: error.message });
  }
};

// sendUsersSlamQuestionsAnswers
export const sendUsersSlamQuestionsAnswers = (userId, conversationId, answers, conversationid, callback) => async (dispatch) => {
  dispatch({ type: SEND_USER_SLAM_QUESTIONS__ANSWER_REQUEST });
  try {
    const endpoint = API_REQUESTS.SENT_ANSWERS_SLAMBOOK;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        conversationid: conversationid,
        answers: answers
      },
    );
    dispatch({ type: SEND_USER_SLAM_QUESTIONS__ANSWER_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: SEND_USER_SLAM_QUESTIONS__ANSWER_FAILURE, error: error.message });
  }
};

// Generate Token
export const generateToken = () => async (dispatch) => {
  dispatch({ type: APP_GENERATE_TOKEN_REQUEST });
  try {
    const response = await sendRequest(API_REQUESTS.APP_GENERATE_TOKEN);
    // console.log("generateToken", response);

    dispatch({ type: APP_GENERATE_TOKEN_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: APP_GENERATE_TOKEN_FAILURE, error: error.message });
  }
};




// Register User
export const registerUser = (userData, callback) => async (dispatch) => {
  dispatch({ type: REGISTER_USER_REQUEST });
  try {
    const response = await sendRequest(API_REQUESTS.REGISTER_USER, userData);
    dispatch({ type: REGISTER_USER_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: REGISTER_USER_FAILURE, error: error.message });
  }
};




// Confirm User Registration
export const confirmUserRegistration = (confirmData) => async (dispatch) => {
  dispatch({ type: REGISTER_USER_CONFIRM_REQUEST });
  try {
    const response = await sendRequest(
      API_REQUESTS.REGISTER_USER_CONFIRM,
      confirmData
    );
    dispatch({ type: REGISTER_USER_CONFIRM_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: REGISTER_USER_CONFIRM_FAILURE, error: error.message });
  }
};

// Confirm Registration PIN
export const confirmRegistrationPin = (pinData) => async (dispatch) => {
  dispatch({ type: REGISTER_USER_CONFIRM_PIN_REQUEST });
  try {
    const response = await sendRequest(
      API_REQUESTS.REGISTER_USER_CONFIRM_PIN,
      pinData
    );
    dispatch({ type: REGISTER_USER_CONFIRM_PIN_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: REGISTER_USER_CONFIRM_PIN_FAILURE, error: error.message });
  }
};






export const loginUser = (loginData, fcmTorkn, callback) => async (dispatch) => {
  dispatch({ type: LOGIN_USER_REQUEST });

  const response = await sendRequest(API_REQUESTS.LOGIN_USER,
    loginData);
  if (response.success) {

    dispatch({ type: LOGIN_USER_SUCCESS, payload: response });
    callback(response);
    return response;
  } else {
    dispatch({
      type: LOGIN_USER_FAILURE,
      error: response.message,
    });
  }
};

export const logout = (loginData) => async (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Confirm Login PIN
export const confirmLoginPin = (pinData) => async (dispatch) => {
  dispatch({ type: LOGIN_USER_CONFIRM_PIN_REQUEST });
  try {
    const response = await sendRequest(
      API_REQUESTS.LOGIN_USER_CONFIRM_PIN,
      pinData
    );
    dispatch({ type: LOGIN_USER_CONFIRM_PIN_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: LOGIN_USER_CONFIRM_PIN_FAILURE, error: error.message });
  }
};

// Forgot MPIN
export const forgotUserMpin = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_USER_MPIN_REQUEST });
  try {
    const response = await sendRequest(API_REQUESTS.FORGOT_USER_MPIN, {
      email,
    });
    dispatch({ type: FORGOT_USER_MPIN_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: FORGOT_USER_MPIN_FAILURE, error: error.message });
  }
};

// Reset MPIN
export const resetUserMpin = (mpinData) => async (dispatch) => {
  dispatch({ type: RESET_USER_MPIN_REQUEST });
  try {
    const response = await sendRequest(API_REQUESTS.RESET_USER_MPIN, mpinData);
    dispatch({ type: RESET_USER_MPIN_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: RESET_USER_MPIN_FAILURE, error: error.message });
  }
};

// Edit User Profile
export const editUserProfile = (headers) => async (dispatch) => {
  dispatch({ type: EDIT_PROFILE_USER_REQUEST });
  try {
    const response = await sendRequest(
      API_REQUESTS.EDIT_PROFILE_USER,
      {},
      headers
    );
    dispatch({ type: EDIT_PROFILE_USER_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: EDIT_PROFILE_USER_FAILURE, error: error.message });
  }
};

// authActions.js

export const getUserProfile = (userId) => async (dispatch) => {
  dispatch({ type: EDIT_PROFILE_USER_REQUEST });

  try {
    const endpoint = API_REQUESTS.EDIT_PROFILE_USER;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
      },
      {}
    );

    dispatch({ type: EDIT_PROFILE_USER_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: EDIT_PROFILE_USER_FAILURE, error: error.message });
  }
};

export const updateUserProfile = (payload, callback) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_USER_REQUEST });

  try {
    const endpoint = API_REQUESTS.UPDATE_PROFILE_USER;

    const response = await sendRequest(endpoint, payload, {});
    callback(response);

    dispatch({ type: UPDATE_PROFILE_USER_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: UPDATE_PROFILE_USER_FAILURE, error: error.message });
  }
};


export const changePassword = (payload, callback) => async (dispatch) => {
  dispatch({ type: CHANGEPASSWORD_REQUEST });

  try {
    const endpoint = API_REQUESTS.CHANGE_PASSWORD_API;

    const response = await sendRequest(endpoint, payload, {});

    callback(response);

    dispatch({ type: CHANGEPASSWORD_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: CHANGEPASSWORD_FAILURE, error: error.message });
  }
};




// changeWallpaperApi
export const changeWallpaperApi = (payload, callback) => async (dispatch) => {
  dispatch({ type: CHANGE_WALLPAPER_REQUEST });

  try {
    const endpoint = API_REQUESTS.CHANGE_WALLPAPER_API;

    const response = await sendRequest(endpoint, {
      userid: payload.userid,
      bg: payload.bg,
    });

    // alert(JSON.stringify(response))
    callback(response);

    dispatch({ type: CHANGE_WALLPAPER_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: CHANGE_WALLPAPER_FAILURE, error: error.message });
  }
};

//createPasswordOnForget
export const createPasswordOnForget = (payload, callback) => async (dispatch) => {
  dispatch({ type: CREATEPASSWORD_FORGET_REQUEST });
  try {

    const endpoint = API_REQUESTS.CREATE_PASSWORDON_FORGET;
    const response = await sendRequest(
      endpoint,
      {
        email: payload.emailParams,
        otp: payload.otp,
        password: payload.password
      },
    );

    callback(response);

    dispatch({ type: CREATEPASSWORD_FORGET_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: CREATEPASSWORD_FORGET_FAILURE, error: error.message });
  }
};


// CheckEmail
export const checkEmailRequest = (email, callback) => async (dispatch) => {
  dispatch({ type: CHECKEMAILEXIST_REQUEST });
  try {
    const endpoint = API_REQUESTS.CHECKEMAILEXIST;

    const response = await sendRequest(
      endpoint,
      {
        email: email,
      },
      {}
    );
    dispatch({ type: CHECKEMAILEXIST_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: CHECKEMAILEXIST_FAILURE, error: error.message });
  }
};



//list group



export const getGroupList = (userId, callback) => async (dispatch) => {
  dispatch({ type: GETGROUPLIST_REQUEST });
  const endpoint = API_REQUESTS.GETUSERGROUP;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
      },
    );

    dispatch({ type: GETGROUPLIST_SUCCESS, payload: response });
    callback(response);
    return response;

  } catch (error) {
    dispatch({ type: GETGROUPLIST_FAILURE, error: error.message });
  }
};


// list communtites
export const getCommiunityList = (userId, callback) => async (dispatch) => {
  dispatch({ type: GETCOMMUNITYLIST_REQUEST });
  const endpoint = API_REQUESTS.GETCOMMUNITYLIST;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
      },
    );
    dispatch({ type: GETCOMMUNITYLIST_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GETCOMMUNITYLIST_FAILURE, error: error.message });
  }
};


export const getSearchUser = (userId, searchTerm, page, grpID, callback) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  const endpoint = API_REQUESTS.SEARCH_USER;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        searchterm: searchTerm,
        groupid: grpID,
        currentpage: page
      },
      {}
    );
    dispatch({ type: SEARCH_USER_SUCCESS, payload: response.data });
    callback(response);
    return response;

  } catch (error) {
    dispatch({ type: SEARCH_USER_FAILURE, error: error.message });
  }
};


export const getListConversation = (userId, viewMode) => async (dispatch) => {
  dispatch({ type: LIST_CONVERSATION_REQUEST });
  const endpoint = API_REQUESTS.LIST_CONVERSATION;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        viewMode: viewMode
      },
    );
    dispatch({ type: LIST_CONVERSATION_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: LIST_CONVERSATION_FAILURE, error: error.message });
  }
};

export const getListMessages = (userId, touserName, callback) => async (dispatch) => {
  dispatch({ type: LIST_MESSAGES_REQUEST });
  const endpoint = API_REQUESTS.LIST_MESSAGES;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        tousername: touserName,
      },
      {}
    );
    dispatch({
      type: LIST_MESSAGES_SUCCESS,
      payload: { [`${touserName}`]: response.data },
    });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: LIST_MESSAGES_FAILURE, error: error.message });
  }
};



export const deleteMessages = (userId, messageid, callback) => async (dispatch) => {
  dispatch({ type: DELETE_MESSAGES_REQUEST });
  const endpoint = API_REQUESTS.DELETE_MESSAGES;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        messageid: messageid,
      },
      {}
    );
    dispatch({ type: DELETE_MESSAGES_SUCCESS, payload: response.data });

    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: DELETE_MESSAGES_FAILURE, error: error.message });
  }
};

// reactMessageApi
export const reactMessageApi = (userId, messageid, reacttion, callback) => async (dispatch) => {
  dispatch({ type: REACT_MESSAGES_CONVO_REQUEST });
  const endpoint = API_REQUESTS.REACT_CONVO_MESSAGES;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        messageid: messageid,
        reaction: reacttion
      },
      {}
    );

    dispatch({ type: REACT_MESSAGES_CONVO_SUCCESS, payload: response.data });

    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: REACT_MESSAGES_CONVO_FAILURE, error: error.message });
  }
};

// startCallApi
export const startCallApi = (payload, callback) => async (dispatch) => {
  const endpoint = API_REQUESTS.START_CALL_API;
  try {
    const response = await sendRequest(
      endpoint, payload
    );
    callback(response);
    return response;
  } catch (error) {
    console.log(error, "errorStartCall")
  }
};
// userEndCallApi
export const userEndCallApi = (payload, callback) => async (dispatch) => {
  const endpoint = API_REQUESTS.END_CALL_API;
  try {
    const response = await sendRequest(
      endpoint, payload
    );
    callback(response);
    return response;
  } catch (error) {
    console.log(error, "errorendCall")
  }
};
// userAnswerCallApi
export const userAnswerCallApi = (payload, callback) => async (dispatch) => {
  const endpoint = API_REQUESTS.USER_ANSWER_CALL_API;
  try {
    const response = await sendRequest(
      endpoint, payload
    );
    callback(response);
    return response;
  } catch (error) {
    console.log(error, "errorendCall")
  }
};

export const deleteGroupMessages = (userId, messageid, callback) => async (dispatch) => {
  dispatch({ type: DELETE_GROUP_MESSAGES_REQUEST });
  const endpoint = API_REQUESTS.DELETE_GROUP_MESSAGES;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        messageid: messageid,
      },
      {}
    );
    dispatch({ type: DELETE_GROUP_MESSAGES_SUCCESS, payload: response.data });

    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: DELETE_GROUP_MESSAGES_FAILURE, error: error.message });
  }
};

// muteChatUsers



export const muteChatUsers = (userId, toUserIdname, callback) => async (dispatch) => {
  dispatch({ type: MUTE_MESSAGES_REQUEST });
  const endpoint = API_REQUESTS.MUTE_API;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        tousername: toUserIdname,
      },
      {}
    );
    // alert(JSON.stringify(response))
    dispatch({ type: MUTE_MESSAGES_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: MUTE_MESSAGES_FAILURE, error: error.message });
  }
};

// GET_STAR_MESSAGES_CONVO_REQUEST,
// GET_STAR_MESSAGES_CONVO_SUCCESS,
// GET_STAR_MESSAGES_CONVO_FAILURE,


// getStaredMessage
export const getStaredMessage = (userId, callback) => async (dispatch) => {
  dispatch({ type: GET_STAR_MESSAGES_CONVO_REQUEST });
  const endpoint = API_REQUESTS.GET_STARTED_MESSAGE;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,

      },
      {}
    );
    // alert(JSON.stringify(response))
    dispatch({ type: GET_STAR_MESSAGES_CONVO_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GET_STAR_MESSAGES_CONVO_FAILURE, error: error.message });
  }
};


// unStarMessages
export const unStarMessages = (userId, callback) => async (dispatch) => {
  dispatch({ type: UN_STAR_MESSAGES_CONVO_REQUEST });
  const endpoint = API_REQUESTS.UNSTAR_MESSAGES_API;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,

      },
      {}
    );
    // alert(JSON.stringify(response))
    dispatch({ type: UN_STAR_MESSAGES_CONVO_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: UN_STAR_MESSAGES_CONVO_FAILURE, error: error.message });
  }
};

export const pinChatinHome = (userId, toUsername, callback) => async (dispatch) => {
  dispatch({ type: PIN_CHAT_CONVO_REQUEST });
  const endpoint = API_REQUESTS.PIN_CHAT_API;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        tousername: toUsername
      },
      {}
    );
    // alert(JSON.stringify(response))
    dispatch({ type: PIN_CHAT_CONVO_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: PIN_CHAT_CONVO_FAILURE, error: error.message });
  }
};

// makeFavChatUsers
export const makeFavChatUsers = (userId, toUserIdname, callback) => async (dispatch) => {
  dispatch({ type: MAKE_FAV_MESSAGES_CONVO_REQUEST });
  const endpoint = API_REQUESTS.MAKE_FAV_CONVO;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        tousername: toUserIdname,
      },
      {}
    );
    // alert(JSON.stringify(response))
    dispatch({ type: MAKE_FAV_MESSAGES_CONVO_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: MAKE_FAV_MESSAGES_CONVO_FAILURE, error: error.message });
  }
};

// deleteeChatUsers
export const deleteeChatUsers = (userId, toUserIdname, callback) => async (dispatch) => {
  dispatch({ type: DELETE_MESSAGES_CONVO_REQUEST });
  const endpoint = API_REQUESTS.DELETE_CONVO_API;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        tousername: toUserIdname,
      },
      {}
    );
    // alert(JSON.stringify(response))
    dispatch({ type: DELETE_MESSAGES_CONVO_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: DELETE_MESSAGES_CONVO_FAILURE, error: error.message });
  }
};

// starMessageApi
export const startMessageApi = (userId, messageidArr, callback) => async (dispatch) => {
  dispatch({ type: STAR_MESSAGES_CONVO_REQUEST });
  const endpoint = API_REQUESTS.STAR_MESSAGE_CONVO_API;

  try {

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        messageid: messageidArr.join(','),
      },
      {}
    );
    dispatch({ type: STAR_MESSAGES_CONVO_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: STAR_MESSAGES_CONVO_FAILURE, error: error.message });
  }
};


// fnForwardMessageCallApi
export const fnForwardMessageCallApi = (userId, selectedMembersId, messageidArr, callback) => async (dispatch) => {
  dispatch({ type: FORWARD_CHAT_CONVO_REQUEST });
  const endpoint = API_REQUESTS.MESSAGE_FORWARD_API;

  try {

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        touserid: selectedMembersId.join(','),
        messageid: messageidArr.join(','),
      },
      {}
    );
    dispatch({ type: FORWARD_CHAT_CONVO_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: FORWARD_CHAT_CONVO_FAILURE, error: error.message });
  }
};


// getOwnUpdate
export const getOwnUpdate = (userId, callback) => async (dispatch) => {
  dispatch({ type: GET_OWN_STATUS_REQUEST });
  const endpoint = API_REQUESTS.GET_UPDATE_STATUS;

  try {

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        // touserid: selectedMembersId.join(','),
        // messageid: messageidArr.join(','),
      },
      {}
    );
    dispatch({ type: GET_OWN_STATUS_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GET_OWN_STATUS_FAILURE, error: error.message });
  }
};


// getUpdateStoryList
export const getUpdateStoryList = (userId, callback) => async (dispatch) => {
  dispatch({ type: STORYLIST_OWN_STATUS_REQUEST });
  const endpoint = API_REQUESTS.GET_STORY_UPDATE_STATUS;

  try {

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
      },
      {}
    );
    dispatch({ type: STORYLIST_OWN_STATUS_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: STORYLIST_OWN_STATUS_FAILURE, error: error.message });
  }
};


// STORY_LIKE_STATUS_REQUEST,
// STORY_LIKE_STATUS_SUCCESS,
// STORY_LIKE_STATUS_FAILURE,

export const getStoryToggle = (userId, storyId, callback) => async (dispatch) => {
  dispatch({ type: STORY_LIKE_STATUS_REQUEST });
  const endpoint = API_REQUESTS.STORY_LIKE_STATUS;

  try {

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        statusid: storyId
      },
    );
    dispatch({ type: STORY_LIKE_STATUS_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: STORY_LIKE_STATUS_FAILURE, error: error.message });
  }
};


export const deleteOwnStory = (userId, storyId, callback) => async (dispatch) => {
  dispatch({ type: DELETE_OWN_STATUS_REQUEST });
  const endpoint = API_REQUESTS.DELETE_GET_UPDATE_STATUS;

  try {

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        statusid: storyId
        // touserid: selectedMembersId.join(','),
        // messageid: messageidArr.join(','),
      },
      {}
    );
    dispatch({ type: DELETE_OWN_STATUS_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: DELETE_OWN_STATUS_FAILURE, error: error.message });
  }
};



export const getListGroupMessages = (userId, groupId) => async (dispatch) => {
  dispatch({ type: GETGROUPMESSAGE_REQUEST });
  const endpoint = API_REQUESTS.LIST_GROUP_MESSAGES;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        groupid: groupId,
      },
    );
    dispatch({
      type: GETGROUPMESSAGE_SUCCESS,
      payload: { [`${groupId}`]: response.data },
    });
  } catch (error) {
    dispatch({ type: GETGROUPMESSAGE_FAILURE, error: error.message });
  }
};

export const getListCommunityMessages = (userId, communityId) => async (dispatch) => {
  dispatch({ type: GET_COMMUNITY_MESSAGE_REQUEST });
  const endpoint = API_REQUESTS.LIST_COMMUNITY_MESSAGES;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        communityid: communityId,
      },
    );
    dispatch({
      type: GET_COMMUNITY_MESSAGE_SUCCESS,
      payload: { [`${communityId}`]: response.data },
    });
    // alert(JSON.stringify(response))
  } catch (error) {
    dispatch({ type: GET_COMMUNITY_MESSAGE_FAILURE, error: error.message });
  }
};


// sendCommunityMessage
export const sendMessage =
  (userId, touserName, message) => async (dispatch) => {
    dispatch({ type: SENDGROUPMESSAGE_REQUEST });
    const endpoint = API_REQUESTS.SEND_MESSAGE;

    try {
      const response = await sendRequest(
        endpoint,
        {
          userid: userId,
          tousername: touserName,
          message: message,
        },
        {}
      );
      dispatch({ type: SENDGROUPMESSAGE_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: SENDGROUPMESSAGE_FAILURE, error: error.message });
    }
  };


export const sendCommunityMessage =
  (userId, communityId, message) => async (dispatch) => {
    dispatch({ type: SEND_COMMUNITY_MESSAGE_REQUEST });
    const endpoint = API_REQUESTS.SEND_COMMUNITY_MESSAGE;

    try {
      const response = await sendRequest(
        endpoint,
        {
          userid: userId,
          communityid: communityId,
          message: message,
        },
        {}
      );
      dispatch({ type: SEND_COMMUNITY_MESSAGE_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: SEND_COMMUNITY_MESSAGE_FAILURE, error: error.message });
    }
  };



// sendCommunityMessage

///////////
export const sendGroupMessage =
  (userId, groupID, message) => async (dispatch) => {
    dispatch({ type: SEND_MESSAGE_REQUEST });
    const endpoint = API_REQUESTS.SENDGROUP_MESSAGE;
    try {
      const response = await sendRequest(
        endpoint,
        {
          userid: userId,
          groupid: groupID,
          message: message,
        },
        {}
      );
      dispatch({ type: SEND_MESSAGE_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: SEND_MESSAGE_FAILURE, error: error.message });
    }
  };

///////////////////////

export const createConversation =
  (userId, touserName, message) => async (dispatch) => {
    dispatch({ type: CREATE_CONVERSATION_REQUEST });
    const endpoint = API_REQUESTS.CREATE_CONVERSATION;
    try {
      const response = await sendRequest(
        endpoint,
        {
          userid: userId,
          tousername: touserName,
          message: message,
        },
        {}
      );
      dispatch({ type: CREATE_CONVERSATION_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: CREATE_CONVERSATION_FAILURE, error: error.message });
    }
  };

////////////////////

export const checkFlames = (userId, firstPersonName, secondPersonName) => async (dispatch) => {
  dispatch({ type: CHECK_FLAMES_REQUEST });
  const endpoint = API_REQUESTS.CHECK_FLAMES;
  try {
    const response = await sendRequest(endpoint, {
      userid: userId,
      firstpersonname: firstPersonName,
      secondpersonname: secondPersonName,
    }, {});

    // Dispatch the success action with the response data
    dispatch({ type: CHECK_FLAMES_SUCCESS, payload: response.data });
    // Return the response data to the caller
    return response.data;

  } catch (error) {
    // Dispatch the failure action with the error message
    dispatch({ type: CHECK_FLAMES_FAILURE, error: error.message });

    // Optionally return a fallback value or rethrow the error
    throw new Error(error.message);
  }
};


////////
////////////////

export const toCreateCommunity =
  (userId, touserName, message) => async (dispatch) => {
    dispatch({ type: CREATE_COMMUNITY_REQUEST });
    const endpoint = API_REQUESTS.CREATE_COMMUNITY;
    try {
      const response = await sendRequest(
        endpoint,
        {
          // userid: userId,
          // tousername: touserName,
          // message: message,
        },
        {}
      );
      dispatch({ type: CREATE_COMMUNITY_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: CREATE_COMMUNITY_FAILURE, error: error.message });
    }
  };

///////////////

///////////////////////

export const addGroupCommunity = (userId, communityId, groups, callback) => async (dispatch) => {
  dispatch({ type: ADD_GROUP_COMMUNITY_REQUEST });
  const endpoint = API_REQUESTS.ADD_GROUP_COMMUNITY;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        communityid: communityId,
        groupsid: groups.join(","),
      },
      {}
    );
    callback(response);
    return response;
    dispatch({ type: ADD_GROUP_COMMUNITY_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: ADD_GROUP_COMMUNITY_FAILURE, error: error.message });
  }
};




// updateUserStatus
export const updateUserStatus = (userId, status, callback) => async (dispatch) => {
  dispatch({ type: UPDATE_USERTSTUS_REQUEST });
  const endpoint = API_REQUESTS.UPDATE_USER_STATUS;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        status: status,
      },
      {}
    );
    dispatch({ type: UPDATE_USERTSTUS_SUCCESS, payload: response.data });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: UPDATE_USERTSTUS_FAILURE, error: error.message });
  }
};


// Update User Profile with New Phone
export const updateUserProfileNewPhone =
  (phoneData, headers) => async (dispatch) => {
    dispatch({ type: UPDATE_PROFILE_USER_NEW_PHONE_REQUEST });
    try {
      const response = await sendRequest(
        API_REQUESTS.UPDATE_PROFILE_USER_NEW_PHONE,
        phoneData,
        headers
      );
      dispatch({
        type: UPDATE_PROFILE_USER_NEW_PHONE_SUCCESS,
        payload: response,
      });

    } catch (error) {
      dispatch({
        type: UPDATE_PROFILE_USER_NEW_PHONE_FAILURE,
        error: error.message,
      });
    }
  };

// Change User MPIN
export const changeUserMpin = (mpinData, headers) => async (dispatch) => {
  dispatch({ type: CHANGE_USER_MPIN_REQUEST });
  try {
    const response = await sendRequest(
      API_REQUESTS.CHANGE_USER_MPIN,
      mpinData,
      headers
    );
    dispatch({ type: CHANGE_USER_MPIN_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: CHANGE_USER_MPIN_FAILURE, error: error.message });
  }
};


// GEt STICKERS
export const getStickerArray = (userId, callback) => async (dispatch) => {
  dispatch({ type: GET_STICKERS_ARRAY_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_STICKERS_LIST;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,

      },
    );
    dispatch({ type: GET_STICKERS_ARRAY_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GET_STICKERS_ARRAY_FAILURE, error: error.message });
  }
};

// getWallpaperArray
export const getWallpaperArray = (userId, callback) => async (dispatch) => {
  dispatch({ type: GET_WALLPAPER_ARRAY_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_WALLPAPER_LIST;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,

      },
    );
    dispatch({ type: GET_WALLPAPER_ARRAY_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GET_WALLPAPER_ARRAY_FAILURE, error: error.message });
  }
};

// getMediaShared
export const getMediaShared = (userId, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.GET_MEDIA_SHARED_LIST;
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
      },
    );
    callback(response);
    // alert(JSON.stringify(response))
    return response;
  } catch (error) {
    console.log(error,"err")
  }
};

// getBlockedUserList

export const getBlockedUserList = (userId, callback) => async (dispatch) => {
  dispatch({ type: GET_BLOCK_USER_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_BLOCKED_USER_LIST;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,

      },
    );
    dispatch({ type: GET_BLOCK_USERS_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: GET_BLOCK_USER_FAILURE, error: error.message });
  }
};
// userUnblock

export const userUnblock = (userId, toUserId, callback) => async (dispatch) => {
  dispatch({ type: UNBLOCK_USER_REQUEST });
  try {
    const endpoint = API_REQUESTS.BLOCK_USER_BY_ID;

    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
        blockuserid: toUserId
      },
    );
    dispatch({ type: UNBLOCK_USER_SUCCESS, payload: response });
    callback(response);
    return response;
  } catch (error) {
    dispatch({ type: UNBLOCK_USER_FAILURE, error: error.message });
  }
};

// getCallHistoryList'
export const getCallHistoryList = (userId, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.GET_CALL_HISTORY_ID;
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
      },
    );
    callback(response);
    return response;
  } catch (error) {
    console.log('error', error)
  }
};

// getSlamnCoversationList
export const getSlamnCoversationList = (userId, callback) => async (dispatch) => {
  dispatch({ type: GET_SLAM_CONVO_ARRAY_REQUEST });
  const endpoint = API_REQUESTS.GET_SLAM_CONVO;
  try {
    const response = await sendRequest(
      endpoint,
      {
        userid: userId,
      },
    );
    // alert(JSON.stringify(response.data))
    dispatch({ type: GET_SLAM_CONVO_ARRAY_SUCCESS, payload: response.data });
    callback(response)
    return (response)
  } catch (error) {
    dispatch({ type: GET_SLAM_CONVO_ARRAY_FAILURE, error: error.message });
  }
};


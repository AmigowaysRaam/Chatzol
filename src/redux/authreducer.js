import SlamBook from "../screens/SlamBook/SlamBook";
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
  GETGROUPMESSAGE_REQUEST,
  GETGROUPMESSAGE_SUCCESS,
  GETGROUPMESSAGE_FAILURE,

  GETGROUPLIST_REQUEST,
  GETGROUPLIST_SUCCESS,
  GETGROUPLIST_FAILURE,

  GET_STICKERS_ARRAY_REQUEST,
  GET_STICKERS_ARRAY_SUCCESS,
  GET_STICKERS_ARRAY_FAILURE,

  GET_WALLPAPER_ARRAY_REQUEST,
  GET_WALLPAPER_ARRAY_SUCCESS,
  GET_WALLPAPER_ARRAY_FAILURE,



  GET_SLAM_CONVO_ARRAY_REQUEST,
  GET_SLAM_CONVO_ARRAY_SUCCESS,
  GET_SLAM_CONVO_ARRAY_FAILURE,

  GET_COMMUNITY_MESSAGE_REQUEST,
  GET_COMMUNITY_MESSAGE_SUCCESS,
  GET_COMMUNITY_MESSAGE_FAILURE,

  GET_SITE_DETAILS_REQUEST,
  GET_SITE_DETAILS_SUCCESS,
  GET_SITE_DETAILS_FAILURE,


} from "./actionsTypes";

const initialState = {
  isLoggedIn: false,
  isFirstTime: false,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  user: null,
  error: null,
  lerror: null,
  mpinSent: false,
  registered: false,
  confirmed: false,
  loginConfirmed: false,
  profile: null,
  conversationList: [],
  messageList: {},
  groupMessageList: {},
  groupMessageListLoading: false,
  messageSending: [],
  messageSender: [],
  flamesResults: null,
  groupCommunity: [],
  groupList: null,
  CommunityList: {},
  stickersList: null,
  wallpaperList: null,
  SlamBookConvoArray: null,
  getCommunityMessageList: [],
  getFrontSite: null
};

const authReducer = (state = initialState, action) => {

  switch (action.type) {
    // Generate Token
    case APP_GENERATE_TOKEN_REQUEST:
      console.log("APP_GENERATE_TOKEN_SUCCESS", state);
      return {
        ...state,
        isLoading: true,
      };
    case APP_GENERATE_TOKEN_SUCCESS:
      console.log("generateTokenSuccess", action.payload);
      return {
        ...state,
        token: action.payload,
        isLoading: false,
        error: null,
      };
    case APP_GENERATE_TOKEN_FAILURE:
      console.log("generateTokenfailure");
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };


    //get Sticker
    case GET_STICKERS_ARRAY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_STICKERS_ARRAY_SUCCESS:
      return {
        ...state,
        stickersList: action.payload.data,
        isLoading: false,
        error: null,
      };
    case GET_STICKERS_ARRAY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };


    //get Wallpaper
    case GET_WALLPAPER_ARRAY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_WALLPAPER_ARRAY_SUCCESS:
      return {
        ...state,
        wallpaperList: action.payload.data,
        isLoading: false,
        error: null,
      };
    case GET_WALLPAPER_ARRAY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    //     GET_SITE_DETAILS_REQUEST,
    //       GET_SITE_DETAILS_SUCCESS,
    // // GET_SITE_DETAILS_FAILURE,
    case GET_SITE_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_SITE_DETAILS_SUCCESS:
      return {
        ...state,
        getFrontSite: action.payload.data,
        isLoading: false,
        error: null,
      };
    case GET_SITE_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    //get slam convo
    case GET_SLAM_CONVO_ARRAY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_SLAM_CONVO_ARRAY_SUCCESS:
      return {
        ...state,
        SlamBookConvoArray: action.payload.data,
        isLoading: false,
        error: null,
      };
    case GET_SLAM_CONVO_ARRAY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };



    // Register User
    case REGISTER_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        registered: true,
        isLoading: false,
        error: null,
      };
    case REGISTER_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // Confirm Registration
    case REGISTER_USER_CONFIRM_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case REGISTER_USER_CONFIRM_SUCCESS:
      return {
        ...state,
        confirmed: true,
        isLoading: false,
        error: null,
      };
    case REGISTER_USER_CONFIRM_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // Confirm Registration PIN
    case REGISTER_USER_CONFIRM_PIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case REGISTER_USER_CONFIRM_PIN_SUCCESS:
      return {
        ...state,
        confirmed: true,
        isLoading: false,
        error: null,
      };
    case REGISTER_USER_CONFIRM_PIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // Login User
    case LOGIN_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        lerror: null

      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        lerror: null
      };
    case LOGIN_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        lerror: action.error,
      };

    case LOGOUT:
      return {
        ...initialState,
      };

    // Confirm Login PIN
    case LOGIN_USER_CONFIRM_PIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_USER_CONFIRM_PIN_SUCCESS:
      return {
        ...state,
        loginConfirmed: true,
        isLoading: false,
        error: null,
      };
    case LOGIN_USER_CONFIRM_PIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // Forgot MPIN
    case FORGOT_USER_MPIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case FORGOT_USER_MPIN_SUCCESS:
      return {
        ...state,
        mpinSent: true,
        isLoading: false,
        error: null,
      };
    case FORGOT_USER_MPIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // Reset MPIN
    case RESET_USER_MPIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case RESET_USER_MPIN_SUCCESS:
      return {
        ...state,
        mpinSent: false,
        isLoading: false,
        error: null,
      };
    case RESET_USER_MPIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // Edit User Profile
    case EDIT_PROFILE_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case EDIT_PROFILE_USER_SUCCESS:
      return {
        ...state,
        profile: action.payload.data,
        isLoading: false,
        error: null,
      };
    case EDIT_PROFILE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // Update User Profile
    case UPDATE_PROFILE_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case UPDATE_PROFILE_USER_SUCCESS:
      return {
        ...state,
        profile: { ...state.profile, ...action.payload.data },
        isLoading: false,
        error: null,
      };
    case UPDATE_PROFILE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    case SEARCH_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SEARCH_USER_SUCCESS:
      return {
        ...state,
        searchedUsers: action.payload,
        isLoading: false,
      };
    case SEARCH_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    case LIST_CONVERSATION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LIST_CONVERSATION_SUCCESS:
      return {
        ...state,
        conversationList: action.payload,
        isLoading: false,
      };
    case LIST_CONVERSATION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    case LIST_MESSAGES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LIST_MESSAGES_SUCCESS:
      return {
        ...state,
        messageList: { ...state.messageList, ...action.payload },
        isLoading: false,
      };
    case LIST_MESSAGES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    //
    case GETGROUPMESSAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        groupMessageListLoading: true
      };
    case GETGROUPMESSAGE_SUCCESS:
      return {
        ...state,
        groupMessageList: { ...state.groupMessageList, ...action.payload },
        isLoading: false,
        groupMessageListLoading: false
      };
    case GETGROUPMESSAGE_FAILURE:
      return {
        ...state,
        isLoading: false,
        groupMessageListLoading: false,
        error: action.error,
      };


    //get Community LIst

    case GET_COMMUNITY_MESSAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_COMMUNITY_MESSAGE_SUCCESS:
      return {
        ...state,
        getCommunityMessageList: { ...state.getCommunityMessageList, ...action.payload },
        isLoading: false,
      };
    case GET_COMMUNITY_MESSAGE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };


    // Get Group List

    case GETGROUPLIST_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GETGROUPLIST_SUCCESS:
      return {
        ...state,
        groupList: { ...state.groupList, ...action.payload },

        isLoading: false,
      };
    case GETGROUPLIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    //


    case SEND_MESSAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        messageSending: action.payload,
        // messageSending: { ...state.messageSend, ...action.payload.data },
        isLoading: false,
      };
    case SEND_MESSAGE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    //////////

    /////////////////////

    case CREATE_CONVERSATION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CREATE_CONVERSATION_SUCCESS:
      return {
        ...state,
        messageSender: action.payload,

        isLoading: false,
      };
    case CREATE_CONVERSATION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    /////////

    ////////

    case CHECK_FLAMES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CHECK_FLAMES_SUCCESS:
      return {
        ...state,
        flamesResults: action.payload,
        isLoading: false,
      };
    case CHECK_FLAMES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    ////////
    ///////

    case CREATE_COMMUNITY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CREATE_COMMUNITY_SUCCESS:
      return {
        ...state,
        flamesResults: action.payload,

        isLoading: false,
      };
    case CREATE_COMMUNITY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    ////////
    ///////

    case ADD_GROUP_COMMUNITY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_GROUP_COMMUNITY_SUCCESS:
      return {
        ...state,
        groupCommunity: action.payload,

        isLoading: false,
      };
    case ADD_GROUP_COMMUNITY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // Update User Profile with New Phone
    case UPDATE_PROFILE_USER_NEW_PHONE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case UPDATE_PROFILE_USER_NEW_PHONE_SUCCESS:
      return {
        ...state,
        profile: { ...state.profile, phone: action.payload.phone },
        isLoading: false,
        error: null,
      };
    case UPDATE_PROFILE_USER_NEW_PHONE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // Change User MPIN
    case CHANGE_USER_MPIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CHANGE_USER_MPIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case CHANGE_USER_MPIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default authReducer;

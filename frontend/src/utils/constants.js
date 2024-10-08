export const HOST = import.meta.env.VITE_URL; 

export const AUTH_ROUTES = "/api/auth"; 
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`; 
export const UPDATE_PROFILE = `${AUTH_ROUTES}/update-profile`; 
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`; 
import axios from "axios";
import { setIsLoggedIn, setToken, setUser } from "../reducers/auth";
import { toast } from "react-toastify";

export const login = (data, navigate) => async (dispatch) => {
  try {
 

    const response = await axios.post(
      `https://be-airticket-a6bnbhk5xa-as.a.run.app/api/auth/login`,
      data,
      { "Content-Type": "application/json" } 
    );

    const { token } = response?.data; 

    dispatch(setToken(token));
    dispatch(setIsLoggedIn(true));
    console.log(token)
    toast.success("Log in succes");
    navigate("/");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error?.response?.data?.message|| error?.message);
      return;
    }
    toast.error(error.message);
  }
};

export const register = (data, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_AUTH_AirTicket}/api/auth/register`,
      data,
      { "Content-Type": "application/json" }
    );  

    const { token } = response?.data;

    dispatch(setToken(token));
    dispatch(setIsLoggedIn(true));

    navigate("/");
  } catch (error) {

    if (axios.isAxiosError(error)) {
      toast.error(error?.response?.data?.message|| error?.message) 
 
      return;
    }
    toast.error(error.message);
  }
};


export const getProfile = (navigate) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;

    const response = await axios.get(
      `${process.env.REACT_APP_AUTH_AirTicket}/api/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { data } = response?.data;
    dispatch(setUser(data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error?.response?.data?.message);
      if (error?.response?.status === 401) {
        dispatch(logout(navigate));
      }
      return;
    }

    toast.error(error.message);
  }
};

export const logout = (navigate) => async (dispatch) => {
  dispatch(setToken(null));
  dispatch(setIsLoggedIn(false));
  dispatch(setUser(null));

  // redirect to home
  if (navigate) navigate("/login");
};
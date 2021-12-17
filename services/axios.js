import axios from "axios";
import { AppConstants } from "constants";

export const getBaseUrl = (domain) => {
  return `${AppConstants.PROTOCOL}://${domain}/wp-json/`;
};

// NOTE: the baseURL and Authorization Header will be set upon successful login,
// for subsequent reuse with JWT, etc... (see: hooks/useMyUser::login(..))
const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: AppConstants.TIMEOUT,
});
// TODO: intercept timeout error and provide better message (useRequest)
export default instance;

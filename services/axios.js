import axios from "axios";
import { AppConstants } from "constants";

// TODO: https://github.com/axios/axios#cancellation
// AbortController

// NOTE: the baseURL and Authorization Header will be set upon successful login,
// for subsequent reuse with JWT, etc... (see: hooks/use-auth.js)
const instance = axios.create({
  headers: {
    "Content-Type": AppConstants.CONTENT_TYPE_JSON,
  },
  timeout: AppConstants.TIMEOUT,
});
// TODO: intercept timeout error and provide better message (useRequest)
export default instance;

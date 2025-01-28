export const ANSWERS = "answers";

export const QUESTIONS = "questions";

export const ACTIVE_ID = "activeId";

export const EMAIL_ID = "email";

export const F_NAME = "firstName";

export const L_NAME = "lastName";

export const SCORE = "score";

export const LETTERN_PATTERN = /^[A-Za-z]+$/;

export const EMAIL_PATTERN =
  /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export const IMAGE_URL =
  "https://static.wixstatic.com/media/bd5ec7_5eb8282503b74bbdbf0c66ab1256d752~mv2.png/v1/fill/w_272,h_84,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo%20gray.png";

export const COMPANY_CAPTION = "Digital | Cloud | Data | Cybersecurity";

export const ROUTES_MAP = {
  QUESTIONS: "/questions",
  RESULTS: "/sqshft-results",
  LOGIN: "/",
  ANY: "*",
};

export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

export const API_END_POINTS = {
  START_TEST: "",
  SUBMIT_TEST: "/api/submit-test",
  GET_QUESTIONS: "/api/get-questions",
  GET_RESULTS: "/api/get-results",
};

export const API_METHODS = {
  GET: "get",
  POST: "post",
};

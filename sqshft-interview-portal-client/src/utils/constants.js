export const ANSWERS = "answers";

export const ACTIVE_ID = "activeId";

export const EMAIL_ID = "email";

export const F_NAME = "firstName";

export const L_NAME = "lastName";

export const SCORE = "score";

export const LETTERN_PATTERN = /^[A-Za-z]+$/;

export const EMAIL_PATTERN =
  /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export const QUESTIONS = [
  {
    question_id: "q1",
    is_multiple: false,
    question: "What is JavaScript?",
    code_block: {},
    hint: `
To create a sticky navbar, you use the position: fixed; CSS property to “stick” your navbar to the viewport, and position: sticky; to make it stick to its parent element. In this post, you'll learn what all of this means, and how to make a sticky navbar for your own site.
    `,
    options: [
      {
        option_id: "1",
        value:
          "JavaScript is a scripting language used to make the website interactive",
      },
      {
        option_id: "2",
        value:
          "JavaScript is an assembly language used to make the website interactive",
      },
      {
        option_id: "3",
        value:
          "JavaScript is a compiled language used to make the website interactive",
      },
      {
        option_id: "4",
        value: "None of the above",
      },
    ],
  },
  {
    question_id: "q2",
    is_multiple: false,
    question: "Which of the following is correct about JavaScript?",
    code_block: {},
    options: [
      {
        option_id: "1",
        value: "JavaScript is an Object-Based language",
      },
      {
        option_id: "2",
        value: "JavaScript is Assembly-language",
      },
      {
        option_id: "3",
        value: "JavaScript is an Object-Oriented language",
      },
      {
        option_id: "4",
        value: "JavaScript is a High-level language",
      },
    ],
  },
  {
    question_id: "q3",
    is_multiple: false,
    question:
      " Among the given statements, which statement defines closures in JavaScript?",
    code_block: {},
    options: [
      {
        option_id: "1",
        value:
          "JavaScript is a function that is enclosed with references to its inner function scope",
      },
      {
        option_id: "2",
        value:
          "JavaScript is a function that is enclosed with references to its lexical environment",
      },
      {
        option_id: "3",
        value:
          "JavaScript is a function that is enclosed with the object to its inner function scope",
      },
      {
        option_id: "4",
        value: "None of the mentioned",
      },
    ],
  },
  {
    question_id: "q4",
    is_multiple: false,
    question:
      "What will be the output of the following JavaScript code snippet?",
    code_block: {
      code_string: `
      <p id = "demo" > < /p>
      var txt1 = "Sanfoundry_";
      var txt2 = "Javascriptmcq";
      document.getElementById("demo").innerHTML = txt1 + txt2;
      `,
      language: "javascript",
    },
    options: [
      {
        option_id: "1",
        value: "error",
      },
      {
        option_id: "2",
        value: "Sanfoundry_ Javascriptmcq",
      },
      {
        option_id: "3",
        value: "undefined",
      },
      {
        option_id: "4",
        value: "Sanfoundry_Javascriptmcq",
      },
    ],
  },
  {
    question_id: "q5",
    is_multiple: true,
    question:
      "Arrays in JavaScript are defined by which of the following statements?",
    code_block: {},
    options: [
      {
        option_id: "1",
        value: "It is an ordered list of values",
      },
      {
        option_id: "2",
        value: "It is an ordered list of objects",
      },
      {
        option_id: "3",
        value: "It is an ordered list of string",
      },
      {
        option_id: "4",
        value: "It is an ordered list of functions",
      },
    ],
  },
];
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
  process.env.REACT_APP_API_URL;

export const API_END_POINTS = {
  START_TEST: "",
  SUBMIT_TEST: "/submit-test",
  GET_QUESTIONS: "/get-questions",
  GET_RESULTS: "/get-results",
};

export const API_METHODS = {
  GET: "get",
  POST: "post",
};

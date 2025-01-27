const fs = require("firebase-admin");
const serviceAccount = require("../service-drive.json");
require("dotenv").config();

const Questions = require("../InterviewQuestions");

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});
const db = fs.firestore();

const candidatesCollection = db.collection("candidates");
const questionsCollection = db.collection("questions");
const answersKeyCollection = db.collection("answerkey");

const shuffleAndPick = (data, count) => {
  const shuffled = data.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const startTest = async (req, res) => {
  try {
    const { email = "", firstName = "" } = req.body;
    const candidateRef = candidatesCollection.doc(email);
    const doc = await candidateRef.get();
    if (!doc.exists) {
      const response = await candidateRef.set(req.body);
      res.status(200).send({
        success: true,
        message: response,
      });
    } else {
      res.status(200).send({
        success: false,
        message: `Dear ${firstName} \n You have already taken up the test.`,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Unable to start test. Please contact admin.",
      error,
    });
  }
};

const addQuestion = async (req, res) => {
  try {
    const { question_id = "" } = req.body;
    const newQuestion = questionsCollection.doc(question_id);
    const response = await newQuestion.set(req.body);
    res.status(200).send({
      success: true,
      message: response,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Unable to start test. Please contact admin.",
      error,
    });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const splitArray = (arr, size) => {
      let arrays = [];
      while (arr.length > 0) arrays.push(arr.splice(0, size));
      return arrays;
    };

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    let response = [];
    const snapshot = await questionsCollection.get();
    snapshot.forEach((doc) => {
      response.push(doc.data());
    });
    response = response.sort(function (a, b) {
      return parseInt(a.question_id) < parseInt(b.question_id)
        ? -1
        : parseInt(a.question_id) > parseInt(b.question_id)
        ? 1
        : 0;
    });
    response = splitArray(response, 5);
    let holder = [];
    response.forEach((ele) => {
      holder = [...holder, ...shuffle(ele)];
    });
    res.status(200).send({
      success: true,
      data: holder,
      message: "",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      data: [],
      message: "Unable to fetch questions",
    });
  }
};

const submitTest = async (req, res) => {
  try {
    const { answers, email = "", firstName = "", lastName = "" } = req.body;
    const candidateRef = candidatesCollection.doc(email);
    const doc = await candidateRef.get();
    if (doc.exists) {
      let score = 0;
      var answerkey = {};
      const snapshot = await answersKeyCollection.get();
      snapshot.forEach((doc) => {
        answerkey = { ...doc.data() };
      });
      Object.keys(answerkey).forEach((question_id) => {
        if (
          answerkey[question_id].every((option) =>
            answers[question_id]?.includes(option)
          )
        ) {
          score++;
        }
      });
      const response = await candidateRef.set({
        firstName,
        lastName,
        email,
        answers,
        score,
      });
      res.status(201).send({
        success: true,
        data: response,
        message: "Answers submitted",
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Unable to submit answer",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Unable to submit answer",
    });
  }
};

const getResults = async (req, res) => {
  try {
    const response = [];
    const snapshot = await candidatesCollection.get();
    snapshot.forEach((doc) => {
      response.push(doc.data());
    });
    res.status(200).send({
      success: false,
      data: response.sort(function (a, b) {
        return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
      }),
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      data: [],
      message: "Unable to retrieve results",
    });
  }
};

// GET USERS QUESTION
const getUserQuestions = async (req, res) => {
  const DEFAULT_CONFIG = {
    prog: { easy: 5, medium: 3, hard: 2 },
    logical: { easy: 2, medium: 1, hard: 2 },
    quants: { easy: 2, medium: 1, hard: 2 },
  };
  const CONFIG = JSON.parse(process.env.CONFIG) || DEFAULT_CONFIG;

  const groupedQuestions = Object.entries(CONFIG).flatMap(([type, levels]) => {
    return Object.entries(levels).flatMap(([level, count]) => {
      const filteredQuestions = Questions.filter(
        (q) => q.type === type && q.level === level
      );
      return shuffleAndPick(filteredQuestions, count);
    });
  });

  const questionsWithoutAnswers = [...groupedQuestions].map((question) => {
    const { answer, ...questionWithoutAnswer } = question; // remove answers to frontend.
    return questionWithoutAnswer;
  });

  res.status(200).send({
    success: true,
    data: questionsWithoutAnswers,
  });
};

// POST USER ANSWER
const submitUserTest = async (req, res) => {
  try {
    const {
      selectedAnswers,
      email = "",
      firstName = "",
      lastName = "",
    } = req.body;
    const candidateRef = candidatesCollection.doc(email);
    const doc = await candidateRef.get();
    if (doc.exists) {
      const response = await candidateRef.set({
        firstName,
        lastName,
        email,
        answers: selectedAnswers,
      });
      res.status(201).send({
        success: true,
        data: response,
        message: "Answers submitted",
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Unable to submit answer",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong! please contact admin",
    });
  }
};

module.exports = {
  getAllQuestions,
  submitTest,
  getResults,
  startTest,
  addQuestion,
  getUserQuestions,
  submitUserTest,
};

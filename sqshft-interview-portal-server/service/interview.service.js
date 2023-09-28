const fs = require("firebase-admin");
const serviceAccount = require("../cit-drive-5d265664c3f7.json");
fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});
const db = fs.firestore();

const candidatesCollection = db.collection("candidates");
const answersCollection = db.collection("answers");
const questionsCollection = db.collection("questions");
const answersKeyCollection = db.collection("answerkey");

const startTest = async (req, res) => {
  try {
    const { email = "", firstName = "" } = req.body;
    const candidateRef = candidatesCollection.doc(email);
    const doc = await candidateRef.get();
    if (!doc.exists) {
      const newCandidate = candidatesCollection.doc(email);
      const response = await newCandidate.set(req.body);
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
    const response = [];
    const snapshot = await questionsCollection.get();
    snapshot.forEach((doc) => {
      response.push(doc.data());
    });
    res.status(200).send({
      success: true,
      data: response,
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
    const newAnswer = answersCollection.doc(email);
    const response = await newAnswer.set({ email, firstName, lastName, score });
    res.status(201).send({
      success: true,
      data: response,
      message: "Answers submitted",
    });
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
    const snapshot = await answersCollection.get();
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

module.exports = {
  getAllQuestions,
  submitTest,
  getResults,
  startTest,
  addQuestion,
};

const fs = require("firebase-admin");
const serviceAccount = require("../service-drive.json");
require("dotenv").config();

const Questions = require("../InterviewQuestions");

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});
const db = fs.firestore();

const candidatesCollection = db.collection("candidates");

const shuffleAndPick = (data, count) => {
  const shuffled = data.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// ROUTE: Start the test
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

// ROUTE:  GET USERS QUESTION
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

// ROUTE: POST USER ANSWER
const submitUserTest = async (req, res) => {
  try {
    const {
      selectedAnswers = {},
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

// ROUTE: GET REPORT FOR ALL USERS
const getAllUserReports = async (req, res) => {
  try {
    const snapshot = await candidatesCollection.get();
    if (snapshot.empty) {
      return res.status(404).send({
        success: false,
        message: "No users found.",
      });
    }

    const report = [];

    snapshot.forEach((doc) => {
      const userData = doc.data();
      const { firstName, lastName, email, answers = {} } = userData;

      // Configuration for total questions per section
      const DEFAULT_CONFIG = {
        prog: 10, // Total number of questions in 'prog'
        logical: 5, // Total number of questions in 'logical'
        quants: 5, // Total number of questions in 'quants'
      };

      const sectionScores = {
        prog: 0,
        logical: 0,
        quants: 0,
      };

      const sectionAttempted = {
        prog: 0,
        logical: 0,
        quants: 0,
      };

      // Iterate through the answers object
      Object.entries(answers).forEach(([questionId, selectedOptions]) => {
        const question = Questions.find((q) => q.id === parseInt(questionId)); // Find the question by ID

        if (question) {
          sectionAttempted[question.type] += 1; // Increment attempted questions count for the section

          // Normalize the question's correct answer to an array of IDs
          const correctAnswers = question.answer.map((a) => a.id);

          // Check if the user's selected options match the correct answers
          const isCorrect =
            correctAnswers.length === selectedOptions.length &&
            correctAnswers.every((answerId) =>
              selectedOptions.includes(answerId)
            );

          if (isCorrect) {
            sectionScores[question.type] += 1; // Increment score for the correct section
          }
        } else {
          console.log(`Question not found for ID: ${questionId}`);
        }
      });

      // Construct scores object with attempted count
      const scores = Object.entries(sectionScores).reduce(
        (acc, [section, score]) => {
          acc[section] = {
            scorePercentage: ((score / DEFAULT_CONFIG[section]) * 100).toFixed(
              2
            ),
            attempted: sectionAttempted[section], // Add the attempted count
          };
          return acc;
        },
        {}
      );

      // Add user report
      report.push({
        firstName,
        lastName,
        email,
        scores,
      });
    });

    // Send the report
    res.status(200).send({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send({
      success: false,
      message: "Unable to generate report. Please contact admin.",
      error,
    });
  }
};

module.exports = {
  startTest,
  getAllUserReports,
  getUserQuestions,
  submitUserTest,
};

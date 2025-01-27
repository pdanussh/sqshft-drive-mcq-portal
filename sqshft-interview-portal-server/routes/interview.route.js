const router = require('express').Router()
const InterviewService = require('../service/interview.service')

router.post("/",InterviewService.startTest)
// router.post("/add-question",InterviewService.addQuestion)
// router.get("/get-questions",InterviewService.getAllQuestions)

// // router.post("/submit-test",InterviewService.submitTest)
// // router.get("/get-questions",InterviewService.getAllQuestions)

// router.get("/get-results",InterviewService.getResults)

// MCQ routes V2
router.get("/api/get-questions",InterviewService.getUserQuestions)
router.post("/api/submit-test",InterviewService.submitUserTest)
router.get("/api/get-results",InterviewService.getAllUserReports)



module.exports = router;
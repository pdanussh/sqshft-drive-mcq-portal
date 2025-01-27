const router = require('express').Router()
const InterviewService = require('../service/interview.service')

router.post("/",InterviewService.startTest)

// MCQ routes V2
router.get("/api/get-questions",InterviewService.getUserQuestions)
router.post("/api/submit-test",InterviewService.submitUserTest)
router.get("/api/get-results",InterviewService.getAllUserReports)



module.exports = router;
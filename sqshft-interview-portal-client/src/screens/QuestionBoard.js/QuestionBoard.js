import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "../../components/navbar";
import {
  API_END_POINTS,
  API_METHODS,
  EMAIL_ID,
  F_NAME,
  L_NAME,
} from "../../utils/constants";
import { makeAPICall } from "../../utils/helpers";
import Loading from "react-fullscreen-loading";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal";

const QuestionBoard = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [testCompleted, setTestCompleted] = useState(false);

  const handleOptionChange = (optionId) => {
    const currentQuestion = questions[currentIndex];
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev };

      if (currentQuestion.isMultiSelect) {
        const currentSelections = newAnswers[currentQuestion.id] || [];
        newAnswers[currentQuestion.id] = currentSelections.includes(optionId)
          ? currentSelections.filter((id) => id !== optionId)
          : [...currentSelections, optionId];
      } else {
        newAnswers[currentQuestion.id] = [optionId];
      }

      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = await makeAPICall({
      endpoint: API_END_POINTS.SUBMIT_TEST,
      method: API_METHODS.POST,
      body: {
        firstName: localStorage.getItem(F_NAME),
        lastName: localStorage.getItem(L_NAME) || "",
        email: localStorage.getItem(EMAIL_ID),
        selectedAnswers,
      },
    });
    setLoading(false);
    if (data?.success) {
      setShowModal(true);
      setModalContent(
        `Hello ${localStorage.getItem(F_NAME)} ${localStorage.getItem(
          L_NAME
        )}, You have completed the test.`
      );
      localStorage.clear();
      setTestCompleted(true);
    } else {
      setShowModal(true);
      setModalContent("Unable to submit the answers. Please try again");
    }
  };

  const handleHideModal = () => {
    setShowModal(false);
    setModalContent("");
    if (testCompleted) {
      navigate("/");
    }
  };

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await makeAPICall({
          endpoint: API_END_POINTS.GET_QUESTIONS,
        });
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      localStorage.clear();
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Cleanup event listener when component is unmounted
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (questions.length === 0)
    return <Loading loading background="#FFF" loaderColor="#257d256b" />;

  const currentQuestion = questions[currentIndex];
  const currentSelections = selectedAnswers[currentQuestion.id] || [];
  return (
    <>
      <Navbar />
      {loading ? (
        <Loading loading background="#FFF" loaderColor="#257d256b" />
      ) : (
        <div className="container mt-5">
          <div className="card">
            <div className="card-body mt-5">
              <h2 className="card-title mb-4">
                Question {currentIndex + 1}/{questions?.length}
              </h2>
              <p className="card-text mb-4">{currentQuestion.Ques}</p>

              {currentQuestion.quesImage && (
                <img
                  src={currentQuestion.quesImage}
                  alt="Question"
                  className="img-fluid mb-4"
                />
              )}

              {currentQuestion.codeBlock && (
                <pre className="bg-light p-3 rounded mb-4">
                  <code>{currentQuestion.codeBlock}</code>
                </pre>
              )}

              <div className="mb-4">
                {currentQuestion.options.map((option) => (
                  <div className="form-check" key={option.id}>
                    <input
                      className="form-check-input"
                      type={
                        currentQuestion.isMultiSelect ? "checkbox" : "radio"
                      }
                      name={`options-${currentQuestion.id}`}
                      value={option.id}
                      checked={currentSelections.includes(option.id)}
                      onChange={() => handleOptionChange(option.id)}
                    />
                    <label className="form-check-label">{option.option}</label>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-secondary"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={currentIndex >= questions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
            {currentIndex >= questions.length - 1 ? (
              <div className="d-flex justify-content-center mt-4 mb-2">
                <button className="btn btn-success" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <Modal
        show={showModal}
        hideModal={handleHideModal}
        content={modalContent}
      />
    </>
  );
};

export default QuestionBoard;

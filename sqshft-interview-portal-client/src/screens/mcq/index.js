import React, { useEffect, useState } from "react";
import { Option } from "../../components/option";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  ACTIVE_ID,
  ANSWERS,
  API_END_POINTS,
  API_METHODS,
  EMAIL_ID,
  F_NAME,
  L_NAME,
  QUESTIONS,
} from "../../utils/constants";
import { Navbar } from "../../components/navbar";
import "./index.css";
import { makeAPICall } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal";
import Loading from "react-fullscreen-loading";

export const MCQScreen = () => {
  const [activeId, setActiveId] = useState(
    parseInt(localStorage.getItem(ACTIVE_ID) || "0")
  );
  const [answers, setAnsers] = useState({});
  const [question, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [testCompleted, setTestCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const { data } = await makeAPICall({
        endpoint: API_END_POINTS.GET_QUESTIONS,
      });
      setQuestions(data);
      setLoading(false);
      localStorage.setItem(
        QUESTIONS,
        JSON.stringify(data)
      );
    };
    const savedAnswers = localStorage.getItem(ANSWERS);
    if (savedAnswers) {
      setAnsers(JSON.parse(savedAnswers));
    }
    const savedQuestions = localStorage.getItem(QUESTIONS);
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      fetchQuestions();
    }
  }, []);

  const onOptionChange = (options) => {
    setAnsers({ ...answers, [question[activeId]?.question_id]: options });
    localStorage.setItem(
      ANSWERS,
      JSON.stringify({ ...answers, [question[activeId]?.question_id]: options })
    );
  };

  const handleNavigation = (isForward) => {
    setActiveId(isForward ? activeId + 1 : activeId - 1);
    localStorage.setItem(ACTIVE_ID, isForward ? activeId + 1 : activeId - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = await makeAPICall({
      endpoint: API_END_POINTS.SUBMIT_TEST,
      method: API_METHODS.POST,
      body: {
        firstName: localStorage.getItem(F_NAME),
        lastName: localStorage.getItem(L_NAME),
        email: localStorage.getItem(EMAIL_ID),
        answers,
      },
    });
    setLoading(false);
    if (data?.success) {
      setShowModal(true);
      setModalContent(
        `Hello ${localStorage.getItem(F_NAME)}, You have completed the test.`
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

  const formatCodeString = (code_string) => {
    return code_string.replaceAll("\\n", "\n")
  }
  return (
    <React.Fragment>
      <Navbar />
      {loading ? (
        <Loading loading background="#FFF" loaderColor="#257d256b" />
      ) : (
        <>
          <div className="root-container">
            <div className="question-container">
              <h2>{"Question " + (activeId + 1)}</h2>
              <h5>{`Answered ${Object.keys(answers).length}/${
                question.length
              }`}</h5>
            </div>
            <div className="title-container">
              <h4 className="title-text">
                {question[activeId]?.question.split(".").map((question) => {
                  return (
                    <>
                      {question}
                      <br />
                      <br />
                    </>
                  );
                })}
              </h4>
              {question[activeId]?.hint?.length > 0 && (
                <>
                  <span
                    className="hint-text"
                    data-toggle="modal"
                    data-target="#exampleModal"
                  >
                    {"show hint"}
                  </span>
                  <div
                    className="modal fade "
                    id="exampleModal"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-body">
                          {question[activeId]?.hint}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {question[activeId]?.code_block?.code_string?.length > 0 && (
              <SyntaxHighlighter
                language={question[activeId]?.code_block?.language}
                style={dracula}
                wrapLines={true}
              >
                {`${formatCodeString(question[activeId]?.code_block?.code_string)}`}
              </SyntaxHighlighter>
            )}
            {question[activeId]?.image_url?.length > 0 && (
              <img
                src={question[activeId]?.image_url}
                alt="logo"
                className="img-container"
              />
            )}
            {question[activeId]?.options &&
              question[activeId]?.options.map((option) => (
                <Option
                  key={option.option_id}
                  isMultiSelect={question[activeId]?.is_multiple}
                  handleChange={onOptionChange}
                  label={option.value}
                  name={question[activeId]?.question_id?.toString()}
                  id={option.option_id}
                  values={answers[question[activeId]?.question_id] || []}
                />
              ))}
            <div className="button-container">
              <button
                type="button"
                className="btn btn-outline-primary button-custom"
                disabled={activeId === 0}
                onClick={() => handleNavigation(false)}
              >
                {"Previous"}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary button-custom"
                disabled={activeId === question.length - 1}
                onClick={() => handleNavigation(true)}
              >
                {"Next"}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary button-custom"
                disabled={Object.keys(answers).length !== question.length}
                onClick={async () => await handleSubmit()}
              >
                {"Submit answers"}
              </button>
            </div>
          </div>
          <Modal
            show={showModal}
            hideModal={handleHideModal}
            content={modalContent}
          />
        </>
      )}
    </React.Fragment>
  );
};

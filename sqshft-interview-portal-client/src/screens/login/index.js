import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import {
  API_END_POINTS,
  API_METHODS,
  COMPANY_CAPTION,
  EMAIL_ID,
  EMAIL_PATTERN,
  F_NAME,
  IMAGE_URL,
  LETTERN_PATTERN,
  L_NAME,
  ROUTES_MAP,
} from "../../utils/constants";
import { isUserLoggedIn, makeAPICall } from "../../utils/helpers";
import Modal from "../../components/modal";
import Loading from "react-fullscreen-loading";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [loading, setLoading] = useState(true);


  const navigate = useNavigate();
  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate(ROUTES_MAP.QUESTIONS);
    }
  }, []);

  const onStartButtonPress = async () => {
    if (!email.match(EMAIL_PATTERN)) {
      setShowModal(true);
      setModalContent("Please enter valid email");
      return;
    } else if (firstName.length < 2) {
      setShowModal(true);
      setModalContent("Please enter valid name.");
      return;
    }
    setLoading(true)
    const data = await makeAPICall({
      endpoint: API_END_POINTS.START_TEST,
      body: {
        firstName,
        lastName,
        email,
      },
      method: API_METHODS.POST,
    });
    if (data?.success) {
      localStorage.setItem(EMAIL_ID, email);
      localStorage.setItem(F_NAME, firstName);
      localStorage.setItem(L_NAME, lastName);
      navigate(ROUTES_MAP.QUESTIONS);
    } else {
      setShowModal(true);
      setModalContent(data?.message || "Kindly contact the admin");
    }
    setLoading(false)
  };

  if(loading){
    <Loading loading background="#FFF" loaderColor="#257d256b" />
  }

  return (
    <div className="row d-flex justify-content-center align-items-center">
      <div className="col-md-6 left-container custom-container">
        <img src={IMAGE_URL} className="img-fluid" alt=" "></img>
        <p className="lead mt-4">{COMPANY_CAPTION}</p>
      </div>
      <div className="col-md-6 custom-container">
        <input
          className="form-control w-75 m-3"
          value={firstName}
          type="text"
          placeholder="First Name"
          onChange={(e) =>
            (e.target.value.match(LETTERN_PATTERN) ||
              e.target.value.toString().length === 0) &&
            setFirstName(e.target.value)
          }
        />
        <input
          className="form-control w-75 m-3"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) =>
            (e.target.value.match(LETTERN_PATTERN) ||
              e.target.value.toString().length === 0) &&
            setLastName(e.target.value)
          }
        />
        <input
          type="email"
          className="form-control w-75 m-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={onStartButtonPress}
          disabled={firstName.length === 0 || email.length === 0}
        >
          Start test
        </button>
        <Modal
          show={showModal}
          hideModal={() => setShowModal(false)}
          content={modalContent}
        >
          Modal content
        </Modal>
      </div>
    </div>
  );
};

export default Login;

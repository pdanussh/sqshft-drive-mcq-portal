import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../../screens/login";
import ProtectedRoute from "./protectedroute";
import { ROUTES_MAP } from "../../utils/constants";
import { Results } from "../../screens/results";
import QuestionBoard from "../../screens/QuestionBoard.js/QuestionBoard";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_MAP.LOGIN} element={<Login />} />
        <Route exact path={ROUTES_MAP.QUESTIONS} element={<ProtectedRoute />}>
          <Route
            exact
            path={ROUTES_MAP.QUESTIONS}
            element={<QuestionBoard />}
          />
        </Route>
        <Route path={ROUTES_MAP.ANY} element={<Login />} />
        <Route path={ROUTES_MAP.RESULTS} element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;


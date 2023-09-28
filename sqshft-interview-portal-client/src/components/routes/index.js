import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../../screens/login";
import { MCQScreen } from "../../screens/mcq";
import ProtectedRoute from "./protectedroute";
import { ROUTES_MAP } from "../../utils/constants";
import { Results } from "../../screens/results";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_MAP.LOGIN} element={<Login />} />
        <Route exact path={ROUTES_MAP.QUESTIONS} element={<ProtectedRoute/>}>
            <Route exact path={ROUTES_MAP.QUESTIONS} element={<MCQScreen/>}/>
        </Route>
        <Route path={ROUTES_MAP.ANY} element={<Login />} />
        <Route path={ROUTES_MAP.RESULTS} element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;


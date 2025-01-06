import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectListPage from "../pages/ProjectTable";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectListPage />} />
      </Routes>
    </Router>
  );
};

export default App;

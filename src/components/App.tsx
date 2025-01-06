import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectListPage from "../pages/ProjectTable";
import Teams from "../pages/Teams";
import Settings from "../pages/Settings";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectListPage />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default App;

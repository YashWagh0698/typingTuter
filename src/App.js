import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Levels from "./pages/Levels";
import TutorialList from "./pages/TutorialList";
import Task from "./pages/Task";
import Result from "./pages/Result";

import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      {/* 🔹 Global banner (visible on all pages) */}
      <Header />

      {/* 🔹 Main routing area */}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/practice" element={<Home />} />
        <Route path="/levels/:category" element={<Levels />} />
        <Route
          path="/tutorials/:category/:level"
          element={<TutorialList />}
        />
        <Route
          path="/task/:category/:level/:tutorial/:task"
          element={<Task />}
        />
        <Route
          path="/result/:category/:level/:tutorial"
          element={<Result />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

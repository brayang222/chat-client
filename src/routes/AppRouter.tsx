import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat } from "../components/Chat";
import { Welcome } from "../pages/Welcome";

export const AppRouter = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/chat/" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

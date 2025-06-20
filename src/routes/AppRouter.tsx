import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat } from "../components/Chat";

export const AppRouter = () => {
  return (
    <main className="flex h-[100vh] w-full bg-black text-white">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

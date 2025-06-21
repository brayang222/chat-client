import { useState } from "react";
import { SearchPage } from "../components/SearchPage";
import Login from "../components/Login";
import { loginUser } from "../services/users/loginUser";

export const Welcome = () => {
  const [username, setUsername] = useState<string | null>(null);

  const handleUsernameSubmit = (submittedUsername: string) => {
    console.log("Username submitted:", submittedUsername);
    try {
      loginUser(submittedUsername);
      setUsername(submittedUsername);
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };

  if (!username) {
    return <Login onUsernameSubmit={handleUsernameSubmit} />;
  }

  return <SearchPage username={username} />;
};

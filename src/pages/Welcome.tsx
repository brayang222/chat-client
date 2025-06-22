import Login from "../components/Login";
import { loginUser } from "../services/users/loginUser";
import { useNavigate } from "react-router-dom";
import { setToken } from "../store/token";

export const Welcome = () => {
  const navigate = useNavigate();

  const handleUsernameSubmit = async (submittedUsername: string) => {
    try {
      const loggedUser = await loginUser(submittedUsername);
      console.log(loggedUser);
      setToken(JSON.stringify(loggedUser));
      navigate(`/chat/`);
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };

  return <Login onUsernameSubmit={handleUsernameSubmit} />;
};

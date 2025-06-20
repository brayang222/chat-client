import axios, { AxiosError } from "axios";
import { BACK_END_URL } from "../../utils/constants";

export const loginUser = async (username: any) => {
  try {
    const options = {
      method: "POST",
      url: `${BACK_END_URL}/users/login`,
      data: { username },
      headers: {
        accept: "application/json",
      },
    };
    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new Error("NOT_FOUND");
    }
    throw error;
  }
};

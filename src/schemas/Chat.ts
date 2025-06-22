import type { User } from "./User";

export interface Message {
  _id?: string;
  sender: User;
  content: string;
  messageType?: string;
  createdAt?: string;
  __v?: number;
}

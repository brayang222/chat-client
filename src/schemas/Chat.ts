export interface Message {
  body: BodyMessage | any;
  from: string;
}

export interface BodyMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

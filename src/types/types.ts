export interface IPost {
  id: number;
  text_content: string;
  user_id: number;
  created_at: Date | number;
  updated_at: Date | number;
  photo: string | null;
  type: string;
}

// export const emptyIPost: IPost = {
//   id: 0,
//   text_content: "",
//   user_id: 0,
//   created_at: new Date(),
//   updated_at: new Date(),
// };

export interface IPhoto {
  id: number;
  user_id: number;
  description: string;
  photo: string;
  created_at: Date;
  type: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
}

export interface Conversation {
  id: number;
  conversation_id: number;
  first_name: string;
  last_name: string;
  image: string;
  last_message: string;
  sender_id: number;
}

export interface IPostComment {
  id: number;
  user_id: number;
  post_id: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface IPhotoComment {
  id: number;
  user_id: number;
  photo_id: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
}

export interface Count {
  comments: number;
  likes: number;
}

export interface Chat {
  userId: number;
  conversationId: number;
  open: boolean;
  firstName: string;
  lastName: string;
  image: string;
}

export interface Message {
  conversation_id: number;
  sender_id: number;
  receiverId: number;
  message: string;
  seen_at?: number | null;
}

export interface Notification {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
  type: string;
  created_at: Date;
  notification_id?: number;
  receiver_id: number;
  post_id: number | null;
}

export interface Seen {
  sender_id: number;
  receiver_id: number;
  message_id: number;
  seen_at: Date;
}

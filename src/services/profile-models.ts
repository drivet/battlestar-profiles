export interface ProfileCreatePayload {
  username: string;
}

export interface Profile {
  _id: string;
  createdAt: Date;
  username: string;
}

export interface Username {
  _id: string;
  username: string;
}

export interface ProfileCreatePayload {
  nickname: string;
}

export interface ProfileUpdatePayload {
  nickname: string;
}

export interface Profile {
  _id: string;
  createdAt: Date;
  nickname: string;
}

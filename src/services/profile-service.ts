import { injectable } from 'inversify';
import { MongoClient } from 'mongodb';

import { Profile, ProfileCreatePayload, ProfileUpdatePayload } from './profile-models';

const uri =
  'mongodb+srv://dbaccess:wsabtelbatchea@cluster0.7mduw.mongodb.net/battlestardb?retryWrites=true&w=majority';

export type NullableString = string | undefined;

@injectable()
export class ProfileService {
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(uri);
  }

  async createProfile(id: string, payload: ProfileCreatePayload): Promise<Profile> {
    await this.client.connect();
    const newProfile: Profile = {
      _id: id,
      nickname: payload.nickname,
      createdAt: new Date(),
    };
    await this.getCollection().insertOne(newProfile);
    return newProfile;
  }

  async updateProfile(
    id: string,
    requestBody: ProfileUpdatePayload,
    uid: NullableString
  ): Promise<void> {
    if (uid && id !== uid) {
      throw new Error('cannot update a profile that is not yours');
    }
    await this.client.connect();
    await this.getCollection().updateOne(
      { _id: id },
      {
        $set: {
          nickname: requestBody.nickname,
        },
      }
    );
  }

  async getProfile(id: string, uid: NullableString = undefined): Promise<Profile> {
    if (uid && id !== uid) {
      throw new Error('cannot fetch a profile that is not yours');
    }
    await this.client.connect();
    return await this.getCollection().findOne({ _id: id });
  }

  async getProfiles(): Promise<Profile[]> {
    await this.client.connect();
    return await this.getCollection().find().toArray();
  }

  async deleteProfile(id: string, uid: NullableString = undefined): Promise<void> {
    if (uid && id !== uid) {
      throw new Error('cannot delete a profile that is not yours');
    }
    await this.client.connect();
    await this.getCollection().deleteOne({ _id: id });
  }

  private getCollection() {
    return this.client.db('battlestardb').collection('profiles');
  }
}

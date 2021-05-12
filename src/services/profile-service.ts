import { injectable } from 'inversify';
import { MongoClient } from 'mongodb';

import { Profile, ProfileCreatePayload, Username } from './profile-models';

const uri =
  'mongodb+srv://dbaccess:wsabtelbatchea@cluster0.7mduw.mongodb.net/battlestardb?retryWrites=true&w=majority';

@injectable()
export class ProfileService {
  private connected = false;
  private readonly client: MongoClient;

  constructor() {
    this.client = new MongoClient(uri);
  }

  async createProfile(id: string, payload: ProfileCreatePayload): Promise<Profile> {
    await this.connect();
    const newProfile: Profile = {
      _id: id,
      username: payload.username,
      createdAt: new Date(),
    };
    await this.getCollection().insertOne(newProfile);
    return newProfile;
  }

  async getProfile(id: string, user?: string): Promise<Profile> {
    if (user && id !== user) {
      throw new Error('caller must be owner of profile');
    }
    await this.connect();
    return await this.getCollection().findOne({ _id: id });
  }

  async getProfiles(user?: string): Promise<Profile[]> {
    await this.connect();
    if (!user) {
      return await this.getCollection().find().toArray();
    } else {
      return await this.getCollection().find({ _id: user }).toArray();
    }
  }

  async getUsernames(search: string): Promise<Username[]> {
    await this.connect();
    return await this.getCollection()
      .find({ username: `${search}` })
      .project({ username: 1 })
      .toArray();
  }

  async deleteProfile(id: string, user?: string): Promise<void> {
    if (user && id !== user) {
      throw new Error('caller must be owner of profile');
    }
    await this.connect();
    await this.getCollection().deleteOne({ _id: id });
  }

  private getCollection() {
    return this.client.db('battlestardb').collection('profiles');
  }

  private async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }
}

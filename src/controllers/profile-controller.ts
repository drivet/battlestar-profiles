import { injectable } from 'inversify';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Patch,
  Path,
  Put,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { Profile, ProfileCreatePayload, ProfileUpdatePayload } from '../services/profile-models';
import { ProfileService } from '../services/profile-service';

interface ValidateErrorJSON {
  message: 'Validation failed';
  details: { [name: string]: unknown };
}

@Security('ApiKeyAuth')
@Route('profiles')
@Tags('Profile')
@injectable()
export class ProfileController extends Controller {
  constructor(private profileService: ProfileService) {
    super();
  }

  /**
   * Creates a profile
   *
   * @param requestBody the JSON body in the request
   */
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Put('{id}')
  async createProfile(
    @Path() id: string,
    @Body() requestBody: ProfileCreatePayload
  ): Promise<Profile> {
    this.setStatus(201);
    return this.profileService.createProfile(id, requestBody);
  }

  /**
   * Updates a profile
   *
   * @param id the profile if of the profile you wish to update
   * @param requestBody information to update the profile
   */
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @SuccessResponse('204', 'No content')
  @Patch('{id}')
  async updateProfile(
    @Path() id: string,
    @Body() requestBody: ProfileUpdatePayload,
    @Header('x-uid') uid?: string
  ): Promise<void> {
    this.profileService.updateProfile(id, requestBody, uid);
  }

  /**
   * Fetches an existing profile
   *
   * @param id the profile id of the profile you want to fetch
   */
  @Response(404, 'Not Found')
  @SuccessResponse('200', 'Ok')
  @Get('{id}')
  public async getProfile(@Path() id: string, @Header('x-uid') uid?: string): Promise<Profile> {
    const profile = await this.profileService.getProfile(id, uid);
    if (!profile || !profile._id) {
      throw {
        message: 'profile not found',
        status: 404,
      };
    }
    return profile;
  }

  /**
   * Fetches a list of profiles
   */
  @SuccessResponse('200', 'Ok')
  @Get()
  public async getProfiles(): Promise<Profile[]> {
    return await this.profileService.getProfiles();
  }

  /**
   * Deletes a profile.  Not an error if the profile does not exist
   *
   * @param id the profile id of the profile you want to delete
   */
  @SuccessResponse('204', 'No content')
  @Delete('{id}')
  public async deleteProfile(@Path() id: string, @Header('x-uid') uid?: string): Promise<void> {
    await this.profileService.deleteProfile(id, uid);
  }
}

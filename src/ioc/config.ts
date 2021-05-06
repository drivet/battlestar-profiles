import { Container, decorate, injectable } from 'inversify';
import { Controller } from 'tsoa';

import { ProfileController } from '../controllers/profile-controller';
import { ProfileService } from '../services/profile-service';

export const iocContainer = new Container();

// Makes tsoa's Controller injectable
decorate(injectable(), Controller);

export function setupIocContainer(): void {
  iocContainer.bind(ProfileController).toSelf().inSingletonScope();
  iocContainer.bind(ProfileService).toSelf().inSingletonScope();
}

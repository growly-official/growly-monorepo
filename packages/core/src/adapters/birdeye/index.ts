import { Logger } from 'tslog';
import { IAdapter } from '../../types/adapter';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export class BirdEyeAdapter implements IAdapter {
  name = 'BirdEyeAdapter';
  logger = new Logger({ name: this.name });
}

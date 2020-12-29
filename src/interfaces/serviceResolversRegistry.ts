import {ServiceResolver} from './serviceResolver';

export default interface ServiceResolversRegistry {
  registerResolver(serviceTypeId: symbol, serviceResolver: ServiceResolver): void;
}
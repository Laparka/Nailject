import { LifetimeScope } from '../../api/containerBuilder';

export type ServiceRenderModel = {
  serviceTypeName: string;
  scope: LifetimeScope;
  symbolId: string;
};

export type InstanceRenderModel = {
  instanceName: string;
  instanceTypeName: string;
  dependencySymbols: string[];
};
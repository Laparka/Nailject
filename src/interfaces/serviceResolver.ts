import ServiceScopeProvider from './serviceScopeProvider';

export type serviceConstructor<T> = {
  new (...args: any[]): T;
};

export interface ServiceResolver {
  resolve(scopeProvider: ServiceScopeProvider): any;
}
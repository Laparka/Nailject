import ServiceProvider from './serviceProvider';

export default interface ServiceScopeProvider {
  getSingletonServiceProvider(): ServiceProvider;
  getTransientServiceProvider(): ServiceProvider;
}
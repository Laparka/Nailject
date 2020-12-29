export default interface ServiceProvider {
  resolveMany<TService>(serviceId: symbol): TService[];
  resolveOne<TService>(serviceId: symbol): TService;
}

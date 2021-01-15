"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransientServiceResolver = exports.SingletonServiceResolver = void 0;
class SingletonServiceResolver {
    resolve(scopeProvider) {
        const serviceProvider = scopeProvider.getSingletonServiceProvider();
        return this.doResolve(serviceProvider);
    }
}
exports.SingletonServiceResolver = SingletonServiceResolver;
class TransientServiceResolver {
    resolve(scopeProvider) {
        const serviceProvider = scopeProvider.getTransientServiceProvider();
        return this.doResolve(serviceProvider);
    }
}
exports.TransientServiceResolver = TransientServiceResolver;

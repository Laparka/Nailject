"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompiledServiceProvider = void 0;
class CompiledServiceProvider {
    constructor(serviceResolvers) {
        this._serviceResolversMap = serviceResolvers;
        this._resolvedInstances = new Map();
    }
    static initialize(serviceResolvers) {
        if (!CompiledServiceProvider._SingletonServiceProvider) {
            CompiledServiceProvider._SingletonServiceProvider = new CompiledServiceProvider(serviceResolvers);
        }
        return CompiledServiceProvider._SingletonServiceProvider;
    }
    getSingletonServiceProvider() {
        return CompiledServiceProvider._SingletonServiceProvider;
    }
    getTransientServiceProvider() {
        return new CompiledServiceProvider(this._serviceResolversMap);
    }
    resolveOne(serviceTypeId) {
        const all = this.resolveMany(serviceTypeId);
        return all[all.length - 1];
    }
    resolveMany(serviceTypeId) {
        const instances = [];
        const resolved = this._resolvedInstances.get(serviceTypeId);
        if (resolved) {
            instances.push(...resolved);
        }
        else {
            const serviceResolvers = this._serviceResolversMap.get(serviceTypeId);
            if (!serviceResolvers) {
                throw Error(`Failed to find service resolvers for the serviceID ${Symbol.keyFor(serviceTypeId)}`);
            }
            for (const resolver of serviceResolvers) {
                instances.push(resolver.resolve(this));
            }
            if (instances.length === 0) {
                throw Error('No registered interfaces were found');
            }
            this._resolvedInstances.set(serviceTypeId, instances);
        }
        return instances;
    }
}
exports.CompiledServiceProvider = CompiledServiceProvider;

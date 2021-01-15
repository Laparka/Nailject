import { CodeWriter } from './codeWriter';
import { RegistrationDescriptor } from '../generator/generatorContext';
export interface CodeRenderer {
    renderResolver(registration: RegistrationDescriptor, outputDir: string): string;
    renderServiceProvider(resolvers: string[], outputDirectory: string): string;
}
export declare class LiquidCodeRenderer implements CodeRenderer {
    private readonly _codeWriter;
    private readonly _liquid;
    constructor(codeWriter: CodeWriter);
    renderResolver(registration: RegistrationDescriptor, outputDir: string): string;
    renderServiceProvider(resolvers: string[], outputDirectory: string): string;
    private static getRegistrationName;
    private static getAccessorName;
}

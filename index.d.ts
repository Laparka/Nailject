import { GeneratorParameters } from './generator/generatorContext';
import { CodeWriter } from './generator/services/codeWriter';
export declare class IoCGenerator {
    private readonly _writer;
    constructor(writer: CodeWriter);
    generate(parameters: GeneratorParameters): string[];
    private renderToOutput;
}

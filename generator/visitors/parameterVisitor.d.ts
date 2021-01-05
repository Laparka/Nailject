import { NodeVisitorBase } from './nodeVisitor';
import { Node, ParameterDeclaration } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class ParameterVisitor extends NodeVisitorBase<ParameterDeclaration> {
    canVisit(node: Node): boolean;
    doVisit(node: ParameterDeclaration, context: GeneratorContext): CodeAccessor;
    private getRegisterArgType;
    private getConstructorArgType;
}

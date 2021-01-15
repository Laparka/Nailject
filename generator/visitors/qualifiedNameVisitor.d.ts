import { NodeVisitorBase } from './nodeVisitor';
import { Node, QualifiedName } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class QualifiedNameVisitor extends NodeVisitorBase<QualifiedName> {
    canVisit(node: Node): boolean;
    doVisit(node: QualifiedName, context: GeneratorContext): CodeAccessor;
}

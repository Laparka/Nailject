import { NodeVisitor } from './nodeVisitor';
import { Node } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class PrimitiveTypeVisitor implements NodeVisitor {
    canVisit(node: Node): boolean;
    visit(node: Node, context: GeneratorContext): CodeAccessor;
}

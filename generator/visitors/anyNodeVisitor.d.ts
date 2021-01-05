import { Node } from 'typescript';
import { NodeVisitor } from './nodeVisitor';
import { GeneratorContext } from '../generatorContext';
export default class AnyNodeVisitor implements NodeVisitor {
    private readonly _visitors;
    constructor();
    canVisit(node: Node): boolean;
    visit(node: Node, context: GeneratorContext): any | void;
}

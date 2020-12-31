import { NodeVisitorBase } from './nodeVisitor';
import { ArrayTypeNode, Node, SyntaxKind } from 'typescript';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class ArrayTypeVisitor extends NodeVisitorBase<ArrayTypeNode> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.ArrayType;
  }

  doVisit(node: ArrayTypeNode, context: GeneratorContext): NodeResult {
    const elementNode = this.visitNext(node.elementType, context);
    if (!elementNode) {
      throw Error(`The array element type is not defined`);
    }

    return {
      name: "[]",
      typeNames: [],
      child: elementNode
    }
  }

}
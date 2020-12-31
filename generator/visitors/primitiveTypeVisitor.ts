import { NodeVisitor } from './nodeVisitor';
import { Node, SyntaxKind } from 'typescript';
import { GeneratorContext, NodeResult } from '../generatorContext';

export default class PrimitiveTypeVisitor implements NodeVisitor {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.BigIntKeyword
      || node.kind === SyntaxKind.NumberKeyword
      || node.kind === SyntaxKind.BooleanKeyword
      || node.kind === SyntaxKind.StringKeyword;
  }

  visit(node: Node, context: GeneratorContext): NodeResult {
    let type: string;
    switch (node.kind) {
      case SyntaxKind.StringKeyword: {
        type = "string";
        break;
      }

      case SyntaxKind.BigIntKeyword: {
        type = "bigint";
        break;
      }

      case SyntaxKind.NumberKeyword: {
        type = "number";
        break;
      }

      case SyntaxKind.BooleanKeyword: {
        type = "boolean";
        break;
      }

      default: {
        throw Error(`Not supported primitive type: ${node.kind}`)
      }
    }

    return {
      name: type,
      child: null,
      typeNames: []
    }
  }
}
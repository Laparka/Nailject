import { Node, SyntaxKind, SyntaxList } from 'typescript';
import { NodeVisitorBase } from './nodeVisitor';
import { GeneratorContext } from '../generatorContext';

export default class SyntaxListVisitor extends NodeVisitorBase<SyntaxList> {
  canVisit(node: Node): boolean {
    return node.kind === SyntaxKind.SyntaxList;
  }

  doVisit(node: SyntaxList, context: GeneratorContext): Map<string, string[]> {
    const result = new Map<string, string[]>();
    const children = node.getChildren();
    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      const childRes = this.visitNext(child, context);
      if (!childRes) {
        continue;
      }

      const keysIterator = childRes.keys();
      let next = keysIterator.next();
      while(next && !next.done) {
        let map: string[];
        if (result.has(next.value)) {
          map = result.get(next.value)!;
        }
        else {
          map = [];
          result.set(next.value, map);
        }

        map.push(...childRes.get(next.value)!);
        next = keysIterator.next();
      }
    }

    return result;
  }
}
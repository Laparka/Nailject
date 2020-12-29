import Expression from './expression';
import { GeneratorContext } from './generatorContext';

export default interface ExpressionVisitor {
  canVisit(expression: Expression): boolean;
  visit(expression: Expression, context: GeneratorContext): string[];
}
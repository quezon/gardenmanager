export declare abstract class ExpressionCompilerFactory {
    abstract createExpressionCompiler(): ExpressionCompiler;
    abstract createExpressionCompilerVisibilityIf(): ExpressionCompilerVisibilityIf;
}
export interface ExpressionCompiler {
    evaluate(expression: string, context: object): any;
}
export interface ExpressionCompilerVisibilityIf {
    evaluate(expression: string, context: ExpressionContextVisibilitIf): any;
}
/**
 * UseCase:<br/>
 * When evaluating the expression of a <code>visibilityIf</code> condition
 * an instance of this definition will be passed as context.<br/>
 * This will give access to the source and target <code>FormProperty</code>.
 */
export interface ExpressionContextVisibilitIf {
    /**
     * The source property which has the <code>visibilityIf</code> defined
     */
    source: FormProperty;
    /**
     * The target property given with the <code>visibilityIf</code>
     * <em>path</em> property
     */
    target: FormProperty;
}
import { FormProperty } from './model';
export declare class JEXLExpressionCompilerFactory extends ExpressionCompilerFactory {
    createExpressionCompiler(): ExpressionCompiler;
    createExpressionCompilerVisibilityIf(): ExpressionCompilerVisibilityIf;
}
export declare class JEXLExpressionCompiler implements ExpressionCompiler {
    evaluate(expression: string, context?: object): any;
}
export declare class JEXLExpressionCompilerVisibiltyIf implements ExpressionCompilerVisibilityIf {
    evaluate(expression: string, context?: ExpressionContextVisibilitIf): any;
}

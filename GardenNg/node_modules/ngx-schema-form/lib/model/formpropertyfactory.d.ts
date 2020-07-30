import { FormProperty, PropertyGroup } from './formproperty';
import { SchemaValidatorFactory } from '../schemavalidatorfactory';
import { ValidatorRegistry } from './validatorregistry';
import { PropertyBindingRegistry } from '../property-binding-registry';
import { ExpressionCompilerFactory } from '../expression-compiler-factory';
export declare class FormPropertyFactory {
    private schemaValidatorFactory;
    private validatorRegistry;
    private propertyBindingRegistry;
    private expressionCompilerFactory;
    constructor(schemaValidatorFactory: SchemaValidatorFactory, validatorRegistry: ValidatorRegistry, propertyBindingRegistry: PropertyBindingRegistry, expressionCompilerFactory: ExpressionCompilerFactory);
    createProperty(schema: any, parent?: PropertyGroup, propertyId?: string): FormProperty;
    private initializeRoot;
}

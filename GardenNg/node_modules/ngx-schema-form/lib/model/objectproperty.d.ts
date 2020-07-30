import { PropertyGroup } from './formproperty';
import { FormPropertyFactory } from './formpropertyfactory';
import { SchemaValidatorFactory } from '../schemavalidatorfactory';
import { ValidatorRegistry } from './validatorregistry';
import { ExpressionCompilerFactory } from '../expression-compiler-factory';
export declare class ObjectProperty extends PropertyGroup {
    private formPropertyFactory;
    private propertiesId;
    constructor(formPropertyFactory: FormPropertyFactory, schemaValidatorFactory: SchemaValidatorFactory, validatorRegistry: ValidatorRegistry, expressionCompilerFactory: ExpressionCompilerFactory, schema: any, parent: PropertyGroup, path: string);
    setValue(value: any, onlySelf: boolean): void;
    reset(value: any, onlySelf?: boolean): void;
    resetProperties(value: any): void;
    createProperties(): void;
    _hasValue(): boolean;
    _updateValue(): void;
    _runValidation(): void;
    private reduceValue;
}

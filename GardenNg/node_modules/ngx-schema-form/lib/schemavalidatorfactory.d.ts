export declare abstract class SchemaValidatorFactory {
    abstract createValidatorFn(schema: any): (value: any) => any;
    abstract getSchema(schema: any, ref: any): any;
    /**
     * Override this method to reset the schema validator instance.<br/>
     * This may be required since some schema validators keep a deep copy<br/>
     * of your schemas and changes at runtime are not recognized by the schema validator.<br/>
     * In this method you should either re-instantiate the schema validator or
     * clear its cache.<br/>
     * Example of re-instantiating schema validator
     * <code>
     *     reset(){
     *         this.zschema = new ZSchema({})
     *     }
     * </code>
     * <br/>
     * Since this method it self does nothing there is <br/>
     * no need to call the <code>super.reset()</code>
     */
    reset(): void;
}
export declare class ZSchemaValidatorFactory extends SchemaValidatorFactory {
    protected zschema: any;
    constructor();
    private createSchemaValidator;
    reset(): void;
    createValidatorFn(schema: any): (value: any) => {
        [key: string]: boolean;
    };
    getSchema(schema: any, ref: string): any;
    private denormalizeRequiredPropertyPaths;
    private getDefinition;
}

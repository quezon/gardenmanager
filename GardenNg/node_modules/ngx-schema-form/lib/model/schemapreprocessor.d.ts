export declare class SchemaPreprocessor {
    static preprocess(jsonSchema: any, path?: string): any;
    private static checkProperties;
    private static checkAndCreateFieldsets;
    private static checkFieldsUsage;
    private static createFieldsets;
    private static replaceOrderByFieldsets;
    private static normalizeWidget;
    private static checkItems;
    private static recursiveCheck;
    private static removeRecursiveRefProperties;
    /**
     * Enables alias names for JSON schema extensions.
     *
     * Copies the value of each alias JSON schema property
     * to the JSON schema property of ngx-schema-form.
     *
     * @param schema JSON schema to enable alias names.
     */
    private static normalizeExtensions;
}

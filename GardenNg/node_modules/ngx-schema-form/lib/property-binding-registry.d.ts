/**
 * General purpose propery binding registry
 */
export declare class PropertyBindingRegistry {
    private bindings;
    getPropertyBindings(type: PropertyBindingTypes): PropertyBindings;
    getPropertyBindingsVisibility(): PropertyBindings;
}
/**
 * Defines the types of supported property bindings.<br/>
 * For now only <code>visibility</code> is supported.<br/>
 */
export declare enum PropertyBindingTypes {
    visibility = 0
}
/**
 * Storage that holds all bindings that are property paths related.<br/>
 */
export declare class PropertyBindings {
    sourcesIndex: SimplePropertyIndexer;
    dependenciesIndex: SimplePropertyIndexer;
    add(dependencyPath: string, sourcePropertyPath: string): void;
    findByDependencyPath(dependencyPath: string): string[];
    getBySourcePropertyPath(sourcePropertyPath: string): string[];
    createPathIndex(path: string): string[];
}
/**
 * Simple indexer to store property paths
 */
export declare class SimplePropertyIndexer {
    static MARKER: string;
    index: object;
    findOnlyWithValue: boolean;
    private _createPathIndex;
    store(propertyPath: string, value?: any): void;
    private _storeIndex;
    /**
     * Find path in index.<br/>
     * Will find path like:<br/>
     * <ul>
     *     <li>/property/0/prop</li>
     *     <li>/property/0/prop/2/test</li>
     *     <li>/property/0/prop/&#42;/test</li>
     *     <li>/property/&#42;/prop/1/test</li>
     *     <li>/property/&#42;/prop/&#42;/test</li>
     *     <li>/property/1/prop/&#42;/test</li>
     *  </ul>
     * @param path
     */
    find(path: string): IndexerResult;
    _findInIndex(path: string[]): IndexerResult;
    __findIndex(indexerResults: IndexerResult, path: string[], index: object, parent?: string[]): any[];
}
export interface IndexerResult {
    /**
     * The path originally searched for
     */
    target: string[];
    /**
     * Flag for the status of found or not found.<br/>
     * Usually <code>results</code> will be empty if no matches found.
     */
    found: boolean;
    /**
     * The result path and values from the index search.<br/>
     * Usually <code>results</code> will be empty if no matches found.
     */
    results: {
        /**
         * The path that matched the <code>target</code>
         * separated in segments
         */
        path: string[];
        /**
         * The value stored at the <code>path</code>
         */
        value: any;
    }[];
}

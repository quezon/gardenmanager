import { ArrayLayoutWidget } from '../../widget';
import { FormProperty } from '../../model';
export declare class ArrayWidget extends ArrayLayoutWidget {
    buttonDisabledAdd: boolean;
    buttonDisabledRemove: boolean;
    addItem(): void;
    removeItem(item: FormProperty): void;
    trackByIndex(index: number, item: any): number;
    updateButtonDisabledState(): void;
    isAddButtonDisabled(): boolean;
    isRemoveButtonDisabled(): boolean;
}

import * as tslib_1 from "tslib";
import { DatePickerDirectiveService } from './date-picker-directive.service';
import { DatePickerComponent } from './date-picker.component';
import { ComponentFactoryResolver, Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Optional, Output, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
let DatePickerDirective = class DatePickerDirective {
    constructor(viewContainerRef, elemRef, componentFactoryResolver, service, formControl, utilsService) {
        this.viewContainerRef = viewContainerRef;
        this.elemRef = elemRef;
        this.componentFactoryResolver = componentFactoryResolver;
        this.service = service;
        this.formControl = formControl;
        this.utilsService = utilsService;
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onSelect = new EventEmitter();
        this._mode = 'day';
    }
    get config() {
        return this._config;
    }
    set config(config) {
        this._config = this.service.getConfig(config, this.viewContainerRef.element, this.attachTo);
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    get attachTo() {
        return this._attachTo;
    }
    set attachTo(attachTo) {
        this._attachTo = attachTo;
        this._config = this.service.getConfig(this.config, this.viewContainerRef.element, this.attachTo);
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    get theme() {
        return this._theme;
    }
    set theme(theme) {
        this._theme = theme;
        if (this.datePicker) {
            this.datePicker.theme = theme;
        }
        this.markForCheck();
    }
    get mode() {
        return this._mode;
    }
    set mode(mode) {
        this._mode = mode;
        if (this.datePicker) {
            this.datePicker.mode = mode;
        }
        this.markForCheck();
    }
    get minDate() {
        return this._minDate;
    }
    set minDate(minDate) {
        this._minDate = minDate;
        if (this.datePicker) {
            this.datePicker.minDate = minDate;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(maxDate) {
        this._maxDate = maxDate;
        if (this.datePicker) {
            this.datePicker.maxDate = maxDate;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get minTime() {
        return this._minTime;
    }
    set minTime(minTime) {
        this._minTime = minTime;
        if (this.datePicker) {
            this.datePicker.minTime = minTime;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get maxTime() {
        return this._maxTime;
    }
    set maxTime(maxTime) {
        this._maxTime = maxTime;
        if (this.datePicker) {
            this.datePicker.maxTime = maxTime;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    get displayDate() {
        return this._displayDate;
    }
    set displayDate(displayDate) {
        this._displayDate = displayDate;
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    ngOnInit() {
        this.datePicker = this.createDatePicker();
        this.api = this.datePicker.api;
        this.updateDatepickerConfig();
        this.attachModelToDatePicker();
        this.datePicker.theme = this.theme;
    }
    createDatePicker() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
        return this.viewContainerRef.createComponent(factory).instance;
    }
    attachModelToDatePicker() {
        if (!this.formControl) {
            return;
        }
        this.datePicker.onViewDateChange(this.formControl.value);
        this.formControl.valueChanges.subscribe((value) => {
            if (value !== this.datePicker.inputElementValue) {
                const strVal = this.utilsService.convertToString(value, this.datePicker.componentConfig.format);
                this.datePicker.onViewDateChange(strVal);
            }
        });
        let setup = true;
        this.datePicker.registerOnChange((value, changedByInput) => {
            if (value) {
                const isMultiselectEmpty = setup && Array.isArray(value) && !value.length;
                if (!isMultiselectEmpty && !changedByInput) {
                    this.formControl.control.setValue(this.datePicker.inputElementValue);
                }
            }
            const errors = this.datePicker.validateFn(value);
            if (!setup) {
                this.formControl.control.markAsDirty({
                    onlySelf: true
                });
            }
            else {
                setup = false;
            }
            if (errors) {
                if (errors.hasOwnProperty('format')) {
                    const { given } = errors['format'];
                    this.datePicker.inputElementValue = given;
                    if (!changedByInput) {
                        this.formControl.control.setValue(given);
                    }
                }
                this.formControl.control.setErrors(errors);
            }
        });
    }
    onClick() {
        this.datePicker.onClick();
    }
    onFocus() {
        this.datePicker.inputFocused();
    }
    markForCheck() {
        if (this.datePicker) {
            this.datePicker.cd.markForCheck();
        }
    }
    updateDatepickerConfig() {
        if (this.datePicker) {
            this.datePicker.minDate = this.minDate;
            this.datePicker.maxDate = this.maxDate;
            this.datePicker.minTime = this.minTime;
            this.datePicker.maxTime = this.maxTime;
            this.datePicker.mode = this.mode || 'day';
            this.datePicker.displayDate = this.displayDate;
            this.datePicker.config = this.config;
            this.datePicker.open = this.open;
            this.datePicker.close = this.close;
            this.datePicker.onChange = this.onChange;
            this.datePicker.onGoToCurrent = this.onGoToCurrent;
            this.datePicker.onLeftNav = this.onLeftNav;
            this.datePicker.onRightNav = this.onRightNav;
            this.datePicker.onSelect = this.onSelect;
            this.datePicker.init();
            if (this.datePicker.componentConfig.disableKeypress) {
                this.elemRef.nativeElement.setAttribute('readonly', true);
            }
            else {
                this.elemRef.nativeElement.removeAttribute('readonly');
            }
        }
    }
};
DatePickerDirective.ctorParameters = () => [
    { type: ViewContainerRef },
    { type: ElementRef },
    { type: ComponentFactoryResolver },
    { type: DatePickerDirectiveService },
    { type: NgControl, decorators: [{ type: Optional }] },
    { type: UtilsService }
];
tslib_1.__decorate([
    Input('dpDayPicker')
], DatePickerDirective.prototype, "config", null);
tslib_1.__decorate([
    Input()
], DatePickerDirective.prototype, "attachTo", null);
tslib_1.__decorate([
    Input()
], DatePickerDirective.prototype, "theme", null);
tslib_1.__decorate([
    Input()
], DatePickerDirective.prototype, "mode", null);
tslib_1.__decorate([
    Input()
], DatePickerDirective.prototype, "minDate", null);
tslib_1.__decorate([
    Input()
], DatePickerDirective.prototype, "maxDate", null);
tslib_1.__decorate([
    Input()
], DatePickerDirective.prototype, "minTime", null);
tslib_1.__decorate([
    Input()
], DatePickerDirective.prototype, "maxTime", null);
tslib_1.__decorate([
    Input()
], DatePickerDirective.prototype, "displayDate", null);
tslib_1.__decorate([
    Output()
], DatePickerDirective.prototype, "open", void 0);
tslib_1.__decorate([
    Output()
], DatePickerDirective.prototype, "close", void 0);
tslib_1.__decorate([
    Output()
], DatePickerDirective.prototype, "onChange", void 0);
tslib_1.__decorate([
    Output()
], DatePickerDirective.prototype, "onGoToCurrent", void 0);
tslib_1.__decorate([
    Output()
], DatePickerDirective.prototype, "onLeftNav", void 0);
tslib_1.__decorate([
    Output()
], DatePickerDirective.prototype, "onRightNav", void 0);
tslib_1.__decorate([
    Output()
], DatePickerDirective.prototype, "onSelect", void 0);
tslib_1.__decorate([
    HostListener('click')
], DatePickerDirective.prototype, "onClick", null);
tslib_1.__decorate([
    HostListener('focus')
], DatePickerDirective.prototype, "onFocus", null);
DatePickerDirective = tslib_1.__decorate([
    Directive({
        exportAs: 'dpDayPicker',
        providers: [DatePickerDirectiveService],
        selector: '[dpDayPicker]'
    }),
    tslib_1.__param(4, Optional())
], DatePickerDirective);
export { DatePickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUUzRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFFBQVEsRUFDUixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUl6QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0NBQXdDLENBQUE7QUFRbkUsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7SUFnSjlCLFlBQW1CLGdCQUFrQyxFQUNsQyxPQUFtQixFQUNuQix3QkFBa0QsRUFDbEQsT0FBbUMsRUFDdkIsV0FBc0IsRUFDbEMsWUFBMEI7UUFMMUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFDbEQsWUFBTyxHQUFQLE9BQU8sQ0FBNEI7UUFDdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVc7UUFDbEMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFqQ25DLFNBQUksR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBQ2hDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBQ2pDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBaUIsQ0FBQztRQUM3QyxrQkFBYSxHQUF1QixJQUFJLFlBQVksRUFB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REFHckI7QUE5TlUsbUJBQW1CO0lBTC9CLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLFNBQVMsRUFBRSxDQUFDLDBCQUEwQixDQUFDO1FBQ3ZDLFFBQVEsRUFBRSxlQUFlO0tBQzFCLENBQUM7SUFxSmEsbUJBQUEsUUFBUSxFQUFFLENBQUE7R0FwSlosbUJBQW1CLENBZ1EvQjtTQWhRWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NhbGVuZGFyTW9kZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLW1vZGUnO1xuaW1wb3J0IHtJRGF0ZVBpY2tlckRpcmVjdGl2ZUNvbmZpZ30gZnJvbSAnLi9kYXRlLXBpY2tlci1kaXJlY3RpdmUtY29uZmlnLm1vZGVsJztcbmltcG9ydCB7RGF0ZVBpY2tlckRpcmVjdGl2ZVNlcnZpY2V9IGZyb20gJy4vZGF0ZS1waWNrZXItZGlyZWN0aXZlLnNlcnZpY2UnO1xuaW1wb3J0IHtJRHBEYXlQaWNrZXJBcGl9IGZyb20gJy4vZGF0ZS1waWNrZXIuYXBpJztcbmltcG9ydCB7RGF0ZVBpY2tlckNvbXBvbmVudH0gZnJvbSAnLi9kYXRlLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7Q2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7U2luZ2xlQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3NpbmdsZS1jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge0lOYXZFdmVudH0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9uYXZpZ2F0aW9uLWV2ZW50Lm1vZGVsJztcbmltcG9ydCB7VXRpbHNTZXJ2aWNlfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvdXRpbHMvdXRpbHMuc2VydmljZSdcbmltcG9ydCB7SVNlbGVjdGlvbkV2ZW50fSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2VsZWN0aW9uLWV2ZXQubW9kZWwnO1xuXG5ARGlyZWN0aXZlKHtcbiAgZXhwb3J0QXM6ICdkcERheVBpY2tlcicsXG4gIHByb3ZpZGVyczogW0RhdGVQaWNrZXJEaXJlY3RpdmVTZXJ2aWNlXSxcbiAgc2VsZWN0b3I6ICdbZHBEYXlQaWNrZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBEYXRlUGlja2VyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBnZXQgY29uZmlnKCk6IElEYXRlUGlja2VyRGlyZWN0aXZlQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xuICB9XG5cbiAgQElucHV0KCdkcERheVBpY2tlcicpIHNldCBjb25maWcoY29uZmlnOiBJRGF0ZVBpY2tlckRpcmVjdGl2ZUNvbmZpZykge1xuICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuc2VydmljZS5nZXRDb25maWcoY29uZmlnLCB0aGlzLnZpZXdDb250YWluZXJSZWYuZWxlbWVudCwgdGhpcy5hdHRhY2hUbyk7XG4gICAgdGhpcy51cGRhdGVEYXRlcGlja2VyQ29uZmlnKCk7XG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBhdHRhY2hUbygpOiBFbGVtZW50UmVmIHwgc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoVG87XG4gIH1cblxuICBASW5wdXQoKSBzZXQgYXR0YWNoVG8oYXR0YWNoVG86IEVsZW1lbnRSZWYgfCBzdHJpbmcpIHtcbiAgICB0aGlzLl9hdHRhY2hUbyA9IGF0dGFjaFRvO1xuICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuc2VydmljZS5nZXRDb25maWcodGhpcy5jb25maWcsIHRoaXMudmlld0NvbnRhaW5lclJlZi5lbGVtZW50LCB0aGlzLmF0dGFjaFRvKTtcbiAgICB0aGlzLnVwZGF0ZURhdGVwaWNrZXJDb25maWcoKTtcbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IHRoZW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3RoZW1lO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IHRoZW1lKHRoZW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90aGVtZSA9IHRoZW1lO1xuICAgIGlmICh0aGlzLmRhdGVQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci50aGVtZSA9IHRoZW1lO1xuICAgIH1cblxuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgbW9kZSgpOiBDYWxlbmRhck1vZGUge1xuICAgIHJldHVybiB0aGlzLl9tb2RlO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IG1vZGUobW9kZTogQ2FsZW5kYXJNb2RlKSB7XG4gICAgdGhpcy5fbW9kZSA9IG1vZGU7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1vZGUgPSBtb2RlO1xuICAgIH1cblxuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgbWluRGF0ZSgpOiBTaW5nbGVDYWxlbmRhclZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy5fbWluRGF0ZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBtaW5EYXRlKG1pbkRhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWUpIHtcbiAgICB0aGlzLl9taW5EYXRlID0gbWluRGF0ZTtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWluRGF0ZSA9IG1pbkRhdGU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubmdPbkluaXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IG1heERhdGUoKTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMuX21heERhdGU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgbWF4RGF0ZShtYXhEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgdGhpcy5fbWF4RGF0ZSA9IG1heERhdGU7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1heERhdGUgPSBtYXhEYXRlO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm5nT25Jbml0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBtaW5UaW1lKCk6IFNpbmdsZUNhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLl9taW5UaW1lO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IG1pblRpbWUobWluVGltZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIHRoaXMuX21pblRpbWUgPSBtaW5UaW1lO1xuICAgIGlmICh0aGlzLmRhdGVQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5taW5UaW1lID0gbWluVGltZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5uZ09uSW5pdCgpO1xuICAgIH1cblxuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgbWF4VGltZSgpOiBTaW5nbGVDYWxlbmRhclZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4VGltZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBtYXhUaW1lKG1heFRpbWU6IFNpbmdsZUNhbGVuZGFyVmFsdWUpIHtcbiAgICB0aGlzLl9tYXhUaW1lID0gbWF4VGltZTtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWF4VGltZSA9IG1heFRpbWU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubmdPbkluaXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IGRpc3BsYXlEYXRlKCk6IFNpbmdsZUNhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLl9kaXNwbGF5RGF0ZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBkaXNwbGF5RGF0ZShkaXNwbGF5RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIHRoaXMuX2Rpc3BsYXlEYXRlID0gZGlzcGxheURhdGU7XG4gICAgdGhpcy51cGRhdGVEYXRlcGlja2VyQ29uZmlnKCk7XG5cbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgQE91dHB1dCgpIG9wZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSBjbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIG9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDYWxlbmRhclZhbHVlPigpO1xuICBAT3V0cHV0KCkgb25Hb1RvQ3VycmVudDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25MZWZ0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxJU2VsZWN0aW9uRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBkYXRlUGlja2VyOiBEYXRlUGlja2VyQ29tcG9uZW50O1xuICBhcGk6IElEcERheVBpY2tlckFwaTtcblxuICBwcml2YXRlIF9jb25maWc6IElEYXRlUGlja2VyRGlyZWN0aXZlQ29uZmlnO1xuXG4gIHByaXZhdGUgX2F0dGFjaFRvOiBFbGVtZW50UmVmIHwgc3RyaW5nO1xuXG4gIHByaXZhdGUgX3RoZW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfbW9kZTogQ2FsZW5kYXJNb2RlID0gJ2RheSc7XG5cbiAgcHJpdmF0ZSBfbWluRGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcblxuICBwcml2YXRlIF9tYXhEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuXG4gIHByaXZhdGUgX21pblRpbWU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG5cbiAgcHJpdmF0ZSBfbWF4VGltZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcblxuICBwcml2YXRlIF9kaXNwbGF5RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgcHVibGljIGVsZW1SZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHB1YmxpYyBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgICAgICAgICAgcHVibGljIHNlcnZpY2U6IERhdGVQaWNrZXJEaXJlY3RpdmVTZXJ2aWNlLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwdWJsaWMgZm9ybUNvbnRyb2w6IE5nQ29udHJvbCxcbiAgICAgICAgICAgICAgcHVibGljIHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRhdGVQaWNrZXIgPSB0aGlzLmNyZWF0ZURhdGVQaWNrZXIoKTtcbiAgICB0aGlzLmFwaSA9IHRoaXMuZGF0ZVBpY2tlci5hcGk7XG4gICAgdGhpcy51cGRhdGVEYXRlcGlja2VyQ29uZmlnKCk7XG4gICAgdGhpcy5hdHRhY2hNb2RlbFRvRGF0ZVBpY2tlcigpO1xuICAgIHRoaXMuZGF0ZVBpY2tlci50aGVtZSA9IHRoaXMudGhlbWU7XG4gIH1cblxuICBjcmVhdGVEYXRlUGlja2VyKCk6IERhdGVQaWNrZXJDb21wb25lbnQge1xuICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShEYXRlUGlja2VyQ29tcG9uZW50KTtcbiAgICByZXR1cm4gdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5KS5pbnN0YW5jZTtcbiAgfVxuXG4gIGF0dGFjaE1vZGVsVG9EYXRlUGlja2VyKCkge1xuICAgIGlmICghdGhpcy5mb3JtQ29udHJvbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZGF0ZVBpY2tlci5vblZpZXdEYXRlQ2hhbmdlKHRoaXMuZm9ybUNvbnRyb2wudmFsdWUpO1xuXG4gICAgdGhpcy5mb3JtQ29udHJvbC52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLmRhdGVQaWNrZXIuaW5wdXRFbGVtZW50VmFsdWUpIHtcbiAgICAgICAgY29uc3Qgc3RyVmFsID0gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFRvU3RyaW5nKHZhbHVlLCB0aGlzLmRhdGVQaWNrZXIuY29tcG9uZW50Q29uZmlnLmZvcm1hdCk7XG4gICAgICAgIHRoaXMuZGF0ZVBpY2tlci5vblZpZXdEYXRlQ2hhbmdlKHN0clZhbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgc2V0dXAgPSB0cnVlO1xuXG4gICAgdGhpcy5kYXRlUGlja2VyLnJlZ2lzdGVyT25DaGFuZ2UoKHZhbHVlLCBjaGFuZ2VkQnlJbnB1dCkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGlzTXVsdGlzZWxlY3RFbXB0eSA9IHNldHVwICYmIEFycmF5LmlzQXJyYXkodmFsdWUpICYmICF2YWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKCFpc011bHRpc2VsZWN0RW1wdHkgJiYgIWNoYW5nZWRCeUlucHV0KSB7XG4gICAgICAgICAgdGhpcy5mb3JtQ29udHJvbC5jb250cm9sLnNldFZhbHVlKHRoaXMuZGF0ZVBpY2tlci5pbnB1dEVsZW1lbnRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZXJyb3JzID0gdGhpcy5kYXRlUGlja2VyLnZhbGlkYXRlRm4odmFsdWUpO1xuXG4gICAgICBpZiAoIXNldHVwKSB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRyb2wuY29udHJvbC5tYXJrQXNEaXJ0eSh7XG4gICAgICAgICAgb25seVNlbGY6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXR1cCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzKSB7XG4gICAgICAgIGlmIChlcnJvcnMuaGFzT3duUHJvcGVydHkoJ2Zvcm1hdCcpKSB7XG4gICAgICAgICAgY29uc3Qge2dpdmVufSA9IGVycm9yc1snZm9ybWF0J107XG4gICAgICAgICAgdGhpcy5kYXRlUGlja2VyLmlucHV0RWxlbWVudFZhbHVlID0gZ2l2ZW47XG4gICAgICAgICAgaWYgKCFjaGFuZ2VkQnlJbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5mb3JtQ29udHJvbC5jb250cm9sLnNldFZhbHVlKGdpdmVuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvcm1Db250cm9sLmNvbnRyb2wuc2V0RXJyb3JzKGVycm9ycyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIG9uQ2xpY2soKSB7XG4gICAgdGhpcy5kYXRlUGlja2VyLm9uQ2xpY2soKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJylcbiAgb25Gb2N1cygpIHtcbiAgICB0aGlzLmRhdGVQaWNrZXIuaW5wdXRGb2N1c2VkKCk7XG4gIH1cblxuICBtYXJrRm9yQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRGF0ZXBpY2tlckNvbmZpZygpIHtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWluRGF0ZSA9IHRoaXMubWluRGF0ZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5tYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1pblRpbWUgPSB0aGlzLm1pblRpbWU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWF4VGltZSA9IHRoaXMubWF4VGltZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5tb2RlID0gdGhpcy5tb2RlIHx8ICdkYXknO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLmRpc3BsYXlEYXRlID0gdGhpcy5kaXNwbGF5RGF0ZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5jb25maWcgPSB0aGlzLmNvbmZpZztcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5vcGVuID0gdGhpcy5vcGVuO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLmNsb3NlID0gdGhpcy5jbG9zZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2U7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIub25Hb1RvQ3VycmVudCA9IHRoaXMub25Hb1RvQ3VycmVudDtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5vbkxlZnROYXYgPSB0aGlzLm9uTGVmdE5hdjtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5vblJpZ2h0TmF2ID0gdGhpcy5vblJpZ2h0TmF2O1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm9uU2VsZWN0ID0gdGhpcy5vblNlbGVjdDtcblxuICAgICAgdGhpcy5kYXRlUGlja2VyLmluaXQoKTtcblxuICAgICAgaWYgKHRoaXMuZGF0ZVBpY2tlci5jb21wb25lbnRDb25maWcuZGlzYWJsZUtleXByZXNzKSB7XG4gICAgICAgIHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgncmVhZG9ubHknLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgncmVhZG9ubHknKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
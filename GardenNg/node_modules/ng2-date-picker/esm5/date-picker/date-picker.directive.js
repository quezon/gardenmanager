import * as tslib_1 from "tslib";
import { DatePickerDirectiveService } from './date-picker-directive.service';
import { DatePickerComponent } from './date-picker.component';
import { ComponentFactoryResolver, Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Optional, Output, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
var DatePickerDirective = /** @class */ (function () {
    function DatePickerDirective(viewContainerRef, elemRef, componentFactoryResolver, service, formControl, utilsService) {
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
    Object.defineProperty(DatePickerDirective.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (config) {
            this._config = this.service.getConfig(config, this.viewContainerRef.element, this.attachTo);
            this.updateDatepickerConfig();
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "attachTo", {
        get: function () {
            return this._attachTo;
        },
        set: function (attachTo) {
            this._attachTo = attachTo;
            this._config = this.service.getConfig(this.config, this.viewContainerRef.element, this.attachTo);
            this.updateDatepickerConfig();
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "theme", {
        get: function () {
            return this._theme;
        },
        set: function (theme) {
            this._theme = theme;
            if (this.datePicker) {
                this.datePicker.theme = theme;
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (mode) {
            this._mode = mode;
            if (this.datePicker) {
                this.datePicker.mode = mode;
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "minDate", {
        get: function () {
            return this._minDate;
        },
        set: function (minDate) {
            this._minDate = minDate;
            if (this.datePicker) {
                this.datePicker.minDate = minDate;
                this.datePicker.ngOnInit();
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "maxDate", {
        get: function () {
            return this._maxDate;
        },
        set: function (maxDate) {
            this._maxDate = maxDate;
            if (this.datePicker) {
                this.datePicker.maxDate = maxDate;
                this.datePicker.ngOnInit();
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "minTime", {
        get: function () {
            return this._minTime;
        },
        set: function (minTime) {
            this._minTime = minTime;
            if (this.datePicker) {
                this.datePicker.minTime = minTime;
                this.datePicker.ngOnInit();
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "maxTime", {
        get: function () {
            return this._maxTime;
        },
        set: function (maxTime) {
            this._maxTime = maxTime;
            if (this.datePicker) {
                this.datePicker.maxTime = maxTime;
                this.datePicker.ngOnInit();
            }
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerDirective.prototype, "displayDate", {
        get: function () {
            return this._displayDate;
        },
        set: function (displayDate) {
            this._displayDate = displayDate;
            this.updateDatepickerConfig();
            this.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    DatePickerDirective.prototype.ngOnInit = function () {
        this.datePicker = this.createDatePicker();
        this.api = this.datePicker.api;
        this.updateDatepickerConfig();
        this.attachModelToDatePicker();
        this.datePicker.theme = this.theme;
    };
    DatePickerDirective.prototype.createDatePicker = function () {
        var factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
        return this.viewContainerRef.createComponent(factory).instance;
    };
    DatePickerDirective.prototype.attachModelToDatePicker = function () {
        var _this = this;
        if (!this.formControl) {
            return;
        }
        this.datePicker.onViewDateChange(this.formControl.value);
        this.formControl.valueChanges.subscribe(function (value) {
            if (value !== _this.datePicker.inputElementValue) {
                var strVal = _this.utilsService.convertToString(value, _this.datePicker.componentConfig.format);
                _this.datePicker.onViewDateChange(strVal);
            }
        });
        var setup = true;
        this.datePicker.registerOnChange(function (value, changedByInput) {
            if (value) {
                var isMultiselectEmpty = setup && Array.isArray(value) && !value.length;
                if (!isMultiselectEmpty && !changedByInput) {
                    _this.formControl.control.setValue(_this.datePicker.inputElementValue);
                }
            }
            var errors = _this.datePicker.validateFn(value);
            if (!setup) {
                _this.formControl.control.markAsDirty({
                    onlySelf: true
                });
            }
            else {
                setup = false;
            }
            if (errors) {
                if (errors.hasOwnProperty('format')) {
                    var given = errors['format'].given;
                    _this.datePicker.inputElementValue = given;
                    if (!changedByInput) {
                        _this.formControl.control.setValue(given);
                    }
                }
                _this.formControl.control.setErrors(errors);
            }
        });
    };
    DatePickerDirective.prototype.onClick = function () {
        this.datePicker.onClick();
    };
    DatePickerDirective.prototype.onFocus = function () {
        this.datePicker.inputFocused();
    };
    DatePickerDirective.prototype.markForCheck = function () {
        if (this.datePicker) {
            this.datePicker.cd.markForCheck();
        }
    };
    DatePickerDirective.prototype.updateDatepickerConfig = function () {
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
    };
    DatePickerDirective.ctorParameters = function () { return [
        { type: ViewContainerRef },
        { type: ElementRef },
        { type: ComponentFactoryResolver },
        { type: DatePickerDirectiveService },
        { type: NgControl, decorators: [{ type: Optional }] },
        { type: UtilsService }
    ]; };
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
    return DatePickerDirective;
}());
export { DatePickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUUzRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFFBQVEsRUFDUixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUl6QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0NBQXdDLENBQUE7QUFRbkU7SUFnSkUsNkJBQW1CLGdCQUFrQyxFQUNsQyxPQUFtQixFQUNuQix3QkFBa0QsRUFDbEQsT0FBbUMsRUFDdkIsV0FBc0IsRUFDbEMsWUFBMEI7UUFMMUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFDbEQsWUFBTyxHQUFQLE9BQU8sQ0FBNEI7UUFDdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVc7UUFDbEMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFqQ25DLFNBQUksR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBQ2hDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBQ2pDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBaUIsQ0FBQztRQUM3QyxrQkFBYSxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZELGNBQVMsR0FBNEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN4RCxlQUFVLEdBQTRCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDekQsYUFBUSxHQUFrQyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBVS9ELFVBQUssR0FBaUIsS0FBSyxDQUFDO0lBa0JwQyxDQUFDO0lBcEpELHNCQUFJLHVDQUFNO2FBQVY7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzthQUVxQixVQUFXLE1BQWtDO1lBQ2pFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVGLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDOzs7T0FOQTtJQVFELHNCQUFJLHlDQUFRO2FBQVo7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsQ0FBQzthQUVRLFVBQWEsUUFBNkI7WUFDakQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7WUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDOzs7T0FQQTtJQVNELHNCQUFJLHNDQUFLO2FBQVQ7WUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzthQUVRLFVBQVUsS0FBYTtZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzthQUMvQjtZQUVELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDOzs7T0FUQTtJQVdELHNCQUFJLHFDQUFJO2FBQVI7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzthQUVRLFVBQVMsSUFBa0I7WUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7YUFDN0I7WUFFRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQzs7O09BVEE7SUFXRCxzQkFBSSx3Q0FBTzthQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7YUFFUSxVQUFZLE9BQTRCO1lBQy9DLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQ3hCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2dCQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQzVCO1lBRUQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7OztPQVZBO0lBWUQsc0JBQUksd0NBQU87YUFBWDtZQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDO2FBRVEsVUFBWSxPQUE0QjtZQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztnQkFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUM1QjtZQUVELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDOzs7T0FWQTtJQVlELHNCQUFJLHdDQUFPO2FBQVg7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzthQUVRLFVBQVksT0FBNEI7WUFDL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFDeEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDNUI7WUFFRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQzs7O09BVkE7SUFZRCxzQkFBSSx3Q0FBTzthQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7YUFFUSxVQUFZLE9BQTRCO1lBQy9DLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQ3hCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2dCQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQzVCO1lBRUQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7OztPQVZBO0lBWUQsc0JBQUksNENBQVc7YUFBZjtZQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztRQUMzQixDQUFDO2FBRVEsVUFBZ0IsV0FBZ0M7WUFDdkQsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7WUFDaEMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7OztPQVBBO0lBNkNELHNDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7UUFDL0IsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNyQyxDQUFDO0lBRUQsOENBQWdCLEdBQWhCO1FBQ0UsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLHVCQUF1QixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDM0YsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUNqRSxDQUFDO0lBRUQscURBQXVCLEdBQXZCO1FBQUEsaUJBK0NDO1FBOUNDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6RCxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBQyxLQUFLO1lBQzVDLElBQUksS0FBSyxLQUFLLEtBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7Z0JBQy9DLElBQU0sTUFBTSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDaEcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUMxQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRWpCLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsVUFBQyxLQUFLLEVBQUUsY0FBYztZQUNyRCxJQUFJLEtBQUssRUFBRTtnQkFDVCxJQUFNLGtCQUFrQixHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFFMUUsSUFBSSxDQUFDLGtCQUFrQixJQUFJLENBQUMsY0FBYyxFQUFFO29CQUMxQyxLQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUN0RTthQUNGO1lBRUQsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFakQsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDVixLQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7b0JBQ25DLFFBQVEsRUFBRSxJQUFJO2lCQUNmLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLEtBQUssR0FBRyxLQUFLLENBQUM7YUFDZjtZQUVELElBQUksTUFBTSxFQUFFO2dCQUNWLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDNUIsSUFBQSw4QkFBSyxDQUFxQjtvQkFDakMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7b0JBQzFDLElBQUksQ0FBQyxjQUFjLEVBQUU7d0JBQ25CLEtBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDMUM7aUJBQ0Y7Z0JBRUQsS0FBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzVDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0QscUNBQU8sR0FBUDtRQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUdELHFDQUFPLEdBQVA7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRCwwQ0FBWSxHQUFaO1FBQ0UsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVPLG9EQUFzQixHQUE5QjtRQUNFLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUN2QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDO1lBQzFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQ25ELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUM3QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBRXpDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFdkIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUU7Z0JBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDM0Q7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3hEO1NBQ0Y7SUFDSCxDQUFDOztnQkEvR29DLGdCQUFnQjtnQkFDekIsVUFBVTtnQkFDTyx3QkFBd0I7Z0JBQ3pDLDBCQUEwQjtnQkFDVixTQUFTLHVCQUF4QyxRQUFRO2dCQUNZLFlBQVk7O0lBL0l2QjtRQUFyQixLQUFLLENBQUMsYUFBYSxDQUFDO3FEQUlwQjtJQU1RO1FBQVIsS0FBSyxFQUFFO3VEQUtQO0lBTVE7UUFBUixLQUFLLEVBQUU7b0RBT1A7SUFNUTtRQUFSLEtBQUssRUFBRTttREFPUDtJQU1RO1FBQVIsS0FBSyxFQUFFO3NEQVFQO0lBTVE7UUFBUixLQUFLLEVBQUU7c0RBUVA7SUFNUTtRQUFSLEtBQUssRUFBRTtzREFRUDtJQU1RO1FBQVIsS0FBSyxFQUFFO3NEQVFQO0lBTVE7UUFBUixLQUFLLEVBQUU7MERBS1A7SUFFUztRQUFULE1BQU0sRUFBRTtxREFBaUM7SUFDaEM7UUFBVCxNQUFNLEVBQUU7c0RBQWtDO0lBQ2pDO1FBQVQsTUFBTSxFQUFFO3lEQUE4QztJQUM3QztRQUFULE1BQU0sRUFBRTs4REFBd0Q7SUFDdkQ7UUFBVCxNQUFNLEVBQUU7MERBQXlEO0lBQ3hEO1FBQVQsTUFBTSxFQUFFOzJEQUEwRDtJQUN6RDtRQUFULE1BQU0sRUFBRTt5REFBOEQ7SUE2RnZFO1FBREMsWUFBWSxDQUFDLE9BQU8sQ0FBQztzREFHckI7SUFHRDtRQURDLFlBQVksQ0FBQyxPQUFPLENBQUM7c0RBR3JCO0lBOU5VLG1CQUFtQjtRQUwvQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixTQUFTLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztZQUN2QyxRQUFRLEVBQUUsZUFBZTtTQUMxQixDQUFDO1FBcUphLG1CQUFBLFFBQVEsRUFBRSxDQUFBO09BcEpaLG1CQUFtQixDQWdRL0I7SUFBRCwwQkFBQztDQUFBLEFBaFFELElBZ1FDO1NBaFFZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2FsZW5kYXJNb2RlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItbW9kZSc7XG5pbXBvcnQge0lEYXRlUGlja2VyRGlyZWN0aXZlQ29uZmlnfSBmcm9tICcuL2RhdGUtcGlja2VyLWRpcmVjdGl2ZS1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtEYXRlUGlja2VyRGlyZWN0aXZlU2VydmljZX0gZnJvbSAnLi9kYXRlLXBpY2tlci1kaXJlY3RpdmUuc2VydmljZSc7XG5pbXBvcnQge0lEcERheVBpY2tlckFwaX0gZnJvbSAnLi9kYXRlLXBpY2tlci5hcGknO1xuaW1wb3J0IHtEYXRlUGlja2VyQ29tcG9uZW50fSBmcm9tICcuL2RhdGUtcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtTaW5nbGVDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2luZ2xlLWNhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7SU5hdkV2ZW50fSBmcm9tICcuLi9jb21tb24vbW9kZWxzL25hdmlnYXRpb24tZXZlbnQubW9kZWwnO1xuaW1wb3J0IHtVdGlsc1NlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJ1xuaW1wb3J0IHtJU2VsZWN0aW9uRXZlbnR9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9zZWxlY3Rpb24tZXZldC5tb2RlbCc7XG5cbkBEaXJlY3RpdmUoe1xuICBleHBvcnRBczogJ2RwRGF5UGlja2VyJyxcbiAgcHJvdmlkZXJzOiBbRGF0ZVBpY2tlckRpcmVjdGl2ZVNlcnZpY2VdLFxuICBzZWxlY3RvcjogJ1tkcERheVBpY2tlcl0nXG59KVxuZXhwb3J0IGNsYXNzIERhdGVQaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGdldCBjb25maWcoKTogSURhdGVQaWNrZXJEaXJlY3RpdmVDb25maWcge1xuICAgIHJldHVybiB0aGlzLl9jb25maWc7XG4gIH1cblxuICBASW5wdXQoJ2RwRGF5UGlja2VyJykgc2V0IGNvbmZpZyhjb25maWc6IElEYXRlUGlja2VyRGlyZWN0aXZlQ29uZmlnKSB7XG4gICAgdGhpcy5fY29uZmlnID0gdGhpcy5zZXJ2aWNlLmdldENvbmZpZyhjb25maWcsIHRoaXMudmlld0NvbnRhaW5lclJlZi5lbGVtZW50LCB0aGlzLmF0dGFjaFRvKTtcbiAgICB0aGlzLnVwZGF0ZURhdGVwaWNrZXJDb25maWcoKTtcbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IGF0dGFjaFRvKCk6IEVsZW1lbnRSZWYgfCBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9hdHRhY2hUbztcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBhdHRhY2hUbyhhdHRhY2hUbzogRWxlbWVudFJlZiB8IHN0cmluZykge1xuICAgIHRoaXMuX2F0dGFjaFRvID0gYXR0YWNoVG87XG4gICAgdGhpcy5fY29uZmlnID0gdGhpcy5zZXJ2aWNlLmdldENvbmZpZyh0aGlzLmNvbmZpZywgdGhpcy52aWV3Q29udGFpbmVyUmVmLmVsZW1lbnQsIHRoaXMuYXR0YWNoVG8pO1xuICAgIHRoaXMudXBkYXRlRGF0ZXBpY2tlckNvbmZpZygpO1xuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgdGhlbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdGhlbWU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgdGhlbWUodGhlbWU6IHN0cmluZykge1xuICAgIHRoaXMuX3RoZW1lID0gdGhlbWU7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLnRoZW1lID0gdGhlbWU7XG4gICAgfVxuXG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBtb2RlKCk6IENhbGVuZGFyTW9kZSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgbW9kZShtb2RlOiBDYWxlbmRhck1vZGUpIHtcbiAgICB0aGlzLl9tb2RlID0gbW9kZTtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubW9kZSA9IG1vZGU7XG4gICAgfVxuXG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBtaW5EYXRlKCk6IFNpbmdsZUNhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLl9taW5EYXRlO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IG1pbkRhdGUobWluRGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIHRoaXMuX21pbkRhdGUgPSBtaW5EYXRlO1xuICAgIGlmICh0aGlzLmRhdGVQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5taW5EYXRlID0gbWluRGF0ZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5uZ09uSW5pdCgpO1xuICAgIH1cblxuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgbWF4RGF0ZSgpOiBTaW5nbGVDYWxlbmRhclZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4RGF0ZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBtYXhEYXRlKG1heERhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWUpIHtcbiAgICB0aGlzLl9tYXhEYXRlID0gbWF4RGF0ZTtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWF4RGF0ZSA9IG1heERhdGU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubmdPbkluaXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IG1pblRpbWUoKTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMuX21pblRpbWU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgbWluVGltZShtaW5UaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgdGhpcy5fbWluVGltZSA9IG1pblRpbWU7XG4gICAgaWYgKHRoaXMuZGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1pblRpbWUgPSBtaW5UaW1lO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm5nT25Jbml0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBtYXhUaW1lKCk6IFNpbmdsZUNhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLl9tYXhUaW1lO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IG1heFRpbWUobWF4VGltZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIHRoaXMuX21heFRpbWUgPSBtYXhUaW1lO1xuICAgIGlmICh0aGlzLmRhdGVQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5tYXhUaW1lID0gbWF4VGltZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5uZ09uSW5pdCgpO1xuICAgIH1cblxuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgZGlzcGxheURhdGUoKTogU2luZ2xlQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc3BsYXlEYXRlO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IGRpc3BsYXlEYXRlKGRpc3BsYXlEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgdGhpcy5fZGlzcGxheURhdGUgPSBkaXNwbGF5RGF0ZTtcbiAgICB0aGlzLnVwZGF0ZURhdGVwaWNrZXJDb25maWcoKTtcblxuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBAT3V0cHV0KCkgb3BlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIGNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENhbGVuZGFyVmFsdWU+KCk7XG4gIEBPdXRwdXQoKSBvbkdvVG9DdXJyZW50OiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkxlZnROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25SaWdodE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblNlbGVjdDogRXZlbnRFbWl0dGVyPElTZWxlY3Rpb25FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIGRhdGVQaWNrZXI6IERhdGVQaWNrZXJDb21wb25lbnQ7XG4gIGFwaTogSURwRGF5UGlja2VyQXBpO1xuXG4gIHByaXZhdGUgX2NvbmZpZzogSURhdGVQaWNrZXJEaXJlY3RpdmVDb25maWc7XG5cbiAgcHJpdmF0ZSBfYXR0YWNoVG86IEVsZW1lbnRSZWYgfCBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfdGhlbWU6IHN0cmluZztcblxuICBwcml2YXRlIF9tb2RlOiBDYWxlbmRhck1vZGUgPSAnZGF5JztcblxuICBwcml2YXRlIF9taW5EYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuXG4gIHByaXZhdGUgX21heERhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG5cbiAgcHJpdmF0ZSBfbWluVGltZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcblxuICBwcml2YXRlIF9tYXhUaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuXG4gIHByaXZhdGUgX2Rpc3BsYXlEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICAgICAgICBwdWJsaWMgZWxlbVJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHVibGljIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgc2VydmljZTogRGF0ZVBpY2tlckRpcmVjdGl2ZVNlcnZpY2UsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHB1YmxpYyBmb3JtQ29udHJvbDogTmdDb250cm9sLFxuICAgICAgICAgICAgICBwdWJsaWMgdXRpbHNTZXJ2aWNlOiBVdGlsc1NlcnZpY2UpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZGF0ZVBpY2tlciA9IHRoaXMuY3JlYXRlRGF0ZVBpY2tlcigpO1xuICAgIHRoaXMuYXBpID0gdGhpcy5kYXRlUGlja2VyLmFwaTtcbiAgICB0aGlzLnVwZGF0ZURhdGVwaWNrZXJDb25maWcoKTtcbiAgICB0aGlzLmF0dGFjaE1vZGVsVG9EYXRlUGlja2VyKCk7XG4gICAgdGhpcy5kYXRlUGlja2VyLnRoZW1lID0gdGhpcy50aGVtZTtcbiAgfVxuXG4gIGNyZWF0ZURhdGVQaWNrZXIoKTogRGF0ZVBpY2tlckNvbXBvbmVudCB7XG4gICAgY29uc3QgZmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KERhdGVQaWNrZXJDb21wb25lbnQpO1xuICAgIHJldHVybiB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGZhY3RvcnkpLmluc3RhbmNlO1xuICB9XG5cbiAgYXR0YWNoTW9kZWxUb0RhdGVQaWNrZXIoKSB7XG4gICAgaWYgKCF0aGlzLmZvcm1Db250cm9sKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kYXRlUGlja2VyLm9uVmlld0RhdGVDaGFuZ2UodGhpcy5mb3JtQ29udHJvbC52YWx1ZSk7XG5cbiAgICB0aGlzLmZvcm1Db250cm9sLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUgIT09IHRoaXMuZGF0ZVBpY2tlci5pbnB1dEVsZW1lbnRWYWx1ZSkge1xuICAgICAgICBjb25zdCBzdHJWYWwgPSB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0VG9TdHJpbmcodmFsdWUsIHRoaXMuZGF0ZVBpY2tlci5jb21wb25lbnRDb25maWcuZm9ybWF0KTtcbiAgICAgICAgdGhpcy5kYXRlUGlja2VyLm9uVmlld0RhdGVDaGFuZ2Uoc3RyVmFsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBzZXR1cCA9IHRydWU7XG5cbiAgICB0aGlzLmRhdGVQaWNrZXIucmVnaXN0ZXJPbkNoYW5nZSgodmFsdWUsIGNoYW5nZWRCeUlucHV0KSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgY29uc3QgaXNNdWx0aXNlbGVjdEVtcHR5ID0gc2V0dXAgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgIXZhbHVlLmxlbmd0aDtcblxuICAgICAgICBpZiAoIWlzTXVsdGlzZWxlY3RFbXB0eSAmJiAhY2hhbmdlZEJ5SW5wdXQpIHtcbiAgICAgICAgICB0aGlzLmZvcm1Db250cm9sLmNvbnRyb2wuc2V0VmFsdWUodGhpcy5kYXRlUGlja2VyLmlucHV0RWxlbWVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBlcnJvcnMgPSB0aGlzLmRhdGVQaWNrZXIudmFsaWRhdGVGbih2YWx1ZSk7XG5cbiAgICAgIGlmICghc2V0dXApIHtcbiAgICAgICAgdGhpcy5mb3JtQ29udHJvbC5jb250cm9sLm1hcmtBc0RpcnR5KHtcbiAgICAgICAgICBvbmx5U2VsZjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldHVwID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgaWYgKGVycm9ycy5oYXNPd25Qcm9wZXJ0eSgnZm9ybWF0JykpIHtcbiAgICAgICAgICBjb25zdCB7Z2l2ZW59ID0gZXJyb3JzWydmb3JtYXQnXTtcbiAgICAgICAgICB0aGlzLmRhdGVQaWNrZXIuaW5wdXRFbGVtZW50VmFsdWUgPSBnaXZlbjtcbiAgICAgICAgICBpZiAoIWNoYW5nZWRCeUlucHV0KSB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Db250cm9sLmNvbnRyb2wuc2V0VmFsdWUoZ2l2ZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZm9ybUNvbnRyb2wuY29udHJvbC5zZXRFcnJvcnMoZXJyb3JzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgb25DbGljaygpIHtcbiAgICB0aGlzLmRhdGVQaWNrZXIub25DbGljaygpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnKVxuICBvbkZvY3VzKCkge1xuICAgIHRoaXMuZGF0ZVBpY2tlci5pbnB1dEZvY3VzZWQoKTtcbiAgfVxuXG4gIG1hcmtGb3JDaGVjaygpIHtcbiAgICBpZiAodGhpcy5kYXRlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVEYXRlcGlja2VyQ29uZmlnKCkge1xuICAgIGlmICh0aGlzLmRhdGVQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5taW5EYXRlID0gdGhpcy5taW5EYXRlO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1heERhdGUgPSB0aGlzLm1heERhdGU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIubWluVGltZSA9IHRoaXMubWluVGltZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5tYXhUaW1lID0gdGhpcy5tYXhUaW1lO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm1vZGUgPSB0aGlzLm1vZGUgfHwgJ2RheSc7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIuZGlzcGxheURhdGUgPSB0aGlzLmRpc3BsYXlEYXRlO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLmNvbmZpZyA9IHRoaXMuY29uZmlnO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm9wZW4gPSB0aGlzLm9wZW47XG4gICAgICB0aGlzLmRhdGVQaWNrZXIuY2xvc2UgPSB0aGlzLmNsb3NlO1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlci5vbkdvVG9DdXJyZW50ID0gdGhpcy5vbkdvVG9DdXJyZW50O1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm9uTGVmdE5hdiA9IHRoaXMub25MZWZ0TmF2O1xuICAgICAgdGhpcy5kYXRlUGlja2VyLm9uUmlnaHROYXYgPSB0aGlzLm9uUmlnaHROYXY7XG4gICAgICB0aGlzLmRhdGVQaWNrZXIub25TZWxlY3QgPSB0aGlzLm9uU2VsZWN0O1xuXG4gICAgICB0aGlzLmRhdGVQaWNrZXIuaW5pdCgpO1xuXG4gICAgICBpZiAodGhpcy5kYXRlUGlja2VyLmNvbXBvbmVudENvbmZpZy5kaXNhYmxlS2V5cHJlc3MpIHtcbiAgICAgICAgdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdyZWFkb25seScsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdyZWFkb25seScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19
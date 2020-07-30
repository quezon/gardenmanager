import * as tslib_1 from "tslib";
import { DomHelper } from '../common/services/dom-appender/dom-appender.service';
import { UtilsService } from '../common/services/utils/utils.service';
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { DayTimeCalendarService } from '../day-time-calendar/day-time-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { DatePickerService } from './date-picker.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectEvent } from '../common/types/selection-evet.enum.';
var DatePickerComponent = /** @class */ (function () {
    function DatePickerComponent(dayPickerService, domHelper, elemRef, renderer, utilsService, cd) {
        this.dayPickerService = dayPickerService;
        this.domHelper = domHelper;
        this.elemRef = elemRef;
        this.renderer = renderer;
        this.utilsService = utilsService;
        this.cd = cd;
        this.isInitialized = false;
        this.mode = 'day';
        this.placeholder = '';
        this.disabled = false;
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.hideStateHelper = false;
        this.isFocusedTrigger = false;
        this.handleInnerElementClickUnlisteners = [];
        this.globalListenersUnlisteners = [];
        this.api = {
            open: this.showCalendars.bind(this),
            close: this.hideCalendar.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
        this.selectEvent = SelectEvent;
        this._areCalendarsShown = false;
        this._selected = [];
    }
    DatePickerComponent_1 = DatePickerComponent;
    Object.defineProperty(DatePickerComponent.prototype, "openOnFocus", {
        get: function () {
            return this.componentConfig.openOnFocus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "openOnClick", {
        get: function () {
            return this.componentConfig.openOnClick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "areCalendarsShown", {
        get: function () {
            return this._areCalendarsShown;
        },
        set: function (value) {
            if (value) {
                this.startGlobalListeners();
                this.domHelper.appendElementToPosition({
                    container: this.appendToElement,
                    element: this.calendarWrapper,
                    anchor: this.inputElementContainer,
                    dimElem: this.popupElem,
                    drops: this.componentConfig.drops,
                    opens: this.componentConfig.opens
                });
            }
            else {
                this.stopGlobalListeners();
                this.dayPickerService.pickerClosed();
            }
            this._areCalendarsShown = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.inputElementValue = this.utilsService
                .convertFromMomentArray(this.componentConfig.format, selected, ECalendarValue.StringArr)
                .join(' | ');
            var val = this.processOnChangeCallback(selected);
            this.onChangeCallback(val, false);
            this.onChange.emit(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "currentDateView", {
        get: function () {
            return this._currentDateView;
        },
        set: function (date) {
            this._currentDateView = date;
            if (this.dayCalendarRef) {
                this.dayCalendarRef.moveCalendarTo(date);
            }
            if (this.monthCalendarRef) {
                this.monthCalendarRef.moveCalendarTo(date);
            }
            if (this.dayTimeCalendarRef) {
                this.dayTimeCalendarRef.moveCalendarTo(date);
            }
        },
        enumerable: true,
        configurable: true
    });
    DatePickerComponent.prototype.onClick = function () {
        if (!this.openOnClick) {
            return;
        }
        if (!this.isFocusedTrigger && !this.disabled) {
            this.hideStateHelper = true;
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
        }
    };
    DatePickerComponent.prototype.onBodyClick = function () {
        if (this.componentConfig.hideOnOutsideClick) {
            if (!this.hideStateHelper && this.areCalendarsShown) {
                this.hideCalendar();
            }
            this.hideStateHelper = false;
        }
    };
    DatePickerComponent.prototype.onScroll = function () {
        if (this.areCalendarsShown) {
            this.domHelper.setElementPosition({
                container: this.appendToElement,
                element: this.calendarWrapper,
                anchor: this.inputElementContainer,
                dimElem: this.popupElem,
                drops: this.componentConfig.drops,
                opens: this.componentConfig.opens
            });
        }
    };
    DatePickerComponent.prototype.writeValue = function (value) {
        this.inputValue = value;
        if (value || value === '') {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig);
            this.init();
        }
        else {
            this.selected = [];
        }
        this.cd.markForCheck();
    };
    DatePickerComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    DatePickerComponent.prototype.onChangeCallback = function (_, changedByInput) {
    };
    DatePickerComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    DatePickerComponent.prototype.onTouchedCallback = function () {
    };
    DatePickerComponent.prototype.validate = function (formControl) {
        return this.validateFn(formControl.value);
    };
    DatePickerComponent.prototype.processOnChangeCallback = function (selected) {
        if (typeof selected === 'string') {
            return selected;
        }
        else {
            return this.utilsService.convertFromMomentArray(this.componentConfig.format, selected, this.componentConfig.returnedValueType || this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect));
        }
    };
    DatePickerComponent.prototype.initValidators = function () {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, this.componentConfig.format, this.mode);
        this.onChangeCallback(this.processOnChangeCallback(this.selected), false);
    };
    DatePickerComponent.prototype.ngOnInit = function () {
        this.isInitialized = true;
        this.init();
    };
    DatePickerComponent.prototype.ngOnChanges = function (changes) {
        if (this.isInitialized) {
            this.init();
        }
    };
    DatePickerComponent.prototype.ngAfterViewInit = function () {
        this.setElementPositionInDom();
    };
    DatePickerComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this.cd.markForCheck();
    };
    DatePickerComponent.prototype.setElementPositionInDom = function () {
        this.calendarWrapper = this.calendarContainer.nativeElement;
        this.setInputElementContainer();
        this.popupElem = this.elemRef.nativeElement.querySelector('.dp-popup');
        this.handleInnerElementClick(this.popupElem);
        var appendTo = this.componentConfig.appendTo;
        if (appendTo) {
            if (typeof appendTo === 'string') {
                this.appendToElement = document.querySelector(appendTo);
            }
            else {
                this.appendToElement = appendTo;
            }
        }
        else {
            this.appendToElement = this.elemRef.nativeElement;
        }
        this.appendToElement.appendChild(this.calendarWrapper);
    };
    DatePickerComponent.prototype.setInputElementContainer = function () {
        this.inputElementContainer = this.utilsService.getNativeElement(this.componentConfig.inputElementContainer)
            || this.elemRef.nativeElement.querySelector('.dp-input-container')
            || document.body;
    };
    DatePickerComponent.prototype.handleInnerElementClick = function (element) {
        var _this = this;
        this.handleInnerElementClickUnlisteners.push(this.renderer.listen(element, 'click', function () {
            _this.hideStateHelper = true;
        }));
    };
    DatePickerComponent.prototype.init = function () {
        this.componentConfig = this.dayPickerService.getConfig(this.config, this.mode);
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
        this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfigService(this.componentConfig);
        this.timeSelectConfig = this.dayPickerService.getTimeConfigService(this.componentConfig);
        this.initValidators();
    };
    DatePickerComponent.prototype.inputFocused = function () {
        var _this = this;
        if (!this.openOnFocus) {
            return;
        }
        this.isFocusedTrigger = true;
        setTimeout(function () {
            if (!_this.areCalendarsShown) {
                _this.showCalendars();
            }
            _this.hideStateHelper = false;
            _this.isFocusedTrigger = false;
            _this.cd.markForCheck();
        }, this.componentConfig.onOpenDelay);
    };
    DatePickerComponent.prototype.inputBlurred = function () {
        this.onTouchedCallback();
    };
    DatePickerComponent.prototype.showCalendars = function () {
        this.hideStateHelper = true;
        this.areCalendarsShown = true;
        if (this.timeSelectRef) {
            this.timeSelectRef.api.triggerChange();
        }
        this.open.emit();
        this.cd.markForCheck();
    };
    DatePickerComponent.prototype.hideCalendar = function () {
        this.areCalendarsShown = false;
        if (this.dayCalendarRef) {
            this.dayCalendarRef.api.toggleCalendarMode(ECalendarMode.Day);
        }
        this.close.emit();
        this.cd.markForCheck();
    };
    DatePickerComponent.prototype.onViewDateChange = function (value) {
        var strVal = value ? this.utilsService.convertToString(value, this.componentConfig.format) : '';
        if (this.dayPickerService.isValidInputDateValue(strVal, this.componentConfig)) {
            this.selected = this.dayPickerService.convertInputValueToMomentArray(strVal, this.componentConfig);
            this.currentDateView = this.selected.length
                ? this.utilsService.getDefaultDisplayDate(null, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min)
                : this.currentDateView;
            this.onSelect.emit({
                date: strVal,
                type: SelectEvent.INPUT,
                granularity: null
            });
        }
        else {
            this._selected = this.utilsService
                .getValidMomentArray(strVal, this.componentConfig.format);
            this.onChangeCallback(this.processOnChangeCallback(strVal), true);
        }
    };
    DatePickerComponent.prototype.dateSelected = function (date, granularity, type, ignoreClose) {
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, date, granularity);
        if (!ignoreClose) {
            this.onDateClick();
        }
        this.onSelect.emit({
            date: date.date,
            granularity: granularity,
            type: type
        });
    };
    DatePickerComponent.prototype.onDateClick = function () {
        if (this.componentConfig.closeOnSelect) {
            setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
        }
    };
    DatePickerComponent.prototype.onKeyPress = function (event) {
        switch (event.keyCode) {
            case (9):
            case (27):
                this.hideCalendar();
                break;
        }
    };
    DatePickerComponent.prototype.moveCalendarTo = function (date) {
        var momentDate = this.utilsService.convertToMoment(date, this.componentConfig.format);
        this.currentDateView = momentDate;
    };
    DatePickerComponent.prototype.onLeftNavClick = function (change) {
        this.onLeftNav.emit(change);
    };
    DatePickerComponent.prototype.onRightNavClick = function (change) {
        this.onRightNav.emit(change);
    };
    DatePickerComponent.prototype.startGlobalListeners = function () {
        var _this = this;
        this.globalListenersUnlisteners.push(this.renderer.listen(document, 'keydown', function (e) {
            _this.onKeyPress(e);
        }), this.renderer.listen(document, 'scroll', function () {
            _this.onScroll();
        }), this.renderer.listen(document, 'click', function () {
            _this.onBodyClick();
        }));
    };
    DatePickerComponent.prototype.stopGlobalListeners = function () {
        this.globalListenersUnlisteners.forEach(function (ul) { return ul(); });
        this.globalListenersUnlisteners = [];
    };
    DatePickerComponent.prototype.ngOnDestroy = function () {
        this.handleInnerElementClickUnlisteners.forEach(function (ul) { return ul(); });
        if (this.appendToElement) {
            this.appendToElement.removeChild(this.calendarWrapper);
        }
    };
    var DatePickerComponent_1;
    DatePickerComponent.ctorParameters = function () { return [
        { type: DatePickerService },
        { type: DomHelper },
        { type: ElementRef },
        { type: Renderer2 },
        { type: UtilsService },
        { type: ChangeDetectorRef }
    ]; };
    tslib_1.__decorate([
        Input()
    ], DatePickerComponent.prototype, "config", void 0);
    tslib_1.__decorate([
        Input()
    ], DatePickerComponent.prototype, "mode", void 0);
    tslib_1.__decorate([
        Input()
    ], DatePickerComponent.prototype, "placeholder", void 0);
    tslib_1.__decorate([
        Input()
    ], DatePickerComponent.prototype, "disabled", void 0);
    tslib_1.__decorate([
        Input()
    ], DatePickerComponent.prototype, "displayDate", void 0);
    tslib_1.__decorate([
        HostBinding('class'), Input()
    ], DatePickerComponent.prototype, "theme", void 0);
    tslib_1.__decorate([
        Input()
    ], DatePickerComponent.prototype, "minDate", void 0);
    tslib_1.__decorate([
        Input()
    ], DatePickerComponent.prototype, "maxDate", void 0);
    tslib_1.__decorate([
        Input()
    ], DatePickerComponent.prototype, "minTime", void 0);
    tslib_1.__decorate([
        Input()
    ], DatePickerComponent.prototype, "maxTime", void 0);
    tslib_1.__decorate([
        Output()
    ], DatePickerComponent.prototype, "open", void 0);
    tslib_1.__decorate([
        Output()
    ], DatePickerComponent.prototype, "close", void 0);
    tslib_1.__decorate([
        Output()
    ], DatePickerComponent.prototype, "onChange", void 0);
    tslib_1.__decorate([
        Output()
    ], DatePickerComponent.prototype, "onGoToCurrent", void 0);
    tslib_1.__decorate([
        Output()
    ], DatePickerComponent.prototype, "onLeftNav", void 0);
    tslib_1.__decorate([
        Output()
    ], DatePickerComponent.prototype, "onRightNav", void 0);
    tslib_1.__decorate([
        Output()
    ], DatePickerComponent.prototype, "onSelect", void 0);
    tslib_1.__decorate([
        ViewChild('container', { static: false })
    ], DatePickerComponent.prototype, "calendarContainer", void 0);
    tslib_1.__decorate([
        ViewChild('dayCalendar', { static: false })
    ], DatePickerComponent.prototype, "dayCalendarRef", void 0);
    tslib_1.__decorate([
        ViewChild('monthCalendar', { static: false })
    ], DatePickerComponent.prototype, "monthCalendarRef", void 0);
    tslib_1.__decorate([
        ViewChild('daytimeCalendar', { static: false })
    ], DatePickerComponent.prototype, "dayTimeCalendarRef", void 0);
    tslib_1.__decorate([
        ViewChild('timeSelect', { static: false })
    ], DatePickerComponent.prototype, "timeSelectRef", void 0);
    tslib_1.__decorate([
        HostListener('click')
    ], DatePickerComponent.prototype, "onClick", null);
    tslib_1.__decorate([
        HostListener('window:resize')
    ], DatePickerComponent.prototype, "onScroll", null);
    DatePickerComponent = DatePickerComponent_1 = tslib_1.__decorate([
        Component({
            selector: 'dp-date-picker',
            template: "<div [ngClass]=\"{'dp-open': areCalendarsShown}\">\n  <div [attr.data-hidden]=\"componentConfig.hideInputContainer\"\n       [hidden]=\"componentConfig.hideInputContainer\"\n       class=\"dp-input-container\">\n    <input (blur)=\"inputBlurred()\"\n           (focus)=\"inputFocused()\"\n           (ngModelChange)=\"onViewDateChange($event)\"\n           [disabled]=\"disabled\"\n           [ngModel]=\"inputElementValue\"\n           [placeholder]=\"placeholder\"\n           [readonly]=\"componentConfig.disableKeypress\"\n           class=\"dp-picker-input\"\n           type=\"text\"/>\n  </div>\n  <div #container>\n    <div [attr.data-hidden]=\"!_areCalendarsShown\"\n         [hidden]=\"!_areCalendarsShown\"\n         [ngSwitch]=\"mode\"\n         class=\"dp-popup {{theme}}\">\n      <dp-day-calendar #dayCalendar\n                       (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                       (onLeftNav)=\"onLeftNavClick($event)\"\n                       (onRightNav)=\"onRightNavClick($event)\"\n                       (onSelect)=\"dateSelected($event, 'day', selectEvent.SELECTION, false)\"\n                       *ngSwitchCase=\"'day'\"\n                       [config]=\"dayCalendarConfig\"\n                       [displayDate]=\"displayDate\"\n                       [ngModel]=\"_selected\"\n                       [theme]=\"theme\">\n      </dp-day-calendar>\n\n      <dp-month-calendar #monthCalendar\n                         (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                         (onLeftNav)=\"onLeftNavClick($event)\"\n                         (onRightNav)=\"onRightNavClick($event)\"\n                         (onSelect)=\"dateSelected($event, 'month', selectEvent.SELECTION, false)\"\n                         *ngSwitchCase=\"'month'\"\n                         [config]=\"dayCalendarConfig\"\n                         [displayDate]=\"displayDate\"\n                         [ngModel]=\"_selected\"\n                         [theme]=\"theme\">\n      </dp-month-calendar>\n\n      <dp-time-select #timeSelect\n                      (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                      *ngSwitchCase=\"'time'\"\n                      [config]=\"timeSelectConfig\"\n                      [ngModel]=\"_selected && _selected[0]\"\n                      [theme]=\"theme\">\n      </dp-time-select>\n\n      <dp-day-time-calendar #daytimeCalendar\n                            (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                            (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                            (onLeftNav)=\"onLeftNavClick($event)\"\n                            (onRightNav)=\"onRightNavClick($event)\"\n                            *ngSwitchCase=\"'daytime'\"\n                            [config]=\"dayTimeCalendarConfig\"\n                            [displayDate]=\"displayDate\"\n                            [ngModel]=\"_selected && _selected[0]\"\n                            [theme]=\"theme\">\n      </dp-day-time-calendar>\n    </div>\n  </div>\n</div>\n",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            providers: [
                DatePickerService,
                DayTimeCalendarService,
                DayCalendarService,
                TimeSelectService,
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return DatePickerComponent_1; }),
                    multi: true
                },
                {
                    provide: NG_VALIDATORS,
                    useExisting: forwardRef(function () { return DatePickerComponent_1; }),
                    multi: true
                }
            ],
            styles: ["dp-date-picker{display:inline-block}dp-date-picker.dp-material .dp-picker-input{box-sizing:border-box;height:30px;width:213px;font-size:13px;outline:0}dp-date-picker .dp-input-container{position:relative}dp-date-picker .dp-selected{background:#106cc8;color:#fff}.dp-popup{position:relative;background:#fff;box-shadow:1px 1px 5px 0 rgba(0,0,0,.1);border-left:1px solid rgba(0,0,0,.1);border-right:1px solid rgba(0,0,0,.1);border-bottom:1px solid rgba(0,0,0,.1);z-index:9999;white-space:nowrap}"]
        })
    ], DatePickerComponent);
    return DatePickerComponent;
}());
export { DatePickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sc0RBQXNELENBQUM7QUFDL0UsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBRXBFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVqRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFJbkUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFFeEUsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFHdEYsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFHckUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDeEQsT0FBTyxFQUNMLGFBQWEsRUFDYix1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFDTCxTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCxhQUFhLEVBQ2IsaUJBQWlCLEVBR2xCLE1BQU0sZ0JBQWdCLENBQUM7QUFNeEIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBMEJqRTtJQTJIRSw2QkFBNkIsZ0JBQW1DLEVBQ25DLFNBQW9CLEVBQ3BCLE9BQW1CLEVBQ25CLFFBQW1CLEVBQ25CLFlBQTBCLEVBQzNCLEVBQXFCO1FBTHBCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBbUI7UUFDbkMsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwQixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDM0IsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUF4RGpELGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBRXRCLFNBQUksR0FBaUIsS0FBSyxDQUFDO1FBQzNCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFPekIsU0FBSSxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFDaEMsVUFBSyxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFDakMsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFpQixDQUFDO1FBQzdDLGtCQUFhLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdkQsY0FBUyxHQUE0QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3hELGVBQVUsR0FBNEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN6RCxhQUFRLEdBQWtDLElBQUksWUFBWSxFQUFFLENBQUM7UUFVdkUsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFFakMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBTWxDLHVDQUFrQyxHQUFlLEVBQUUsQ0FBQztRQUNwRCwrQkFBMEIsR0FBZSxFQUFFLENBQUM7UUFFNUMsUUFBRyxHQUFvQjtZQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ25DLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbkMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUMvQyxDQUFDO1FBQ0YsZ0JBQVcsR0FBRyxXQUFXLENBQUM7UUFFMUIsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBRXBDLGNBQVMsR0FBYSxFQUFFLENBQUM7SUFVekIsQ0FBQzs0QkFqSVUsbUJBQW1CO0lBTzlCLHNCQUFJLDRDQUFXO2FBQWY7WUFDRSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDO1FBQzFDLENBQUM7OztPQUFBO0lBRUQsc0JBQUksNENBQVc7YUFBZjtZQUNFLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7UUFDMUMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxrREFBaUI7YUFBckI7WUFDRSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUNqQyxDQUFDO2FBRUQsVUFBc0IsS0FBYztZQUNsQyxJQUFJLEtBQUssRUFBRTtnQkFDVCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQztvQkFDckMsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlO29CQUMvQixPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWU7b0JBQzdCLE1BQU0sRUFBRSxJQUFJLENBQUMscUJBQXFCO29CQUNsQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUs7b0JBQ2pDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUs7aUJBQ2xDLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUMzQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDdEM7WUFFRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLENBQUM7OztPQW5CQTtJQXFCRCxzQkFBSSx5Q0FBUTthQUFaO1lBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hCLENBQUM7YUFFRCxVQUFhLFFBQWtCO1lBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsR0FBYyxJQUFJLENBQUMsWUFBWTtpQkFDbEQsc0JBQXNCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLGNBQWMsQ0FBQyxTQUFTLENBQUU7aUJBQ3hGLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNmLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLENBQUM7OztPQVZBO0lBWUQsc0JBQUksZ0RBQWU7YUFBbkI7WUFDRSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUMvQixDQUFDO2FBRUQsVUFBb0IsSUFBWTtZQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBRTdCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDMUM7WUFFRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QztZQUVELElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlDO1FBQ0gsQ0FBQzs7O09BaEJBO0lBOEVELHFDQUFPLEdBQVA7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNyQixPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM1QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO2dCQUMzQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDdEI7U0FDRjtJQUNILENBQUM7SUFFRCx5Q0FBVyxHQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFO1lBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDbkQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQ3JCO1lBRUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBR0Qsc0NBQVEsR0FBUjtRQUNFLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUM7Z0JBQ2hDLFNBQVMsRUFBRSxJQUFJLENBQUMsZUFBZTtnQkFDL0IsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlO2dCQUM3QixNQUFNLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtnQkFDbEMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN2QixLQUFLLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLO2dCQUNqQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLO2FBQ2xDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELHdDQUFVLEdBQVYsVUFBVyxLQUFvQjtRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUV4QixJQUFJLEtBQUssSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVk7aUJBQzlCLG9CQUFvQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7YUFBTTtZQUNMLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1NBQ3BCO1FBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsOENBQWdCLEdBQWhCLFVBQWlCLEVBQU87UUFDdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsOENBQWdCLEdBQWhCLFVBQWlCLENBQU0sRUFBRSxjQUF1QjtJQUNoRCxDQUFDO0lBRUQsK0NBQWlCLEdBQWpCLFVBQWtCLEVBQU87UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsK0NBQWlCLEdBQWpCO0lBQ0EsQ0FBQztJQUVELHNDQUFRLEdBQVIsVUFBUyxXQUF3QjtRQUMvQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxxREFBdUIsR0FBdkIsVUFBd0IsUUFBMkI7UUFDakQsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDaEMsT0FBTyxRQUFRLENBQUM7U0FDakI7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FDN0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQzNCLFFBQVEsRUFDUixJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUNqSSxDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRUQsNENBQWMsR0FBZDtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQ2pEO1lBQ0UsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxzQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELHlDQUFXLEdBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsNkNBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRCw4Q0FBZ0IsR0FBaEIsVUFBaUIsVUFBbUI7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDM0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQscURBQXVCLEdBQXZCO1FBQ0UsSUFBSSxDQUFDLGVBQWUsR0FBZ0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztRQUN6RSxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXRDLElBQUEsd0NBQVEsQ0FBeUI7UUFDeEMsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLGVBQWUsR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBUyxRQUFRLENBQUMsQ0FBQzthQUM5RTtpQkFBTTtnQkFDTCxJQUFJLENBQUMsZUFBZSxHQUFnQixRQUFRLENBQUM7YUFDOUM7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUNuRDtRQUVELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsc0RBQXdCLEdBQXhCO1FBQ0UsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQztlQUN0RyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUM7ZUFDL0QsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQscURBQXVCLEdBQXZCLFVBQXdCLE9BQW9CO1FBQTVDLGlCQU1DO1FBTEMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLElBQUksQ0FDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRTtZQUNyQyxLQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELGtDQUFJLEdBQUo7UUFDRSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVztZQUNyQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUMxRixDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVk7aUJBQ2hCLHFCQUFxQixDQUNwQixJQUFJLENBQUMsZUFBZSxFQUNwQixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQ3JDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUN6QixDQUFDO1FBQ04sSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDakcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCwwQ0FBWSxHQUFaO1FBQUEsaUJBZ0JDO1FBZkMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixVQUFVLENBQUM7WUFDVCxJQUFJLENBQUMsS0FBSSxDQUFDLGlCQUFpQixFQUFFO2dCQUMzQixLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDdEI7WUFFRCxLQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztZQUU3QixLQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQzlCLEtBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekIsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELDBDQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsMkNBQWEsR0FBYjtRQUNFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFFOUIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCwwQ0FBWSxHQUFaO1FBQ0UsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztRQUUvQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCw4Q0FBZ0IsR0FBaEIsVUFBaUIsS0FBb0I7UUFDbkMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2xHLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDN0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsOEJBQThCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNuRyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTtnQkFDekMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQ3ZDLElBQUksRUFDSixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQ3JDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUN6QjtnQkFDRCxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUV6QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDakIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLFdBQVcsQ0FBQyxLQUFLO2dCQUN2QixXQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUE7U0FDSDthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWTtpQkFDL0IsbUJBQW1CLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNuRTtJQUNILENBQUM7SUFFRCwwQ0FBWSxHQUFaLFVBQWEsSUFBVyxFQUFFLFdBQTRCLEVBQUUsSUFBaUIsRUFBRSxXQUFxQjtRQUM5RixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQzlCLGNBQWMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzNGLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsV0FBVyxhQUFBO1lBQ1gsSUFBSSxNQUFBO1NBQ0wsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHlDQUFXLEdBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFO1lBQ3RDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDbkY7SUFDSCxDQUFDO0lBRUQsd0NBQVUsR0FBVixVQUFXLEtBQW9CO1FBQzdCLFFBQVEsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNyQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUNQLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDcEIsTUFBTTtTQUNUO0lBQ0gsQ0FBQztJQUVELDRDQUFjLEdBQWQsVUFBZSxJQUF5QjtRQUN0QyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsNENBQWMsR0FBZCxVQUFlLE1BQWlCO1FBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCw2Q0FBZSxHQUFmLFVBQWdCLE1BQWlCO1FBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxrREFBb0IsR0FBcEI7UUFBQSxpQkFZQztRQVhDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBQyxDQUFnQjtZQUN6RCxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7WUFDdkMsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7WUFDdEMsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRUQsaURBQW1CLEdBQW5CO1FBQ0UsSUFBSSxDQUFDLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQUUsSUFBSyxPQUFBLEVBQUUsRUFBRSxFQUFKLENBQUksQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQywwQkFBMEIsR0FBRyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELHlDQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsa0NBQWtDLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxFQUFFLEVBQUosQ0FBSSxDQUFDLENBQUM7UUFFNUQsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7OztnQkF0VDhDLGlCQUFpQjtnQkFDeEIsU0FBUztnQkFDWCxVQUFVO2dCQUNULFNBQVM7Z0JBQ0wsWUFBWTtnQkFDdkIsaUJBQWlCOztJQXZEeEM7UUFBUixLQUFLLEVBQUU7dURBQTJCO0lBQzFCO1FBQVIsS0FBSyxFQUFFO3FEQUE0QjtJQUMzQjtRQUFSLEtBQUssRUFBRTs0REFBMEI7SUFDekI7UUFBUixLQUFLLEVBQUU7eURBQTJCO0lBQzFCO1FBQVIsS0FBSyxFQUFFOzREQUFrQztJQUNYO1FBQTlCLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUU7c0RBQWU7SUFDcEM7UUFBUixLQUFLLEVBQUU7d0RBQThCO0lBQzdCO1FBQVIsS0FBSyxFQUFFO3dEQUE4QjtJQUM3QjtRQUFSLEtBQUssRUFBRTt3REFBOEI7SUFDN0I7UUFBUixLQUFLLEVBQUU7d0RBQThCO0lBQzVCO1FBQVQsTUFBTSxFQUFFO3FEQUFpQztJQUNoQztRQUFULE1BQU0sRUFBRTtzREFBa0M7SUFDakM7UUFBVCxNQUFNLEVBQUU7eURBQThDO0lBQzdDO1FBQVQsTUFBTSxFQUFFOzhEQUF3RDtJQUN2RDtRQUFULE1BQU0sRUFBRTswREFBeUQ7SUFDeEQ7UUFBVCxNQUFNLEVBQUU7MkRBQTBEO0lBQ3pEO1FBQVQsTUFBTSxFQUFFO3lEQUE4RDtJQUM5QjtRQUF4QyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDO2tFQUErQjtJQUM1QjtRQUExQyxTQUFTLENBQUMsYUFBYSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDOytEQUFzQztJQUNuQztRQUE1QyxTQUFTLENBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDO2lFQUEwQztJQUN2QztRQUE5QyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7bUVBQThDO0lBQ2xEO1FBQXpDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7OERBQW9DO0lBc0M3RTtRQURDLFlBQVksQ0FBQyxPQUFPLENBQUM7c0RBWXJCO0lBYUQ7UUFEQyxZQUFZLENBQUMsZUFBZSxDQUFDO3VEQVk3QjtJQXZLVSxtQkFBbUI7UUF2Qi9CLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsNmlHQUF5QztZQUV6QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtZQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtZQUMvQyxTQUFTLEVBQUU7Z0JBQ1QsaUJBQWlCO2dCQUNqQixzQkFBc0I7Z0JBQ3RCLGtCQUFrQjtnQkFDbEIsaUJBQWlCO2dCQUNqQjtvQkFDRSxPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSxxQkFBbUIsRUFBbkIsQ0FBbUIsQ0FBQztvQkFDbEQsS0FBSyxFQUFFLElBQUk7aUJBQ1o7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGFBQWE7b0JBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLHFCQUFtQixFQUFuQixDQUFtQixDQUFDO29CQUNsRCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGOztTQUNGLENBQUM7T0FDVyxtQkFBbUIsQ0FrYi9CO0lBQUQsMEJBQUM7Q0FBQSxBQWxiRCxJQWtiQztTQWxiWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lEYXRlfSBmcm9tICcuLi9jb21tb24vbW9kZWxzL2RhdGUubW9kZWwnO1xuaW1wb3J0IHtEb21IZWxwZXJ9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy9kb20tYXBwZW5kZXIvZG9tLWFwcGVuZGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtVdGlsc1NlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7Q2FsZW5kYXJNb2RlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItbW9kZSc7XG5pbXBvcnQge0VDYWxlbmRhck1vZGV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci1tb2RlLWVudW0nO1xuaW1wb3J0IHtDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtFQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLXZhbHVlLWVudW0nO1xuaW1wb3J0IHtTaW5nbGVDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2luZ2xlLWNhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7SURheUNhbGVuZGFyQ29uZmlnfSBmcm9tICcuLi9kYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0RheUNhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuLi9kYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge0RheUNhbGVuZGFyU2VydmljZX0gZnJvbSAnLi4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci5zZXJ2aWNlJztcbmltcG9ydCB7SURheVRpbWVDYWxlbmRhckNvbmZpZ30gZnJvbSAnLi4vZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXItY29uZmlnLm1vZGVsJztcbmltcG9ydCB7RGF5VGltZUNhbGVuZGFyU2VydmljZX0gZnJvbSAnLi4vZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQge0lUaW1lU2VsZWN0Q29uZmlnfSBmcm9tICcuLi90aW1lLXNlbGVjdC90aW1lLXNlbGVjdC1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtUaW1lU2VsZWN0Q29tcG9uZW50fSBmcm9tICcuLi90aW1lLXNlbGVjdC90aW1lLXNlbGVjdC5jb21wb25lbnQnO1xuaW1wb3J0IHtUaW1lU2VsZWN0U2VydmljZX0gZnJvbSAnLi4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3Quc2VydmljZSc7XG5pbXBvcnQge0lEYXRlUGlja2VyQ29uZmlnLCBJRGF0ZVBpY2tlckNvbmZpZ0ludGVybmFsfSBmcm9tICcuL2RhdGUtcGlja2VyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0lEcERheVBpY2tlckFwaX0gZnJvbSAnLi9kYXRlLXBpY2tlci5hcGknO1xuaW1wb3J0IHtEYXRlUGlja2VyU2VydmljZX0gZnJvbSAnLi9kYXRlLXBpY2tlci5zZXJ2aWNlJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtQ29udHJvbCxcbiAgTkdfVkFMSURBVE9SUyxcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG4gIFZhbGlkYXRvclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge01vbWVudCwgdW5pdE9mVGltZX0gZnJvbSAnbW9tZW50JztcbmltcG9ydCB7RGF0ZVZhbGlkYXRvcn0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3ZhbGlkYXRvci50eXBlJztcbmltcG9ydCB7TW9udGhDYWxlbmRhckNvbXBvbmVudH0gZnJvbSAnLi4vbW9udGgtY2FsZW5kYXIvbW9udGgtY2FsZW5kYXIuY29tcG9uZW50JztcbmltcG9ydCB7RGF5VGltZUNhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuLi9kYXktdGltZS1jYWxlbmRhci9kYXktdGltZS1jYWxlbmRhci5jb21wb25lbnQnO1xuaW1wb3J0IHtJTmF2RXZlbnR9IGZyb20gJy4uL2NvbW1vbi9tb2RlbHMvbmF2aWdhdGlvbi1ldmVudC5tb2RlbCc7XG5pbXBvcnQge1NlbGVjdEV2ZW50fSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2VsZWN0aW9uLWV2ZXQuZW51bS4nO1xuaW1wb3J0IHtJU2VsZWN0aW9uRXZlbnR9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9zZWxlY3Rpb24tZXZldC5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RwLWRhdGUtcGlja2VyJyxcbiAgdGVtcGxhdGVVcmw6ICdkYXRlLXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXRlLXBpY2tlci5jb21wb25lbnQubGVzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGF0ZVBpY2tlclNlcnZpY2UsXG4gICAgRGF5VGltZUNhbGVuZGFyU2VydmljZSxcbiAgICBEYXlDYWxlbmRhclNlcnZpY2UsXG4gICAgVGltZVNlbGVjdFNlcnZpY2UsXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUGlja2VyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZVBpY2tlckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPbkluaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFmdGVyVmlld0luaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWYWxpZGF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9uRGVzdHJveSB7XG5cbiAgZ2V0IG9wZW5PbkZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudENvbmZpZy5vcGVuT25Gb2N1cztcbiAgfVxuXG4gIGdldCBvcGVuT25DbGljaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRDb25maWcub3Blbk9uQ2xpY2s7XG4gIH1cblxuICBnZXQgYXJlQ2FsZW5kYXJzU2hvd24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FyZUNhbGVuZGFyc1Nob3duO1xuICB9XG5cbiAgc2V0IGFyZUNhbGVuZGFyc1Nob3duKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnN0YXJ0R2xvYmFsTGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLmRvbUhlbHBlci5hcHBlbmRFbGVtZW50VG9Qb3NpdGlvbih7XG4gICAgICAgIGNvbnRhaW5lcjogdGhpcy5hcHBlbmRUb0VsZW1lbnQsXG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuY2FsZW5kYXJXcmFwcGVyLFxuICAgICAgICBhbmNob3I6IHRoaXMuaW5wdXRFbGVtZW50Q29udGFpbmVyLFxuICAgICAgICBkaW1FbGVtOiB0aGlzLnBvcHVwRWxlbSxcbiAgICAgICAgZHJvcHM6IHRoaXMuY29tcG9uZW50Q29uZmlnLmRyb3BzLFxuICAgICAgICBvcGVuczogdGhpcy5jb21wb25lbnRDb25maWcub3BlbnNcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3BHbG9iYWxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuZGF5UGlja2VyU2VydmljZS5waWNrZXJDbG9zZWQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hcmVDYWxlbmRhcnNTaG93biA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGVkKCk6IE1vbWVudFtdIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cblxuICBzZXQgc2VsZWN0ZWQoc2VsZWN0ZWQ6IE1vbWVudFtdKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICB0aGlzLmlucHV0RWxlbWVudFZhbHVlID0gKDxzdHJpbmdbXT50aGlzLnV0aWxzU2VydmljZVxuICAgICAgLmNvbnZlcnRGcm9tTW9tZW50QXJyYXkodGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LCBzZWxlY3RlZCwgRUNhbGVuZGFyVmFsdWUuU3RyaW5nQXJyKSlcbiAgICAgIC5qb2luKCcgfCAnKTtcbiAgICBjb25zdCB2YWwgPSB0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHNlbGVjdGVkKTtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodmFsLCBmYWxzZSk7XG4gICAgdGhpcy5vbkNoYW5nZS5lbWl0KHZhbCk7XG4gIH1cblxuICBnZXQgY3VycmVudERhdGVWaWV3KCk6IE1vbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnREYXRlVmlldztcbiAgfVxuXG4gIHNldCBjdXJyZW50RGF0ZVZpZXcoZGF0ZTogTW9tZW50KSB7XG4gICAgdGhpcy5fY3VycmVudERhdGVWaWV3ID0gZGF0ZTtcblxuICAgIGlmICh0aGlzLmRheUNhbGVuZGFyUmVmKSB7XG4gICAgICB0aGlzLmRheUNhbGVuZGFyUmVmLm1vdmVDYWxlbmRhclRvKGRhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vbnRoQ2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMubW9udGhDYWxlbmRhclJlZi5tb3ZlQ2FsZW5kYXJUbyhkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kYXlUaW1lQ2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMuZGF5VGltZUNhbGVuZGFyUmVmLm1vdmVDYWxlbmRhclRvKGRhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGlzSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgY29uZmlnOiBJRGF0ZVBpY2tlckNvbmZpZztcbiAgQElucHV0KCkgbW9kZTogQ2FsZW5kYXJNb2RlID0gJ2RheSc7XG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnJztcbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgZGlzcGxheURhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBASW5wdXQoKSB0aGVtZTogc3RyaW5nO1xuICBASW5wdXQoKSBtaW5EYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtYXhEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtaW5UaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtYXhUaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBAT3V0cHV0KCkgb3BlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIGNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENhbGVuZGFyVmFsdWU+KCk7XG4gIEBPdXRwdXQoKSBvbkdvVG9DdXJyZW50OiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkxlZnROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25SaWdodE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblNlbGVjdDogRXZlbnRFbWl0dGVyPElTZWxlY3Rpb25FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHtzdGF0aWM6IGZhbHNlfSkgY2FsZW5kYXJDb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2RheUNhbGVuZGFyJywge3N0YXRpYzogZmFsc2V9KSBkYXlDYWxlbmRhclJlZjogRGF5Q2FsZW5kYXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ21vbnRoQ2FsZW5kYXInLCB7c3RhdGljOiBmYWxzZX0pIG1vbnRoQ2FsZW5kYXJSZWY6IE1vbnRoQ2FsZW5kYXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2RheXRpbWVDYWxlbmRhcicsIHtzdGF0aWM6IGZhbHNlfSkgZGF5VGltZUNhbGVuZGFyUmVmOiBEYXlUaW1lQ2FsZW5kYXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ3RpbWVTZWxlY3QnLCB7c3RhdGljOiBmYWxzZX0pIHRpbWVTZWxlY3RSZWY6IFRpbWVTZWxlY3RDb21wb25lbnQ7XG4gIGNvbXBvbmVudENvbmZpZzogSURhdGVQaWNrZXJDb25maWdJbnRlcm5hbDtcbiAgZGF5Q2FsZW5kYXJDb25maWc6IElEYXlDYWxlbmRhckNvbmZpZztcbiAgZGF5VGltZUNhbGVuZGFyQ29uZmlnOiBJRGF5VGltZUNhbGVuZGFyQ29uZmlnO1xuICB0aW1lU2VsZWN0Q29uZmlnOiBJVGltZVNlbGVjdENvbmZpZztcbiAgaGlkZVN0YXRlSGVscGVyOiBib29sZWFuID0gZmFsc2U7XG4gIGlucHV0VmFsdWU6IENhbGVuZGFyVmFsdWU7XG4gIGlzRm9jdXNlZFRyaWdnZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgaW5wdXRFbGVtZW50VmFsdWU6IHN0cmluZztcbiAgY2FsZW5kYXJXcmFwcGVyOiBIVE1MRWxlbWVudDtcbiAgYXBwZW5kVG9FbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgaW5wdXRFbGVtZW50Q29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcG9wdXBFbGVtOiBIVE1MRWxlbWVudDtcbiAgaGFuZGxlSW5uZXJFbGVtZW50Q2xpY2tVbmxpc3RlbmVyczogRnVuY3Rpb25bXSA9IFtdO1xuICBnbG9iYWxMaXN0ZW5lcnNVbmxpc3RlbmVyczogRnVuY3Rpb25bXSA9IFtdO1xuICB2YWxpZGF0ZUZuOiBEYXRlVmFsaWRhdG9yO1xuICBhcGk6IElEcERheVBpY2tlckFwaSA9IHtcbiAgICBvcGVuOiB0aGlzLnNob3dDYWxlbmRhcnMuYmluZCh0aGlzKSxcbiAgICBjbG9zZTogdGhpcy5oaWRlQ2FsZW5kYXIuYmluZCh0aGlzKSxcbiAgICBtb3ZlQ2FsZW5kYXJUbzogdGhpcy5tb3ZlQ2FsZW5kYXJUby5iaW5kKHRoaXMpXG4gIH07XG4gIHNlbGVjdEV2ZW50ID0gU2VsZWN0RXZlbnQ7XG5cbiAgX2FyZUNhbGVuZGFyc1Nob3duOiBib29sZWFuID0gZmFsc2U7XG5cbiAgX3NlbGVjdGVkOiBNb21lbnRbXSA9IFtdO1xuXG4gIF9jdXJyZW50RGF0ZVZpZXc6IE1vbWVudDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGRheVBpY2tlclNlcnZpY2U6IERhdGVQaWNrZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGRvbUhlbHBlcjogRG9tSGVscGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGVsZW1SZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSB1dGlsc1NlcnZpY2U6IFV0aWxzU2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICBvbkNsaWNrKCkge1xuICAgIGlmICghdGhpcy5vcGVuT25DbGljaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc0ZvY3VzZWRUcmlnZ2VyICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmhpZGVTdGF0ZUhlbHBlciA9IHRydWU7XG4gICAgICBpZiAoIXRoaXMuYXJlQ2FsZW5kYXJzU2hvd24pIHtcbiAgICAgICAgdGhpcy5zaG93Q2FsZW5kYXJzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25Cb2R5Q2xpY2soKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50Q29uZmlnLmhpZGVPbk91dHNpZGVDbGljaykge1xuICAgICAgaWYgKCF0aGlzLmhpZGVTdGF0ZUhlbHBlciAmJiB0aGlzLmFyZUNhbGVuZGFyc1Nob3duKSB7XG4gICAgICAgIHRoaXMuaGlkZUNhbGVuZGFyKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIG9uU2Nyb2xsKCkge1xuICAgIGlmICh0aGlzLmFyZUNhbGVuZGFyc1Nob3duKSB7XG4gICAgICB0aGlzLmRvbUhlbHBlci5zZXRFbGVtZW50UG9zaXRpb24oe1xuICAgICAgICBjb250YWluZXI6IHRoaXMuYXBwZW5kVG9FbGVtZW50LFxuICAgICAgICBlbGVtZW50OiB0aGlzLmNhbGVuZGFyV3JhcHBlcixcbiAgICAgICAgYW5jaG9yOiB0aGlzLmlucHV0RWxlbWVudENvbnRhaW5lcixcbiAgICAgICAgZGltRWxlbTogdGhpcy5wb3B1cEVsZW0sXG4gICAgICAgIGRyb3BzOiB0aGlzLmNvbXBvbmVudENvbmZpZy5kcm9wcyxcbiAgICAgICAgb3BlbnM6IHRoaXMuY29tcG9uZW50Q29uZmlnLm9wZW5zXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBDYWxlbmRhclZhbHVlKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmNvbnZlcnRUb01vbWVudEFycmF5KHZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIG9uQ2hhbmdlQ2FsbGJhY2soXzogYW55LCBjaGFuZ2VkQnlJbnB1dDogYm9vbGVhbikge1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIG9uVG91Y2hlZENhbGxiYWNrKCkge1xuICB9XG5cbiAgdmFsaWRhdGUoZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdGVGbihmb3JtQ29udHJvbC52YWx1ZSk7XG4gIH1cblxuICBwcm9jZXNzT25DaGFuZ2VDYWxsYmFjayhzZWxlY3RlZDogTW9tZW50W10gfCBzdHJpbmcpOiBDYWxlbmRhclZhbHVlIHtcbiAgICBpZiAodHlwZW9mIHNlbGVjdGVkID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHNlbGVjdGVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydEZyb21Nb21lbnRBcnJheShcbiAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgICBzZWxlY3RlZCxcbiAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcucmV0dXJuZWRWYWx1ZVR5cGUgfHwgdGhpcy51dGlsc1NlcnZpY2UuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaW5pdFZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0ZUZuID0gdGhpcy51dGlsc1NlcnZpY2UuY3JlYXRlVmFsaWRhdG9yKFxuICAgICAge1xuICAgICAgICBtaW5EYXRlOiB0aGlzLm1pbkRhdGUsXG4gICAgICAgIG1heERhdGU6IHRoaXMubWF4RGF0ZSxcbiAgICAgICAgbWluVGltZTogdGhpcy5taW5UaW1lLFxuICAgICAgICBtYXhUaW1lOiB0aGlzLm1heFRpbWVcbiAgICAgIH0sIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCwgdGhpcy5tb2RlKTtcblxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWQpLCBmYWxzZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluRG9tKCk7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc2V0RWxlbWVudFBvc2l0aW9uSW5Eb20oKTogdm9pZCB7XG4gICAgdGhpcy5jYWxlbmRhcldyYXBwZXIgPSA8SFRNTEVsZW1lbnQ+dGhpcy5jYWxlbmRhckNvbnRhaW5lci5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuc2V0SW5wdXRFbGVtZW50Q29udGFpbmVyKCk7XG4gICAgdGhpcy5wb3B1cEVsZW0gPSB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHAtcG9wdXAnKTtcbiAgICB0aGlzLmhhbmRsZUlubmVyRWxlbWVudENsaWNrKHRoaXMucG9wdXBFbGVtKTtcblxuICAgIGNvbnN0IHthcHBlbmRUb30gPSB0aGlzLmNvbXBvbmVudENvbmZpZztcbiAgICBpZiAoYXBwZW5kVG8pIHtcbiAgICAgIGlmICh0eXBlb2YgYXBwZW5kVG8gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kVG9FbGVtZW50ID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoPHN0cmluZz5hcHBlbmRUbyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFwcGVuZFRvRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hcHBlbmRUbztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hcHBlbmRUb0VsZW1lbnQgPSB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGVuZFRvRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNhbGVuZGFyV3JhcHBlcik7XG4gIH1cblxuICBzZXRJbnB1dEVsZW1lbnRDb250YWluZXIoKSB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnRDb250YWluZXIgPSB0aGlzLnV0aWxzU2VydmljZS5nZXROYXRpdmVFbGVtZW50KHRoaXMuY29tcG9uZW50Q29uZmlnLmlucHV0RWxlbWVudENvbnRhaW5lcilcbiAgICAgIHx8IHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcC1pbnB1dC1jb250YWluZXInKVxuICAgICAgfHwgZG9jdW1lbnQuYm9keTtcbiAgfVxuXG4gIGhhbmRsZUlubmVyRWxlbWVudENsaWNrKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5oYW5kbGVJbm5lckVsZW1lbnRDbGlja1VubGlzdGVuZXJzLnB1c2goXG4gICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbihlbGVtZW50LCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gdHJ1ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jb21wb25lbnRDb25maWcgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuZ2V0Q29uZmlnKHRoaXMuY29uZmlnLCB0aGlzLm1vZGUpO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5kaXNwbGF5RGF0ZVxuICAgICAgPyB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0VG9Nb21lbnQodGhpcy5kaXNwbGF5RGF0ZSwgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KS5jbG9uZSgpXG4gICAgICA6IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5nZXREZWZhdWx0RGlzcGxheURhdGUoXG4gICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcsXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCxcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0LFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLm1pblxuICAgICAgICApO1xuICAgIHRoaXMuZGF5Q2FsZW5kYXJDb25maWcgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuZ2V0RGF5Q29uZmlnU2VydmljZSh0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgdGhpcy5kYXlUaW1lQ2FsZW5kYXJDb25maWcgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuZ2V0RGF5VGltZUNvbmZpZ1NlcnZpY2UodGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgIHRoaXMudGltZVNlbGVjdENvbmZpZyA9IHRoaXMuZGF5UGlja2VyU2VydmljZS5nZXRUaW1lQ29uZmlnU2VydmljZSh0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgdGhpcy5pbml0VmFsaWRhdG9ycygpO1xuICB9XG5cbiAgaW5wdXRGb2N1c2VkKCkge1xuICAgIGlmICghdGhpcy5vcGVuT25Gb2N1cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaXNGb2N1c2VkVHJpZ2dlciA9IHRydWU7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuYXJlQ2FsZW5kYXJzU2hvd24pIHtcbiAgICAgICAgdGhpcy5zaG93Q2FsZW5kYXJzKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuaXNGb2N1c2VkVHJpZ2dlciA9IGZhbHNlO1xuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9LCB0aGlzLmNvbXBvbmVudENvbmZpZy5vbk9wZW5EZWxheSk7XG4gIH1cblxuICBpbnB1dEJsdXJyZWQoKSB7XG4gICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjaygpO1xuICB9XG5cbiAgc2hvd0NhbGVuZGFycygpIHtcbiAgICB0aGlzLmhpZGVTdGF0ZUhlbHBlciA9IHRydWU7XG4gICAgdGhpcy5hcmVDYWxlbmRhcnNTaG93biA9IHRydWU7XG5cbiAgICBpZiAodGhpcy50aW1lU2VsZWN0UmVmKSB7XG4gICAgICB0aGlzLnRpbWVTZWxlY3RSZWYuYXBpLnRyaWdnZXJDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLm9wZW4uZW1pdCgpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBoaWRlQ2FsZW5kYXIoKSB7XG4gICAgdGhpcy5hcmVDYWxlbmRhcnNTaG93biA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuZGF5Q2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMuZGF5Q2FsZW5kYXJSZWYuYXBpLnRvZ2dsZUNhbGVuZGFyTW9kZShFQ2FsZW5kYXJNb2RlLkRheSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZS5lbWl0KCk7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG9uVmlld0RhdGVDaGFuZ2UodmFsdWU6IENhbGVuZGFyVmFsdWUpIHtcbiAgICBjb25zdCBzdHJWYWwgPSB2YWx1ZSA/IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb1N0cmluZyh2YWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KSA6ICcnO1xuICAgIGlmICh0aGlzLmRheVBpY2tlclNlcnZpY2UuaXNWYWxpZElucHV0RGF0ZVZhbHVlKHN0clZhbCwgdGhpcy5jb21wb25lbnRDb25maWcpKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5kYXlQaWNrZXJTZXJ2aWNlLmNvbnZlcnRJbnB1dFZhbHVlVG9Nb21lbnRBcnJheShzdHJWYWwsIHRoaXMuY29tcG9uZW50Q29uZmlnKTtcbiAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5zZWxlY3RlZC5sZW5ndGhcbiAgICAgICAgPyB0aGlzLnV0aWxzU2VydmljZS5nZXREZWZhdWx0RGlzcGxheURhdGUoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkLFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWluXG4gICAgICAgIClcbiAgICAgICAgOiB0aGlzLmN1cnJlbnREYXRlVmlldztcblxuICAgICAgdGhpcy5vblNlbGVjdC5lbWl0KHtcbiAgICAgICAgZGF0ZTogc3RyVmFsLFxuICAgICAgICB0eXBlOiBTZWxlY3RFdmVudC5JTlBVVCxcbiAgICAgICAgZ3JhbnVsYXJpdHk6IG51bGxcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmdldFZhbGlkTW9tZW50QXJyYXkoc3RyVmFsLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpO1xuICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2soc3RyVmFsKSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgZGF0ZVNlbGVjdGVkKGRhdGU6IElEYXRlLCBncmFudWxhcml0eTogdW5pdE9mVGltZS5CYXNlLCB0eXBlOiBTZWxlY3RFdmVudCwgaWdub3JlQ2xvc2U/OiBib29sZWFuKSB7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAudXBkYXRlU2VsZWN0ZWQodGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCwgdGhpcy5zZWxlY3RlZCwgZGF0ZSwgZ3JhbnVsYXJpdHkpO1xuICAgIGlmICghaWdub3JlQ2xvc2UpIHtcbiAgICAgIHRoaXMub25EYXRlQ2xpY2soKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uU2VsZWN0LmVtaXQoe1xuICAgICAgZGF0ZTogZGF0ZS5kYXRlLFxuICAgICAgZ3JhbnVsYXJpdHksXG4gICAgICB0eXBlXG4gICAgfSk7XG4gIH1cblxuICBvbkRhdGVDbGljaygpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRDb25maWcuY2xvc2VPblNlbGVjdCkge1xuICAgICAgc2V0VGltZW91dCh0aGlzLmhpZGVDYWxlbmRhci5iaW5kKHRoaXMpLCB0aGlzLmNvbXBvbmVudENvbmZpZy5jbG9zZU9uU2VsZWN0RGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIG9uS2V5UHJlc3MoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgKDkpOlxuICAgICAgY2FzZSAoMjcpOlxuICAgICAgICB0aGlzLmhpZGVDYWxlbmRhcigpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBtb3ZlQ2FsZW5kYXJUbyhkYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgY29uc3QgbW9tZW50RGF0ZSA9IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb01vbWVudChkYXRlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gbW9tZW50RGF0ZTtcbiAgfVxuXG4gIG9uTGVmdE5hdkNsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vbkxlZnROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgb25SaWdodE5hdkNsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIHN0YXJ0R2xvYmFsTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuZ2xvYmFsTGlzdGVuZXJzVW5saXN0ZW5lcnMucHVzaChcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50LCAna2V5ZG93bicsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMub25LZXlQcmVzcyhlKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnQsICdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMub25TY3JvbGwoKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnQsICdjbGljaycsICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkJvZHlDbGljaygpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgc3RvcEdsb2JhbExpc3RlbmVycygpIHtcbiAgICB0aGlzLmdsb2JhbExpc3RlbmVyc1VubGlzdGVuZXJzLmZvckVhY2goKHVsKSA9PiB1bCgpKTtcbiAgICB0aGlzLmdsb2JhbExpc3RlbmVyc1VubGlzdGVuZXJzID0gW107XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmhhbmRsZUlubmVyRWxlbWVudENsaWNrVW5saXN0ZW5lcnMuZm9yRWFjaCh1bCA9PiB1bCgpKTtcblxuICAgIGlmICh0aGlzLmFwcGVuZFRvRWxlbWVudCkge1xuICAgICAgdGhpcy5hcHBlbmRUb0VsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5jYWxlbmRhcldyYXBwZXIpO1xuICAgIH1cbiAgfVxufVxuIl19
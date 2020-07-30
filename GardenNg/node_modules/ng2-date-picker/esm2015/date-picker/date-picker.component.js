import * as tslib_1 from "tslib";
var DatePickerComponent_1;
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
let DatePickerComponent = DatePickerComponent_1 = class DatePickerComponent {
    constructor(dayPickerService, domHelper, elemRef, renderer, utilsService, cd) {
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
    get openOnFocus() {
        return this.componentConfig.openOnFocus;
    }
    get openOnClick() {
        return this.componentConfig.openOnClick;
    }
    get areCalendarsShown() {
        return this._areCalendarsShown;
    }
    set areCalendarsShown(value) {
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
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.inputElementValue = this.utilsService
            .convertFromMomentArray(this.componentConfig.format, selected, ECalendarValue.StringArr)
            .join(' | ');
        const val = this.processOnChangeCallback(selected);
        this.onChangeCallback(val, false);
        this.onChange.emit(val);
    }
    get currentDateView() {
        return this._currentDateView;
    }
    set currentDateView(date) {
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
    }
    onClick() {
        if (!this.openOnClick) {
            return;
        }
        if (!this.isFocusedTrigger && !this.disabled) {
            this.hideStateHelper = true;
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
        }
    }
    onBodyClick() {
        if (this.componentConfig.hideOnOutsideClick) {
            if (!this.hideStateHelper && this.areCalendarsShown) {
                this.hideCalendar();
            }
            this.hideStateHelper = false;
        }
    }
    onScroll() {
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
    }
    writeValue(value) {
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
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_, changedByInput) {
    }
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    onTouchedCallback() {
    }
    validate(formControl) {
        return this.validateFn(formControl.value);
    }
    processOnChangeCallback(selected) {
        if (typeof selected === 'string') {
            return selected;
        }
        else {
            return this.utilsService.convertFromMomentArray(this.componentConfig.format, selected, this.componentConfig.returnedValueType || this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect));
        }
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, this.componentConfig.format, this.mode);
        this.onChangeCallback(this.processOnChangeCallback(this.selected), false);
    }
    ngOnInit() {
        this.isInitialized = true;
        this.init();
    }
    ngOnChanges(changes) {
        if (this.isInitialized) {
            this.init();
        }
    }
    ngAfterViewInit() {
        this.setElementPositionInDom();
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this.cd.markForCheck();
    }
    setElementPositionInDom() {
        this.calendarWrapper = this.calendarContainer.nativeElement;
        this.setInputElementContainer();
        this.popupElem = this.elemRef.nativeElement.querySelector('.dp-popup');
        this.handleInnerElementClick(this.popupElem);
        const { appendTo } = this.componentConfig;
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
    }
    setInputElementContainer() {
        this.inputElementContainer = this.utilsService.getNativeElement(this.componentConfig.inputElementContainer)
            || this.elemRef.nativeElement.querySelector('.dp-input-container')
            || document.body;
    }
    handleInnerElementClick(element) {
        this.handleInnerElementClickUnlisteners.push(this.renderer.listen(element, 'click', () => {
            this.hideStateHelper = true;
        }));
    }
    init() {
        this.componentConfig = this.dayPickerService.getConfig(this.config, this.mode);
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
        this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfigService(this.componentConfig);
        this.timeSelectConfig = this.dayPickerService.getTimeConfigService(this.componentConfig);
        this.initValidators();
    }
    inputFocused() {
        if (!this.openOnFocus) {
            return;
        }
        this.isFocusedTrigger = true;
        setTimeout(() => {
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
            this.hideStateHelper = false;
            this.isFocusedTrigger = false;
            this.cd.markForCheck();
        }, this.componentConfig.onOpenDelay);
    }
    inputBlurred() {
        this.onTouchedCallback();
    }
    showCalendars() {
        this.hideStateHelper = true;
        this.areCalendarsShown = true;
        if (this.timeSelectRef) {
            this.timeSelectRef.api.triggerChange();
        }
        this.open.emit();
        this.cd.markForCheck();
    }
    hideCalendar() {
        this.areCalendarsShown = false;
        if (this.dayCalendarRef) {
            this.dayCalendarRef.api.toggleCalendarMode(ECalendarMode.Day);
        }
        this.close.emit();
        this.cd.markForCheck();
    }
    onViewDateChange(value) {
        const strVal = value ? this.utilsService.convertToString(value, this.componentConfig.format) : '';
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
    }
    dateSelected(date, granularity, type, ignoreClose) {
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, date, granularity);
        if (!ignoreClose) {
            this.onDateClick();
        }
        this.onSelect.emit({
            date: date.date,
            granularity,
            type
        });
    }
    onDateClick() {
        if (this.componentConfig.closeOnSelect) {
            setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
        }
    }
    onKeyPress(event) {
        switch (event.keyCode) {
            case (9):
            case (27):
                this.hideCalendar();
                break;
        }
    }
    moveCalendarTo(date) {
        const momentDate = this.utilsService.convertToMoment(date, this.componentConfig.format);
        this.currentDateView = momentDate;
    }
    onLeftNavClick(change) {
        this.onLeftNav.emit(change);
    }
    onRightNavClick(change) {
        this.onRightNav.emit(change);
    }
    startGlobalListeners() {
        this.globalListenersUnlisteners.push(this.renderer.listen(document, 'keydown', (e) => {
            this.onKeyPress(e);
        }), this.renderer.listen(document, 'scroll', () => {
            this.onScroll();
        }), this.renderer.listen(document, 'click', () => {
            this.onBodyClick();
        }));
    }
    stopGlobalListeners() {
        this.globalListenersUnlisteners.forEach((ul) => ul());
        this.globalListenersUnlisteners = [];
    }
    ngOnDestroy() {
        this.handleInnerElementClickUnlisteners.forEach(ul => ul());
        if (this.appendToElement) {
            this.appendToElement.removeChild(this.calendarWrapper);
        }
    }
};
DatePickerComponent.ctorParameters = () => [
    { type: DatePickerService },
    { type: DomHelper },
    { type: ElementRef },
    { type: Renderer2 },
    { type: UtilsService },
    { type: ChangeDetectorRef }
];
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
                useExisting: forwardRef(() => DatePickerComponent_1),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => DatePickerComponent_1),
                multi: true
            }
        ],
        styles: ["dp-date-picker{display:inline-block}dp-date-picker.dp-material .dp-picker-input{box-sizing:border-box;height:30px;width:213px;font-size:13px;outline:0}dp-date-picker .dp-input-container{position:relative}dp-date-picker .dp-selected{background:#106cc8;color:#fff}.dp-popup{position:relative;background:#fff;box-shadow:1px 1px 5px 0 rgba(0,0,0,.1);border-left:1px solid rgba(0,0,0,.1);border-right:1px solid rgba(0,0,0,.1);border-bottom:1px solid rgba(0,0,0,.1);z-index:9999;white-space:nowrap}"]
    })
], DatePickerComponent);
export { DatePickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBQy9FLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUVwRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFFakUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBSW5FLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRXhFLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGdEQUFnRCxDQUFDO0FBR3RGLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBR3JFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hELE9BQU8sRUFDTCxhQUFhLEVBQ2IsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLFlBQVksRUFDWixLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxhQUFhLEVBQ2IsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsYUFBYSxFQUNiLGlCQUFpQixFQUdsQixNQUFNLGdCQUFnQixDQUFDO0FBTXhCLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQTBCakUsSUFBYSxtQkFBbUIsMkJBQWhDLE1BQWEsbUJBQW1CO0lBMkg5QixZQUE2QixnQkFBbUMsRUFDbkMsU0FBb0Is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QUFDO0dBQ1csbUJBQW1CLENBa2IvQjtTQWxiWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lEYXRlfSBmcm9tICcuLi9jb21tb24vbW9kZWxzL2RhdGUubW9kZWwnO1xuaW1wb3J0IHtEb21IZWxwZXJ9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy9kb20tYXBwZW5kZXIvZG9tLWFwcGVuZGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtVdGlsc1NlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7Q2FsZW5kYXJNb2RlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItbW9kZSc7XG5pbXBvcnQge0VDYWxlbmRhck1vZGV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci1tb2RlLWVudW0nO1xuaW1wb3J0IHtDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtFQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLXZhbHVlLWVudW0nO1xuaW1wb3J0IHtTaW5nbGVDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2luZ2xlLWNhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7SURheUNhbGVuZGFyQ29uZmlnfSBmcm9tICcuLi9kYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0RheUNhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuLi9kYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge0RheUNhbGVuZGFyU2VydmljZX0gZnJvbSAnLi4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci5zZXJ2aWNlJztcbmltcG9ydCB7SURheVRpbWVDYWxlbmRhckNvbmZpZ30gZnJvbSAnLi4vZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXItY29uZmlnLm1vZGVsJztcbmltcG9ydCB7RGF5VGltZUNhbGVuZGFyU2VydmljZX0gZnJvbSAnLi4vZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQge0lUaW1lU2VsZWN0Q29uZmlnfSBmcm9tICcuLi90aW1lLXNlbGVjdC90aW1lLXNlbGVjdC1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtUaW1lU2VsZWN0Q29tcG9uZW50fSBmcm9tICcuLi90aW1lLXNlbGVjdC90aW1lLXNlbGVjdC5jb21wb25lbnQnO1xuaW1wb3J0IHtUaW1lU2VsZWN0U2VydmljZX0gZnJvbSAnLi4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3Quc2VydmljZSc7XG5pbXBvcnQge0lEYXRlUGlja2VyQ29uZmlnLCBJRGF0ZVBpY2tlckNvbmZpZ0ludGVybmFsfSBmcm9tICcuL2RhdGUtcGlja2VyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0lEcERheVBpY2tlckFwaX0gZnJvbSAnLi9kYXRlLXBpY2tlci5hcGknO1xuaW1wb3J0IHtEYXRlUGlja2VyU2VydmljZX0gZnJvbSAnLi9kYXRlLXBpY2tlci5zZXJ2aWNlJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtQ29udHJvbCxcbiAgTkdfVkFMSURBVE9SUyxcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG4gIFZhbGlkYXRvclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge01vbWVudCwgdW5pdE9mVGltZX0gZnJvbSAnbW9tZW50JztcbmltcG9ydCB7RGF0ZVZhbGlkYXRvcn0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3ZhbGlkYXRvci50eXBlJztcbmltcG9ydCB7TW9udGhDYWxlbmRhckNvbXBvbmVudH0gZnJvbSAnLi4vbW9udGgtY2FsZW5kYXIvbW9udGgtY2FsZW5kYXIuY29tcG9uZW50JztcbmltcG9ydCB7RGF5VGltZUNhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuLi9kYXktdGltZS1jYWxlbmRhci9kYXktdGltZS1jYWxlbmRhci5jb21wb25lbnQnO1xuaW1wb3J0IHtJTmF2RXZlbnR9IGZyb20gJy4uL2NvbW1vbi9tb2RlbHMvbmF2aWdhdGlvbi1ldmVudC5tb2RlbCc7XG5pbXBvcnQge1NlbGVjdEV2ZW50fSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2VsZWN0aW9uLWV2ZXQuZW51bS4nO1xuaW1wb3J0IHtJU2VsZWN0aW9uRXZlbnR9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9zZWxlY3Rpb24tZXZldC5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RwLWRhdGUtcGlja2VyJyxcbiAgdGVtcGxhdGVVcmw6ICdkYXRlLXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXRlLXBpY2tlci5jb21wb25lbnQubGVzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGF0ZVBpY2tlclNlcnZpY2UsXG4gICAgRGF5VGltZUNhbGVuZGFyU2VydmljZSxcbiAgICBEYXlDYWxlbmRhclNlcnZpY2UsXG4gICAgVGltZVNlbGVjdFNlcnZpY2UsXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUGlja2VyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZVBpY2tlckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPbkluaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFmdGVyVmlld0luaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWYWxpZGF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9uRGVzdHJveSB7XG5cbiAgZ2V0IG9wZW5PbkZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudENvbmZpZy5vcGVuT25Gb2N1cztcbiAgfVxuXG4gIGdldCBvcGVuT25DbGljaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRDb25maWcub3Blbk9uQ2xpY2s7XG4gIH1cblxuICBnZXQgYXJlQ2FsZW5kYXJzU2hvd24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FyZUNhbGVuZGFyc1Nob3duO1xuICB9XG5cbiAgc2V0IGFyZUNhbGVuZGFyc1Nob3duKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnN0YXJ0R2xvYmFsTGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLmRvbUhlbHBlci5hcHBlbmRFbGVtZW50VG9Qb3NpdGlvbih7XG4gICAgICAgIGNvbnRhaW5lcjogdGhpcy5hcHBlbmRUb0VsZW1lbnQsXG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuY2FsZW5kYXJXcmFwcGVyLFxuICAgICAgICBhbmNob3I6IHRoaXMuaW5wdXRFbGVtZW50Q29udGFpbmVyLFxuICAgICAgICBkaW1FbGVtOiB0aGlzLnBvcHVwRWxlbSxcbiAgICAgICAgZHJvcHM6IHRoaXMuY29tcG9uZW50Q29uZmlnLmRyb3BzLFxuICAgICAgICBvcGVuczogdGhpcy5jb21wb25lbnRDb25maWcub3BlbnNcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3BHbG9iYWxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuZGF5UGlja2VyU2VydmljZS5waWNrZXJDbG9zZWQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hcmVDYWxlbmRhcnNTaG93biA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGVkKCk6IE1vbWVudFtdIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cblxuICBzZXQgc2VsZWN0ZWQoc2VsZWN0ZWQ6IE1vbWVudFtdKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICB0aGlzLmlucHV0RWxlbWVudFZhbHVlID0gKDxzdHJpbmdbXT50aGlzLnV0aWxzU2VydmljZVxuICAgICAgLmNvbnZlcnRGcm9tTW9tZW50QXJyYXkodGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LCBzZWxlY3RlZCwgRUNhbGVuZGFyVmFsdWUuU3RyaW5nQXJyKSlcbiAgICAgIC5qb2luKCcgfCAnKTtcbiAgICBjb25zdCB2YWwgPSB0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHNlbGVjdGVkKTtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodmFsLCBmYWxzZSk7XG4gICAgdGhpcy5vbkNoYW5nZS5lbWl0KHZhbCk7XG4gIH1cblxuICBnZXQgY3VycmVudERhdGVWaWV3KCk6IE1vbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnREYXRlVmlldztcbiAgfVxuXG4gIHNldCBjdXJyZW50RGF0ZVZpZXcoZGF0ZTogTW9tZW50KSB7XG4gICAgdGhpcy5fY3VycmVudERhdGVWaWV3ID0gZGF0ZTtcblxuICAgIGlmICh0aGlzLmRheUNhbGVuZGFyUmVmKSB7XG4gICAgICB0aGlzLmRheUNhbGVuZGFyUmVmLm1vdmVDYWxlbmRhclRvKGRhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vbnRoQ2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMubW9udGhDYWxlbmRhclJlZi5tb3ZlQ2FsZW5kYXJUbyhkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kYXlUaW1lQ2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMuZGF5VGltZUNhbGVuZGFyUmVmLm1vdmVDYWxlbmRhclRvKGRhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGlzSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgY29uZmlnOiBJRGF0ZVBpY2tlckNvbmZpZztcbiAgQElucHV0KCkgbW9kZTogQ2FsZW5kYXJNb2RlID0gJ2RheSc7XG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnJztcbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgZGlzcGxheURhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBASW5wdXQoKSB0aGVtZTogc3RyaW5nO1xuICBASW5wdXQoKSBtaW5EYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtYXhEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtaW5UaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtYXhUaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBAT3V0cHV0KCkgb3BlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIGNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENhbGVuZGFyVmFsdWU+KCk7XG4gIEBPdXRwdXQoKSBvbkdvVG9DdXJyZW50OiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkxlZnROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25SaWdodE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblNlbGVjdDogRXZlbnRFbWl0dGVyPElTZWxlY3Rpb25FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHtzdGF0aWM6IGZhbHNlfSkgY2FsZW5kYXJDb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2RheUNhbGVuZGFyJywge3N0YXRpYzogZmFsc2V9KSBkYXlDYWxlbmRhclJlZjogRGF5Q2FsZW5kYXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ21vbnRoQ2FsZW5kYXInLCB7c3RhdGljOiBmYWxzZX0pIG1vbnRoQ2FsZW5kYXJSZWY6IE1vbnRoQ2FsZW5kYXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2RheXRpbWVDYWxlbmRhcicsIHtzdGF0aWM6IGZhbHNlfSkgZGF5VGltZUNhbGVuZGFyUmVmOiBEYXlUaW1lQ2FsZW5kYXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ3RpbWVTZWxlY3QnLCB7c3RhdGljOiBmYWxzZX0pIHRpbWVTZWxlY3RSZWY6IFRpbWVTZWxlY3RDb21wb25lbnQ7XG4gIGNvbXBvbmVudENvbmZpZzogSURhdGVQaWNrZXJDb25maWdJbnRlcm5hbDtcbiAgZGF5Q2FsZW5kYXJDb25maWc6IElEYXlDYWxlbmRhckNvbmZpZztcbiAgZGF5VGltZUNhbGVuZGFyQ29uZmlnOiBJRGF5VGltZUNhbGVuZGFyQ29uZmlnO1xuICB0aW1lU2VsZWN0Q29uZmlnOiBJVGltZVNlbGVjdENvbmZpZztcbiAgaGlkZVN0YXRlSGVscGVyOiBib29sZWFuID0gZmFsc2U7XG4gIGlucHV0VmFsdWU6IENhbGVuZGFyVmFsdWU7XG4gIGlzRm9jdXNlZFRyaWdnZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgaW5wdXRFbGVtZW50VmFsdWU6IHN0cmluZztcbiAgY2FsZW5kYXJXcmFwcGVyOiBIVE1MRWxlbWVudDtcbiAgYXBwZW5kVG9FbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgaW5wdXRFbGVtZW50Q29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcG9wdXBFbGVtOiBIVE1MRWxlbWVudDtcbiAgaGFuZGxlSW5uZXJFbGVtZW50Q2xpY2tVbmxpc3RlbmVyczogRnVuY3Rpb25bXSA9IFtdO1xuICBnbG9iYWxMaXN0ZW5lcnNVbmxpc3RlbmVyczogRnVuY3Rpb25bXSA9IFtdO1xuICB2YWxpZGF0ZUZuOiBEYXRlVmFsaWRhdG9yO1xuICBhcGk6IElEcERheVBpY2tlckFwaSA9IHtcbiAgICBvcGVuOiB0aGlzLnNob3dDYWxlbmRhcnMuYmluZCh0aGlzKSxcbiAgICBjbG9zZTogdGhpcy5oaWRlQ2FsZW5kYXIuYmluZCh0aGlzKSxcbiAgICBtb3ZlQ2FsZW5kYXJUbzogdGhpcy5tb3ZlQ2FsZW5kYXJUby5iaW5kKHRoaXMpXG4gIH07XG4gIHNlbGVjdEV2ZW50ID0gU2VsZWN0RXZlbnQ7XG5cbiAgX2FyZUNhbGVuZGFyc1Nob3duOiBib29sZWFuID0gZmFsc2U7XG5cbiAgX3NlbGVjdGVkOiBNb21lbnRbXSA9IFtdO1xuXG4gIF9jdXJyZW50RGF0ZVZpZXc6IE1vbWVudDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGRheVBpY2tlclNlcnZpY2U6IERhdGVQaWNrZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGRvbUhlbHBlcjogRG9tSGVscGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGVsZW1SZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSB1dGlsc1NlcnZpY2U6IFV0aWxzU2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICBvbkNsaWNrKCkge1xuICAgIGlmICghdGhpcy5vcGVuT25DbGljaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc0ZvY3VzZWRUcmlnZ2VyICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmhpZGVTdGF0ZUhlbHBlciA9IHRydWU7XG4gICAgICBpZiAoIXRoaXMuYXJlQ2FsZW5kYXJzU2hvd24pIHtcbiAgICAgICAgdGhpcy5zaG93Q2FsZW5kYXJzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25Cb2R5Q2xpY2soKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50Q29uZmlnLmhpZGVPbk91dHNpZGVDbGljaykge1xuICAgICAgaWYgKCF0aGlzLmhpZGVTdGF0ZUhlbHBlciAmJiB0aGlzLmFyZUNhbGVuZGFyc1Nob3duKSB7XG4gICAgICAgIHRoaXMuaGlkZUNhbGVuZGFyKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIG9uU2Nyb2xsKCkge1xuICAgIGlmICh0aGlzLmFyZUNhbGVuZGFyc1Nob3duKSB7XG4gICAgICB0aGlzLmRvbUhlbHBlci5zZXRFbGVtZW50UG9zaXRpb24oe1xuICAgICAgICBjb250YWluZXI6IHRoaXMuYXBwZW5kVG9FbGVtZW50LFxuICAgICAgICBlbGVtZW50OiB0aGlzLmNhbGVuZGFyV3JhcHBlcixcbiAgICAgICAgYW5jaG9yOiB0aGlzLmlucHV0RWxlbWVudENvbnRhaW5lcixcbiAgICAgICAgZGltRWxlbTogdGhpcy5wb3B1cEVsZW0sXG4gICAgICAgIGRyb3BzOiB0aGlzLmNvbXBvbmVudENvbmZpZy5kcm9wcyxcbiAgICAgICAgb3BlbnM6IHRoaXMuY29tcG9uZW50Q29uZmlnLm9wZW5zXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBDYWxlbmRhclZhbHVlKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmNvbnZlcnRUb01vbWVudEFycmF5KHZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIG9uQ2hhbmdlQ2FsbGJhY2soXzogYW55LCBjaGFuZ2VkQnlJbnB1dDogYm9vbGVhbikge1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIG9uVG91Y2hlZENhbGxiYWNrKCkge1xuICB9XG5cbiAgdmFsaWRhdGUoZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdGVGbihmb3JtQ29udHJvbC52YWx1ZSk7XG4gIH1cblxuICBwcm9jZXNzT25DaGFuZ2VDYWxsYmFjayhzZWxlY3RlZDogTW9tZW50W10gfCBzdHJpbmcpOiBDYWxlbmRhclZhbHVlIHtcbiAgICBpZiAodHlwZW9mIHNlbGVjdGVkID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHNlbGVjdGVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydEZyb21Nb21lbnRBcnJheShcbiAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgICBzZWxlY3RlZCxcbiAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcucmV0dXJuZWRWYWx1ZVR5cGUgfHwgdGhpcy51dGlsc1NlcnZpY2UuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaW5pdFZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0ZUZuID0gdGhpcy51dGlsc1NlcnZpY2UuY3JlYXRlVmFsaWRhdG9yKFxuICAgICAge1xuICAgICAgICBtaW5EYXRlOiB0aGlzLm1pbkRhdGUsXG4gICAgICAgIG1heERhdGU6IHRoaXMubWF4RGF0ZSxcbiAgICAgICAgbWluVGltZTogdGhpcy5taW5UaW1lLFxuICAgICAgICBtYXhUaW1lOiB0aGlzLm1heFRpbWVcbiAgICAgIH0sIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCwgdGhpcy5tb2RlKTtcblxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWQpLCBmYWxzZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluRG9tKCk7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc2V0RWxlbWVudFBvc2l0aW9uSW5Eb20oKTogdm9pZCB7XG4gICAgdGhpcy5jYWxlbmRhcldyYXBwZXIgPSA8SFRNTEVsZW1lbnQ+dGhpcy5jYWxlbmRhckNvbnRhaW5lci5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuc2V0SW5wdXRFbGVtZW50Q29udGFpbmVyKCk7XG4gICAgdGhpcy5wb3B1cEVsZW0gPSB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHAtcG9wdXAnKTtcbiAgICB0aGlzLmhhbmRsZUlubmVyRWxlbWVudENsaWNrKHRoaXMucG9wdXBFbGVtKTtcblxuICAgIGNvbnN0IHthcHBlbmRUb30gPSB0aGlzLmNvbXBvbmVudENvbmZpZztcbiAgICBpZiAoYXBwZW5kVG8pIHtcbiAgICAgIGlmICh0eXBlb2YgYXBwZW5kVG8gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kVG9FbGVtZW50ID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoPHN0cmluZz5hcHBlbmRUbyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFwcGVuZFRvRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hcHBlbmRUbztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hcHBlbmRUb0VsZW1lbnQgPSB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGVuZFRvRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNhbGVuZGFyV3JhcHBlcik7XG4gIH1cblxuICBzZXRJbnB1dEVsZW1lbnRDb250YWluZXIoKSB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnRDb250YWluZXIgPSB0aGlzLnV0aWxzU2VydmljZS5nZXROYXRpdmVFbGVtZW50KHRoaXMuY29tcG9uZW50Q29uZmlnLmlucHV0RWxlbWVudENvbnRhaW5lcilcbiAgICAgIHx8IHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcC1pbnB1dC1jb250YWluZXInKVxuICAgICAgfHwgZG9jdW1lbnQuYm9keTtcbiAgfVxuXG4gIGhhbmRsZUlubmVyRWxlbWVudENsaWNrKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5oYW5kbGVJbm5lckVsZW1lbnRDbGlja1VubGlzdGVuZXJzLnB1c2goXG4gICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbihlbGVtZW50LCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gdHJ1ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jb21wb25lbnRDb25maWcgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuZ2V0Q29uZmlnKHRoaXMuY29uZmlnLCB0aGlzLm1vZGUpO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5kaXNwbGF5RGF0ZVxuICAgICAgPyB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0VG9Nb21lbnQodGhpcy5kaXNwbGF5RGF0ZSwgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KS5jbG9uZSgpXG4gICAgICA6IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5nZXREZWZhdWx0RGlzcGxheURhdGUoXG4gICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcsXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCxcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0LFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLm1pblxuICAgICAgICApO1xuICAgIHRoaXMuZGF5Q2FsZW5kYXJDb25maWcgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuZ2V0RGF5Q29uZmlnU2VydmljZSh0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgdGhpcy5kYXlUaW1lQ2FsZW5kYXJDb25maWcgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuZ2V0RGF5VGltZUNvbmZpZ1NlcnZpY2UodGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgIHRoaXMudGltZVNlbGVjdENvbmZpZyA9IHRoaXMuZGF5UGlja2VyU2VydmljZS5nZXRUaW1lQ29uZmlnU2VydmljZSh0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgdGhpcy5pbml0VmFsaWRhdG9ycygpO1xuICB9XG5cbiAgaW5wdXRGb2N1c2VkKCkge1xuICAgIGlmICghdGhpcy5vcGVuT25Gb2N1cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaXNGb2N1c2VkVHJpZ2dlciA9IHRydWU7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuYXJlQ2FsZW5kYXJzU2hvd24pIHtcbiAgICAgICAgdGhpcy5zaG93Q2FsZW5kYXJzKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuaXNGb2N1c2VkVHJpZ2dlciA9IGZhbHNlO1xuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9LCB0aGlzLmNvbXBvbmVudENvbmZpZy5vbk9wZW5EZWxheSk7XG4gIH1cblxuICBpbnB1dEJsdXJyZWQoKSB7XG4gICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjaygpO1xuICB9XG5cbiAgc2hvd0NhbGVuZGFycygpIHtcbiAgICB0aGlzLmhpZGVTdGF0ZUhlbHBlciA9IHRydWU7XG4gICAgdGhpcy5hcmVDYWxlbmRhcnNTaG93biA9IHRydWU7XG5cbiAgICBpZiAodGhpcy50aW1lU2VsZWN0UmVmKSB7XG4gICAgICB0aGlzLnRpbWVTZWxlY3RSZWYuYXBpLnRyaWdnZXJDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLm9wZW4uZW1pdCgpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBoaWRlQ2FsZW5kYXIoKSB7XG4gICAgdGhpcy5hcmVDYWxlbmRhcnNTaG93biA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuZGF5Q2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMuZGF5Q2FsZW5kYXJSZWYuYXBpLnRvZ2dsZUNhbGVuZGFyTW9kZShFQ2FsZW5kYXJNb2RlLkRheSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZS5lbWl0KCk7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG9uVmlld0RhdGVDaGFuZ2UodmFsdWU6IENhbGVuZGFyVmFsdWUpIHtcbiAgICBjb25zdCBzdHJWYWwgPSB2YWx1ZSA/IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb1N0cmluZyh2YWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KSA6ICcnO1xuICAgIGlmICh0aGlzLmRheVBpY2tlclNlcnZpY2UuaXNWYWxpZElucHV0RGF0ZVZhbHVlKHN0clZhbCwgdGhpcy5jb21wb25lbnRDb25maWcpKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5kYXlQaWNrZXJTZXJ2aWNlLmNvbnZlcnRJbnB1dFZhbHVlVG9Nb21lbnRBcnJheShzdHJWYWwsIHRoaXMuY29tcG9uZW50Q29uZmlnKTtcbiAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5zZWxlY3RlZC5sZW5ndGhcbiAgICAgICAgPyB0aGlzLnV0aWxzU2VydmljZS5nZXREZWZhdWx0RGlzcGxheURhdGUoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkLFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWluXG4gICAgICAgIClcbiAgICAgICAgOiB0aGlzLmN1cnJlbnREYXRlVmlldztcblxuICAgICAgdGhpcy5vblNlbGVjdC5lbWl0KHtcbiAgICAgICAgZGF0ZTogc3RyVmFsLFxuICAgICAgICB0eXBlOiBTZWxlY3RFdmVudC5JTlBVVCxcbiAgICAgICAgZ3JhbnVsYXJpdHk6IG51bGxcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmdldFZhbGlkTW9tZW50QXJyYXkoc3RyVmFsLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpO1xuICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2soc3RyVmFsKSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgZGF0ZVNlbGVjdGVkKGRhdGU6IElEYXRlLCBncmFudWxhcml0eTogdW5pdE9mVGltZS5CYXNlLCB0eXBlOiBTZWxlY3RFdmVudCwgaWdub3JlQ2xvc2U/OiBib29sZWFuKSB7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAudXBkYXRlU2VsZWN0ZWQodGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCwgdGhpcy5zZWxlY3RlZCwgZGF0ZSwgZ3JhbnVsYXJpdHkpO1xuICAgIGlmICghaWdub3JlQ2xvc2UpIHtcbiAgICAgIHRoaXMub25EYXRlQ2xpY2soKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uU2VsZWN0LmVtaXQoe1xuICAgICAgZGF0ZTogZGF0ZS5kYXRlLFxuICAgICAgZ3JhbnVsYXJpdHksXG4gICAgICB0eXBlXG4gICAgfSk7XG4gIH1cblxuICBvbkRhdGVDbGljaygpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRDb25maWcuY2xvc2VPblNlbGVjdCkge1xuICAgICAgc2V0VGltZW91dCh0aGlzLmhpZGVDYWxlbmRhci5iaW5kKHRoaXMpLCB0aGlzLmNvbXBvbmVudENvbmZpZy5jbG9zZU9uU2VsZWN0RGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIG9uS2V5UHJlc3MoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgKDkpOlxuICAgICAgY2FzZSAoMjcpOlxuICAgICAgICB0aGlzLmhpZGVDYWxlbmRhcigpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBtb3ZlQ2FsZW5kYXJUbyhkYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgY29uc3QgbW9tZW50RGF0ZSA9IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb01vbWVudChkYXRlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gbW9tZW50RGF0ZTtcbiAgfVxuXG4gIG9uTGVmdE5hdkNsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vbkxlZnROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgb25SaWdodE5hdkNsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIHN0YXJ0R2xvYmFsTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuZ2xvYmFsTGlzdGVuZXJzVW5saXN0ZW5lcnMucHVzaChcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50LCAna2V5ZG93bicsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMub25LZXlQcmVzcyhlKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnQsICdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMub25TY3JvbGwoKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnQsICdjbGljaycsICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkJvZHlDbGljaygpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgc3RvcEdsb2JhbExpc3RlbmVycygpIHtcbiAgICB0aGlzLmdsb2JhbExpc3RlbmVyc1VubGlzdGVuZXJzLmZvckVhY2goKHVsKSA9PiB1bCgpKTtcbiAgICB0aGlzLmdsb2JhbExpc3RlbmVyc1VubGlzdGVuZXJzID0gW107XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmhhbmRsZUlubmVyRWxlbWVudENsaWNrVW5saXN0ZW5lcnMuZm9yRWFjaCh1bCA9PiB1bCgpKTtcblxuICAgIGlmICh0aGlzLmFwcGVuZFRvRWxlbWVudCkge1xuICAgICAgdGhpcy5hcHBlbmRUb0VsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5jYWxlbmRhcldyYXBwZXIpO1xuICAgIH1cbiAgfVxufVxuIl19
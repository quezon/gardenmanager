import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import * as momentNs from 'moment';
import { UtilsService } from '../common/services/utils/utils.service';
var moment = momentNs;
var MonthCalendarService = /** @class */ (function () {
    function MonthCalendarService(utilsService) {
        this.utilsService = utilsService;
        this.DEFAULT_CONFIG = {
            allowMultiSelect: false,
            yearFormat: 'YYYY',
            format: 'MM-YYYY',
            isNavHeaderBtnClickable: false,
            monthBtnFormat: 'MMM',
            locale: moment.locale(),
            multipleYearsNavigateBy: 10,
            showMultipleYearsNavigation: false,
            unSelectOnClick: true
        };
    }
    MonthCalendarService.prototype.getConfig = function (config) {
        var _config = tslib_1.__assign({}, this.DEFAULT_CONFIG, this.utilsService.clearUndefined(config));
        this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
        moment.locale(_config.locale);
        return _config;
    };
    MonthCalendarService.prototype.generateYear = function (config, year, selected) {
        var _this = this;
        if (selected === void 0) { selected = null; }
        var index = year.clone().startOf('year');
        return this.utilsService.createArray(3).map(function () {
            return _this.utilsService.createArray(4).map(function () {
                var date = index.clone();
                var month = {
                    date: date,
                    selected: !!selected.find(function (s) { return index.isSame(s, 'month'); }),
                    currentMonth: index.isSame(moment(), 'month'),
                    disabled: _this.isMonthDisabled(date, config),
                    text: _this.getMonthBtnText(config, date)
                };
                index.add(1, 'month');
                return month;
            });
        });
    };
    MonthCalendarService.prototype.isMonthDisabled = function (date, config) {
        if (config.min && date.isBefore(config.min, 'month')) {
            return true;
        }
        return !!(config.max && date.isAfter(config.max, 'month'));
    };
    MonthCalendarService.prototype.shouldShowLeft = function (min, currentMonthView) {
        return min ? min.isBefore(currentMonthView, 'year') : true;
    };
    MonthCalendarService.prototype.shouldShowRight = function (max, currentMonthView) {
        return max ? max.isAfter(currentMonthView, 'year') : true;
    };
    MonthCalendarService.prototype.getHeaderLabel = function (config, year) {
        if (config.yearFormatter) {
            return config.yearFormatter(year);
        }
        return year.format(config.yearFormat);
    };
    MonthCalendarService.prototype.getMonthBtnText = function (config, month) {
        if (config.monthBtnFormatter) {
            return config.monthBtnFormatter(month);
        }
        return month.format(config.monthBtnFormat);
    };
    MonthCalendarService.prototype.getMonthBtnCssClass = function (config, month) {
        if (config.monthBtnCssClassCallback) {
            return config.monthBtnCssClassCallback(month);
        }
        return '';
    };
    MonthCalendarService.ctorParameters = function () { return [
        { type: UtilsService }
    ]; };
    MonthCalendarService = tslib_1.__decorate([
        Injectable()
    ], MonthCalendarService);
    return MonthCalendarService;
}());
export { MonthCalendarService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGgtY2FsZW5kYXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbIm1vbnRoLWNhbGVuZGFyL21vbnRoLWNhbGVuZGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxLQUFLLFFBQVEsTUFBTSxRQUFRLENBQUM7QUFFbkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBSXBFLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUd4QjtJQWFFLDhCQUFvQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQVpyQyxtQkFBYyxHQUFpQztZQUN0RCxnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLHVCQUF1QixFQUFFLEtBQUs7WUFDOUIsY0FBYyxFQUFFLEtBQUs7WUFDckIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDdkIsdUJBQXVCLEVBQUUsRUFBRTtZQUMzQiwyQkFBMkIsRUFBRSxLQUFLO1lBQ2xDLGVBQWUsRUFBRSxJQUFJO1NBQ3RCLENBQUM7SUFHRixDQUFDO0lBRUQsd0NBQVMsR0FBVCxVQUFVLE1BQTRCO1FBQ3BDLElBQU0sT0FBTyxHQUFHLHFCQUNYLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUM1QyxDQUFDO1FBRUYsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlC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QixFQUFFLEtBQWE7UUFDN0QsSUFBSSxNQUFNLENBQUMsd0JBQXdCLEVBQUU7WUFDbkMsT0FBTyxNQUFNLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0M7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7O2dCQTFFaUMsWUFBWTs7SUFibkMsb0JBQW9CO1FBRGhDLFVBQVUsRUFBRTtPQUNBLG9CQUFvQixDQXdGaEM7SUFBRCwyQkFBQztDQUFBLEFBeEZELElBd0ZDO1NBeEZZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgKiBhcyBtb21lbnROcyBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtNb21lbnR9IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge1V0aWxzU2VydmljZX0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL3V0aWxzL3V0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHtJTW9udGh9IGZyb20gJy4vbW9udGgubW9kZWwnO1xuaW1wb3J0IHtJTW9udGhDYWxlbmRhckNvbmZpZywgSU1vbnRoQ2FsZW5kYXJDb25maWdJbnRlcm5hbH0gZnJvbSAnLi9tb250aC1jYWxlbmRhci1jb25maWcnO1xuXG5jb25zdCBtb21lbnQgPSBtb21lbnROcztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1vbnRoQ2FsZW5kYXJTZXJ2aWNlIHtcbiAgcmVhZG9ubHkgREVGQVVMVF9DT05GSUc6IElNb250aENhbGVuZGFyQ29uZmlnSW50ZXJuYWwgPSB7XG4gICAgYWxsb3dNdWx0aVNlbGVjdDogZmFsc2UsXG4gICAgeWVhckZvcm1hdDogJ1lZWVknLFxuICAgIGZvcm1hdDogJ01NLVlZWVknLFxuICAgIGlzTmF2SGVhZGVyQnRuQ2xpY2thYmxlOiBmYWxzZSxcbiAgICBtb250aEJ0bkZvcm1hdDogJ01NTScsXG4gICAgbG9jYWxlOiBtb21lbnQubG9jYWxlKCksXG4gICAgbXVsdGlwbGVZZWFyc05hdmlnYXRlQnk6IDEwLFxuICAgIHNob3dNdWx0aXBsZVllYXJzTmF2aWdhdGlvbjogZmFsc2UsXG4gICAgdW5TZWxlY3RPbkNsaWNrOiB0cnVlXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB1dGlsc1NlcnZpY2U6IFV0aWxzU2VydmljZSkge1xuICB9XG5cbiAgZ2V0Q29uZmlnKGNvbmZpZzogSU1vbnRoQ2FsZW5kYXJDb25maWcpOiBJTW9udGhDYWxlbmRhckNvbmZpZ0ludGVybmFsIHtcbiAgICBjb25zdCBfY29uZmlnID0gPElNb250aENhbGVuZGFyQ29uZmlnSW50ZXJuYWw+e1xuICAgICAgLi4udGhpcy5ERUZBVUxUX0NPTkZJRyxcbiAgICAgIC4uLnRoaXMudXRpbHNTZXJ2aWNlLmNsZWFyVW5kZWZpbmVkKGNvbmZpZylcbiAgICB9O1xuXG4gICAgdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFByb3BzVG9Nb21lbnQoX2NvbmZpZywgX2NvbmZpZy5mb3JtYXQsIFsnbWluJywgJ21heCddKTtcbiAgICBtb21lbnQubG9jYWxlKF9jb25maWcubG9jYWxlKTtcblxuICAgIHJldHVybiBfY29uZmlnO1xuICB9XG5cbiAgZ2VuZXJhdGVZZWFyKGNvbmZpZzogSU1vbnRoQ2FsZW5kYXJDb25maWcsIHllYXI6IE1vbWVudCwgc2VsZWN0ZWQ6IE1vbWVudFtdID0gbnVsbCk6IElNb250aFtdW10ge1xuICAgIGNvbnN0IGluZGV4ID0geWVhci5jbG9uZSgpLnN0YXJ0T2YoJ3llYXInKTtcblxuICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5jcmVhdGVBcnJheSgzKS5tYXAoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLmNyZWF0ZUFycmF5KDQpLm1hcCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBpbmRleC5jbG9uZSgpO1xuICAgICAgICBjb25zdCBtb250aCA9IHtcbiAgICAgICAgICBkYXRlLFxuICAgICAgICAgIHNlbGVjdGVkOiAhIXNlbGVjdGVkLmZpbmQocyA9PiBpbmRleC5pc1NhbWUocywgJ21vbnRoJykpLFxuICAgICAgICAgIGN1cnJlbnRNb250aDogaW5kZXguaXNTYW1lKG1vbWVudCgpLCAnbW9udGgnKSxcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5pc01vbnRoRGlzYWJsZWQoZGF0ZSwgY29uZmlnKSxcbiAgICAgICAgICB0ZXh0OiB0aGlzLmdldE1vbnRoQnRuVGV4dChjb25maWcsIGRhdGUpXG4gICAgICAgIH07XG5cbiAgICAgICAgaW5kZXguYWRkKDEsICdtb250aCcpO1xuXG4gICAgICAgIHJldHVybiBtb250aDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaXNNb250aERpc2FibGVkKGRhdGU6IE1vbWVudCwgY29uZmlnOiBJTW9udGhDYWxlbmRhckNvbmZpZykge1xuICAgIGlmIChjb25maWcubWluICYmIGRhdGUuaXNCZWZvcmUoY29uZmlnLm1pbiwgJ21vbnRoJykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAhIShjb25maWcubWF4ICYmIGRhdGUuaXNBZnRlcihjb25maWcubWF4LCAnbW9udGgnKSk7XG4gIH1cblxuICBzaG91bGRTaG93TGVmdChtaW46IE1vbWVudCwgY3VycmVudE1vbnRoVmlldzogTW9tZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG1pbiA/IG1pbi5pc0JlZm9yZShjdXJyZW50TW9udGhWaWV3LCAneWVhcicpIDogdHJ1ZTtcbiAgfVxuXG4gIHNob3VsZFNob3dSaWdodChtYXg6IE1vbWVudCwgY3VycmVudE1vbnRoVmlldzogTW9tZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG1heCA/IG1heC5pc0FmdGVyKGN1cnJlbnRNb250aFZpZXcsICd5ZWFyJykgOiB0cnVlO1xuICB9XG5cbiAgZ2V0SGVhZGVyTGFiZWwoY29uZmlnOiBJTW9udGhDYWxlbmRhckNvbmZpZywgeWVhcjogTW9tZW50KTogc3RyaW5nIHtcbiAgICBpZiAoY29uZmlnLnllYXJGb3JtYXR0ZXIpIHtcbiAgICAgIHJldHVybiBjb25maWcueWVhckZvcm1hdHRlcih5ZWFyKTtcbiAgICB9XG5cbiAgICByZXR1cm4geWVhci5mb3JtYXQoY29uZmlnLnllYXJGb3JtYXQpO1xuICB9XG5cbiAgZ2V0TW9udGhCdG5UZXh0KGNvbmZpZzogSU1vbnRoQ2FsZW5kYXJDb25maWcsIG1vbnRoOiBNb21lbnQpOiBzdHJpbmcge1xuICAgIGlmIChjb25maWcubW9udGhCdG5Gb3JtYXR0ZXIpIHtcbiAgICAgIHJldHVybiBjb25maWcubW9udGhCdG5Gb3JtYXR0ZXIobW9udGgpO1xuICAgIH1cblxuICAgIHJldHVybiBtb250aC5mb3JtYXQoY29uZmlnLm1vbnRoQnRuRm9ybWF0KTtcbiAgfVxuXG4gIGdldE1vbnRoQnRuQ3NzQ2xhc3MoY29uZmlnOiBJTW9udGhDYWxlbmRhckNvbmZpZywgbW9udGg6IE1vbWVudCk6IHN0cmluZyB7XG4gICAgaWYgKGNvbmZpZy5tb250aEJ0bkNzc0NsYXNzQ2FsbGJhY2spIHtcbiAgICAgIHJldHVybiBjb25maWcubW9udGhCdG5Dc3NDbGFzc0NhbGxiYWNrKG1vbnRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cbiJdfQ==
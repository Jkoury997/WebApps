Date.prototype.getWeek = function() {
    const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    const pastDaysOfYear = (this - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

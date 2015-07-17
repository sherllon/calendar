var CalendarTime = function(time) {
	
	this.absoluteTime = time;
	
	this.intenationalTime = Math.floor(time/60); 
	this.amPm = this.intenationalTime>=12 ? "PM" : "AM";
	
	this.hour = Math.floor(time/60)%12;
	
	if(this.hour===0) {
		this.hour = 12;
	}
	
	this.minutes = time%60;
	
};

CalendarTime.prototype.isBetween = function(startTime, endTime) {
	
	return this.absoluteTime >= startTime.absoluteTime && this.absoluteTime <= endTime.absoluteTime;
	
};

CalendarTime.prototype.toString = function(showPeriodOfDay) {
	var hourString = this.hour+":"+("0" + this.minutes).slice(-2);
	
	if(this.minutes===0 || showPeriodOfDay) {
		hourString += " "+this.amPm;
	}
	
	return hourString;

};

CalendarTime.prototype.toHTMLTitle = function() {
	var hourString = this.hour+":"+("0" + this.minutes).slice(-2);
	
	if(this.minutes===0) {
		hourString += " <span class='calendar_periodOfDay'>"+this.amPm+"</span>";
	}
	
	return hourString;

};
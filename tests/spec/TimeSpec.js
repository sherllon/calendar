describe("CalendarTime", function() {
	var calendar;

	beforeEach(function() {
		
	});

	it("verifies that time in minutes is transformed correclty - hour", function() {
		var time = new CalendarTime(600);
		expect(time.hour).toEqual(10);
	});
	
	it("verifies that time in minutes is transformed correclty - minutes", function() {
		var time = new CalendarTime(615);
		expect(time.minutes).toEqual(15);
	});
	
	it("verifies that time period is correct ", function() {
		var timeInMorning = new CalendarTime(615),
			timeInAfternoon = new CalendarTime(915),
			noon = new CalendarTime(720);
		
		expect(timeInMorning.amPm).toEqual("AM");
		expect(timeInAfternoon.amPm).toEqual("PM");
		expect(noon.amPm).toEqual("PM");
		
	});
	
	it("verifies that time is between two others ", function() {
		var timeInMorning = new CalendarTime(615),
			timeInAfternoon = new CalendarTime(915),
			noon = new CalendarTime(720);
		
		expect(timeInMorning.isBetween(timeInAfternoon, noon)).toEqual(false);
		expect(timeInAfternoon.isBetween(timeInMorning, noon)).toEqual(false);
		expect(noon.isBetween(timeInMorning, timeInAfternoon )).toEqual(true);
		
	});
	
	
});
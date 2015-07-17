describe("Calendar", function() {
	var calendar,
			event;

	beforeEach(function() {
		calendar = new Calendar();
	event = new Event({start: 30, end: 70});
	});

	it("calendar should have only one event", function() {
		calendar.addEvents([{start: 30, end: 70}]);
		expect(calendar.events.length).toEqual(1);
	});
	
	it("verifies multiple overlapping", function() {
		calendar = new Calendar([ {start: 0, end: 60}, {start: 30, end: 90}, {start: 70, end: 110}, {start: 80, end: 170} ]);
		calendar._calculateOverlapsOnEvents();
		expect(calendar.events[0].sharesWidthWith).toEqual(2);
		expect(calendar.events[1].sharesWidthWith).toEqual(2);
		expect(calendar.events[2].sharesWidthWith).toEqual(2);
		expect(calendar.events[3].sharesWidthWith).toEqual(2);
	});

	it("verifies positioning of overlapping events", function() {
		calendar = new Calendar([ {start: 0, end: 60}, {start: 30, end: 90}, {start: 70, end: 110}, {start: 80, end: 170} ]);
		calendar._calculateOverlapsOnEvents();
		expect(calendar.events[0].position).toEqual(1);
		expect(calendar.events[1].position).toEqual(2);
		expect(calendar.events[2].position).toEqual(3);
		expect(calendar.events[3].position).toEqual(1);
	});
	
});
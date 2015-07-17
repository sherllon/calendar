describe("Event", function() {
	var event;

	beforeEach(function() {
		event = new Event({start: 30, end: 70});
	});

	it("verifies that two events overlap each other", function() {
		var sibling = new Event({start: 50, end: 80});
		
		expect(event.isOverlapping(sibling)).toEqual(true);
	});
	
	it("verifies that two events overlap each other when one is included", function() {
		var sibling = new Event({start: 40, end: 50});
		
		expect(event.isOverlapping(sibling)).toEqual(true);
	});
	
	it("verifies that two events dont overlap each other", function() {
		var sibling = new Event({start: 80, end: 90});
		
		expect(event.isOverlapping(sibling)).toEqual(false);
	});
	
	it("verifies that positioning is set accordingly", function() {
		var parent = new Event({start: 60, end: 90}),
			grandParent = new Event({start: 65, end: 95});
		
		grandParent.position = 1;
		parent.eventWhogeneratedPosition = grandParent;
		parent.position = 2;
		event.eventWhogeneratedPosition = parent;
		
		expect(event.getAvailablePosition()).toEqual(3);
	});
	
	it("verifies that positioning for multiple overlaps is set accordingly", function() {
		var parent = new Event({start: 60, end: 110}),
			grandParent = new Event({start: 0, end: 160}),
		superPa =	new Event({start: 100, end: 180});
		
		grandParent.position = 1;
		parent.eventWhogeneratedPosition = superPa;
		event.position = 2;
		event.eventWhogeneratedPosition = grandParent;
		superPa.position = 3;
		superPa.eventWhogeneratedPosition = grandParent;
		grandParent.generatedPositionOf.push(superPa);
		grandParent.generatedPositionOf.push(event);
		
		expect(parent.getAvailablePosition()).toEqual(4);
	});
	
	
});
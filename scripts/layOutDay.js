
function layOutDay(events) {
	var errorDiv = document.getElementById("calendar_errors"),
		calendarDiv = document.getElementById("calendar"),
		calendarClazz = document.createAttribute("class");
	
	calendarClazz.value = "";
	calendarDiv.setAttributeNode(calendarClazz);
	
	errorDiv.innerHTML = "";
	
	try {
		
		var calendar = new Calendar();
		calendar.addEvents(events);
		
		calendar.renderYAxis(document.getElementById("calendar_yAxis"));
		var xAxis = document.getElementById("calendar_xAxis");
		calendar.renderXAxis(xAxis);
	} catch (e) {
		errorDiv.innerHTML = e.message;
		
		calendarClazz.value = "displayNone";
		calendarDiv.setAttributeNode(calendarClazz);
	}
}


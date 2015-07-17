var Calendar = function (events) {
	this.events = [];
	this.isOverlappingCalculated = false;
	
	this.addEvents = function(events) {
		var event,
			currentEventMapping;
		
		while(events.length>0) {
			currentEventMapping = events.pop();
			event = new Event(currentEventMapping);
			this.events.push(event);
		}
		
	};
	
	if(events) {
		this.addEvents(events);
	}
};

Calendar.prototype._calculateOverlapsOnEvents = function() {
	var event,
		eventToCompare,
		index,
		index2,
		auxEventsList = this.events.slice();
	
	if(this.isOverlappingCalculated) {
		return true;
	}
	
	for(index in auxEventsList) {
		if (auxEventsList.hasOwnProperty(index)) {
			event = this.events[index];
			if(!event.position) {
				event.position = 1;
			}
			
			for(index2 in auxEventsList) {
				if (auxEventsList.hasOwnProperty(index2)) {
					eventToCompare = auxEventsList[index2];
		
					if(event!==eventToCompare && !event.hasAlreadyOnFamilyList(eventToCompare)) {
		
						if(event.isOverlapping(eventToCompare)) {
							eventToCompare.eventWhogeneratedPosition = event;
							event.generatedPositionOf.push(eventToCompare);
							if(event.eventWhogeneratedPosition) {
								if(eventToCompare.isOverlapping(event.eventWhogeneratedPosition)) {
		
									eventToCompare.updatePosition();
									
								} else {
									eventToCompare.updatePosition();
								}
									
							} else if(!event.eventWhogeneratedPosition){
								
								eventToCompare.updatePosition();
								
							}
							
						} else if(!eventToCompare.position) {
							eventToCompare.position = 1;
						}
					} 
				}
			}
		}
	}
	
};

Calendar.prototype.renderYAxis = function(container) {
	var timeToDisplay,
		timeDivs = [],
		timeDiv,
		startMilitaryTime = 540,
		maximumTime = 1260, //9:00pm,
		fontSize = 12,
		createTimeDiv = function(time) {
			var div = document.createElement("div"),
				clazz = document.createAttribute("class"),
				style = document.createAttribute("style"),
				positionToDisplay;
			
			time = new CalendarTime(time);
			
			clazz.value = (time.minutes===0) ? "hour" : "halfHour";
			
			positionToDisplay = time.absoluteTime - startMilitaryTime - (fontSize/2);
			
			if(positionToDisplay>maximumTime-startMilitaryTime-fontSize) {
				positionToDisplay = maximumTime-startMilitaryTime-fontSize;
			} else if(positionToDisplay<0) {
				positionToDisplay=0;
			}
			
			style.value = "top: "+positionToDisplay+"px;";
			
			div.setAttributeNode(clazz);
			div.setAttributeNode(style);
			
			div.innerHTML = time.toHTMLTitle();
			
			return div;
			
		};
	
	container.innerHTML = "";
		
	for(timeToDisplay=startMilitaryTime; timeToDisplay<=maximumTime; timeToDisplay+=30) {
		timeDiv = createTimeDiv(timeToDisplay);
		
		timeDivs.push(timeDiv);
		container.appendChild(timeDiv);
	}
	
	
};

Calendar.prototype.renderXAxis = function(container) {
	var eventIndex;
	
	this._calculateOverlapsOnEvents();
	
	container.innerHTML = "";
	
	for(eventIndex in this.events) {
		if (this.events.hasOwnProperty(eventIndex)) {
			var event = this.events[eventIndex];
			container.appendChild(event.getEventDiv());
		}
	}
	
};



var Event = function(eventMap) {
	this._initialTime = 540; //9:00 AM
	this._removeDecorationFromWidthPercent = 1.612;
	this.start = new CalendarTime(eventMap.start+this._initialTime);
	this.end = new CalendarTime(eventMap.end+this._initialTime);
	this.elementId = "event_"+eventMap.start+"_"+eventMap.end+"_"+Math.floor((Math.random()*100)+1);
	this.eventWhogeneratedPosition = null;
	this.generatedPositionOf = [];
	this.sharesWidthWith = 0;
	this.position = 0;
	this.positionsTaken = [];
	
	if(eventMap.start>eventMap.end) {
		throw new Error("Event start time should be minor than the end time - " +
				"start: "+this.start.toString(true)+", end: "+this.end.toString(true));
	}
};
 
Event.prototype.toString = function() {
	return this.elementId;
};

Event.prototype._getTopPositionInPixels = function() {
	return this.start.absoluteTime-this._initialTime;
};

Event.prototype._getDivHeightInPixels = function() {
	return this.end.absoluteTime-this.start.absoluteTime;
};

Event.prototype._getDivWidthInPercent = function() {
	
	var quantitySharingWidth = this.sharesWidthWith+1;
	return 100/(quantitySharingWidth)-this._removeDecorationFromWidthPercent;
};

Event.prototype._getDivLeftPositionInPercent = function() {
	var quantitySharingWidth = this.sharesWidthWith+1,
		screenPosition = (100/(quantitySharingWidth))*(this.position-1);
	return screenPosition;
};

Event.prototype.isOverlapping = function(siblingEvent) {

	return this.start.isBetween(siblingEvent.start, siblingEvent.end) ||
				this.end.isBetween(siblingEvent.start, siblingEvent.end) ||
				siblingEvent.start.isBetween(this.start, this.end) ||
				siblingEvent.end.isBetween(this.start, this.end);
		
};

Event.prototype.searchTakenPositions = function(evaluateAgainst, positionsTaken, alreadyEvaluated) {
	var index;
	
	if(!positionsTaken) {
		positionsTaken = [];
	}
	
	if(!alreadyEvaluated) {
		alreadyEvaluated = [];
	}
	
	if(this.eventWhogeneratedPosition && alreadyEvaluated.indexOf(this.eventWhogeneratedPosition)<0) { 
		alreadyEvaluated.push(this.eventWhogeneratedPosition);
		this.eventWhogeneratedPosition.searchTakenPositions(evaluateAgainst, positionsTaken, alreadyEvaluated);
		
	} 

	for(index in this.generatedPositionOf) {
		if (this.generatedPositionOf.hasOwnProperty(index)) {
			if(alreadyEvaluated.indexOf(this.generatedPositionOf[index])<0) {
				alreadyEvaluated.push(this.generatedPositionOf[index]);
				this.generatedPositionOf[index].searchTakenPositions(evaluateAgainst, positionsTaken, alreadyEvaluated);
			}
		}
	}
	
	if(this !== evaluateAgainst && this.position && this.position>0 && this.isOverlapping(evaluateAgainst)) {
		positionsTaken.push(this.position);
	}
	
	return positionsTaken;
	
	
};

Event.prototype.getAvailablePosition = function() {
	var positionAvailable;
	
	this.positionsTaken = this.searchTakenPositions(this).sort(function(a,b){return a-b;});
	
	if(!this.positionsTaken) {
		return 1;
	} else {
		for(positionAvailable=1; positionAvailable<=this.positionsTaken.length+1; positionAvailable++) {
			if(this.positionsTaken.indexOf(positionAvailable)<0) {
				return positionAvailable;
			}
		}
	}
};

Event.prototype.updatePosition = function() {
	
	this.position = this.getAvailablePosition();

	this.updateChainSharesWidthQtt();
	
};

Event.prototype.getSharesWidthQttFromChain = function() {
	var probableSharesWidthQtt;
	
	if(this.positionsTaken && this.positionsTaken.length>0) {
		probableSharesWidthQtt = this.positionsTaken[this.positionsTaken.length-1]; //get biggest used position
	} else {
		probableSharesWidthQtt = this.searchTakenPositions(this).sort(function(a,b){return a-b;})[this.positionsTaken.length-1];
	}

	return (this.position && this.position > probableSharesWidthQtt) ? 
			this.position : probableSharesWidthQtt;
};

Event.prototype.updateChainSharesWidthQtt = function(maximumPosition, alreadyEvaluated) {
	var index;
	
	if(!maximumPosition) {
		maximumPosition = this.getSharesWidthQttFromChain();
	}

	if(!alreadyEvaluated) {
		alreadyEvaluated = [];
	}
	
	if(this.eventWhogeneratedPosition && alreadyEvaluated.indexOf(this.eventWhogeneratedPosition)<0) { 
		alreadyEvaluated.push(this.eventWhogeneratedPosition);
		this.eventWhogeneratedPosition.updateChainSharesWidthQtt(maximumPosition, alreadyEvaluated);
		
	} 
	
	for(index in this.generatedPositionOf) {
		if (this.generatedPositionOf.hasOwnProperty(index)) {
			if(alreadyEvaluated.indexOf(this.generatedPositionOf[index])<0) {
				alreadyEvaluated.push(this.generatedPositionOf[index]);
				this.generatedPositionOf[index].updateChainSharesWidthQtt(maximumPosition, alreadyEvaluated);
			}
		}
	}

	this.sharesWidthWith = maximumPosition-1;
	
};

Event.prototype.hasAlreadyOnFamilyList = function(event) {
	
	if(event===this.eventWhogeneratedPosition) {
		return true;
	} else if(this.eventWhogeneratedPosition) {
		return this.eventWhogeneratedPosition.hasAlreadyOnFamilyList(event);
	} else { 
		return false;
	}
	
};

Event.prototype.getEventDiv = function() {
	var div = document.createElement("div"),
		id = document.createAttribute("id"),
		eventTitle = document.createElement("h3"),
		eventLocation = document.createElement("h4"),
		eventClazz = document.createAttribute("class"),
		particularStyles = document.createAttribute("style"),
		topPosition,
		height,
		width,
		left;
	
	id.value = this.elementId;
	div.setAttributeNode(id);
	
	eventClazz.value = "event";
	div.setAttributeNode(eventClazz);
	
	topPosition = "top: "+this._getTopPositionInPixels()+"px;";
	height = "height: "+this._getDivHeightInPixels()+"px;";
	left = "left: "+this._getDivLeftPositionInPercent()+"%;";
	width = "width: "+this._getDivWidthInPercent()+"%;";
	
	particularStyles.value = topPosition + height + left + width;
	
	div.setAttributeNode(particularStyles);
	
	eventTitle.innerHTML = "Sample event";
	eventLocation.innerHTML = "Sample Location";
	
	div.appendChild(eventTitle);
	div.appendChild(eventLocation);
	
	return div;
};
	

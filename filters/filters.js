
	function init_priceText() {
		d3.select('p#value-range').text("From " + sliderRange
		  	.value()
		   	.map(d3.format('.02s'))
		   	.join(' to ')
		);
	}
	//Configues the price range text above slider only at initialization
	function init_SATtext() {
		d3.select('p#SATtext').text("From " + sliderRangeSAT
		   .value()
		   .map(d3.format('.3r'))
		   .join(' to ')
		);
	}


//Code for checkboxes:

	// update(): this gets what boxes have been checked. It sends back what boxes are checked every time a checkbox has been clicked/unclicked
	function update() {
		var choices = [];
		d3.selectAll(".myCheckbox").each(function(d){
          	cb = d3.select(this);
          	if(cb.property("checked")){
          		if (cb.property)
          			choices.push(cb.property("value"));
          		} 

          	//The line of text is for testing: makes sure the right boxes are being triggered
          	d3.select("#textline")
          		.text(choices);

        });
        return choices;
	}


define([
    "dojo/_base/declare"
], function(declare){

    return declare(null,{

        timeseries_type: null,
        toggle_on: false,

        constructor: function(options){

        },
        //Function to download a pdf report
        pickChartType: function(in_key){

            if (this.toggle_on === false) {
                this.toggle_on = true;
                const quest_dict = {
                    "question-1": "Change---Fast Loss",
                    "question-2": "Change---Slow Loss"
                };
    
                this.timeseries_type = quest_dict[in_key];
            }
            else if (this.toggle_on === true){
                this.toggle_on = false;
                this.timeseries_type = null;
            }

            // Get value of clicked button - need button first - step over to html
            // Haha, did it. Button name is "buton-1"
            // Create a question dictionary - refactoring! No if else garbagio!


        }
    })
});
define([
    "dojo/_base/declare",
    "dojo/_base/lang"
], function(declare, lang){

    return declare(null,{

        totalArea: null,
        featuresLen: null,
        fastlossStr: null,
        yearStr: null,

        constructor: function(options){
            // specify class defaults
            // this.textOutput = options.textOutput || "Default text";
            // this.changeString = options.changeString || "No output";

            // this.returnEvents = lang.hitch(this, this.returnEvents);
        },

        // Use the class properties to display a chart object in hardcoded div.
        outputChart: function(results, div_name){

            years = results.features[0].attributes["years"].split(",");
            fastLoss = results.features[0].attributes["Change---Fast Loss"].split(",").map(f => parseFloat(f));

            x = years;
            y = fastLoss;
            let trace = {
              x: x,
              y: y,
              type: 'scatter' }
            const mydata = [trace]
            Plotly.newPlot(div_name, mydata) // Wow! That worked. Ok, let's use Plotly. I like it better anyway. 
        }
    })
});
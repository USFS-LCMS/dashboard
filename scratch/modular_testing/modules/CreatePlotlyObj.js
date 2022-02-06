define([
    "dojo/_base/declare"
], function(declare){

    return declare(null,{

        outputObj: null,

        constructor: function(options){
            // specify class defaults
            // this.textOutput = options.textOutput || "Default text";
            // this.changeString = options.changeString || "No output";

        },

        // Use the class properties to display a chart object in hardcoded div.
        createOutputObj: function(results, fields){
            
            years = results.features[0].attributes["years"].split(",");

            const myData = [];
            for(f in fields){

                let trace = {
                    x: years,
                    y: results.features[0].attributes[fields[f]].split(",").map(f => parseFloat(f)),
                    type: 'scatter' };

                myData[f] = trace;
            };

            
            // fastLoss = results.features[0].attributes["Change---Fast Loss"].split(",").map(f => parseFloat(f));

            // x = years;
            // y = fastLoss;
            // let trace = {
            //   x: x,
            //   y: y,
            //   type: 'scatter' }
            // const mydata = [trace]
            
            this.outputObj = myData;

        }
    })
});
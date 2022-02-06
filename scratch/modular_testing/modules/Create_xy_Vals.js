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

        // Added parms: names
        // References the following: whichOne goes back to either change, land cover, or land use
        // var chartWhich = ['Change','Land_Cover','Land_Use'];
        setContentInfo: function(results){

            // const lineName = "Change---Fast Loss";

            this.featuresLen = results.features.length; /// This works! When clicked, returns one!

            this.totalArea = results.features[0].attributes["total_area"];//.split(",").map(n => parseFloat(n)); // When I put [0]th feature, doesn't halt process...
            
            this.fastlossStr = results.features[0].attributes["Change---Fast Loss"];

            this.yearStr = results.features[0].attributes["years"]

          }
    })
});
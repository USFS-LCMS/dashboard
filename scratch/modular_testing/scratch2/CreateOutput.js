define([
    "dojo/_base/declare",
    "dojo/_base/lang"
], function(declare, lang){

    return declare(null,{

        textOutput: null,

        constructor: function(options){
            // specify class defaults
            this.textOutput = options.textOutput || "Default text"; 

        },

        MakeOutput: function(textinput){
            this.textOutput = textinput;
            // return this.textOutput;
            // return textinput;
        }
    })
});
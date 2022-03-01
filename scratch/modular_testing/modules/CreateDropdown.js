define([
    "dojo/_base/declare"
], function(
    declare
    ){
 
    return declare(null,{

        constructor: function(options){
            
        },
           
        addDropElems: function(){
            /*
            Create html string for dropdown and insert in dropdown location in main html
            */
            // Enumerate questions here.
            const questions = [
                "Migration: What is the annual change in acres of trees and shrub communities into previously unoccupied alpine and recently deglaciated habitat?", 
                "Annual Snow Coverage: What is the rate of change in snow and ice cover (acres) over time?"
            ];

            const questLabels = [
                "Question1",
                "Question2"
            ];

            // Start html string here
            let html = `<option value="">Please Select</option>`;
            // Iterate over questions, adding them to the html string

            for (let i = 0; i < questions.length; i++){
                html += `<option value=${questLabels[i]}>${questions[i]}</option>`
            }

            const select = document.querySelector("#options-dropdown");
            // Insert the html string into dropdown location
            select.innerHTML = html;

            // Here, try and expand it out.

        }
    })
});
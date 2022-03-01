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
                "For the Migration of trees and shrubs into alpine tundra and recently deglaciated habitats: we are asking what is the annual change in acres of trees and shrub communities into previously unoccupied alpine and recently deglaciated habitat?", 
                "For annual snow coverage, we are asking what is the rate of change in snow and ice cover (acres) over time. I guess we could start at the same, ecoregion subsection level, but increase the zone coverage over time as it makes sense?"
            ];

            const questLabels = [
                "Question1",
                "Question2"
            ];

            // Start html string here
            let html = `<option value="">Please Select</option>`;
            // Iterate over questions, adding them to the html string

            for (let i = 0; i < questions.length; i++){
                html += `<option value=${questLabels[i]}>${questions[i]}`
            }

            const select = document.querySelector("#options-dropdown");
            // Insert the html string into dropdown location
            select.innerHTML = html;
        }
    })
});
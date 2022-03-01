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
            const questions = ["Q1", "Q2"];
            // Start html string here
            let html = `<option value="">Please Select</option>`;
            // Iterate over questions, adding them to the html string
            questions.forEach(quest => {
                html += `<option value=${quest}>${quest}</option>`
            });
            // select the dropdown location for manipulation
            const select = document.querySelector("#options-dropdown");
            // Insert the html string into dropdown location
            select.innerHTML = html;

        }

    })
});
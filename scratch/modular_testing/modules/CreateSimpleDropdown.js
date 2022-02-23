define([
    "dojo/_base/declare"
], function(
    declare
    ){

    return declare(null,{

        // Set output chart type to blank at outset - this will happen automatically when the object is instantiated
        out_chart_type: "",

        constructor: function(options){
            // this.thing1 = options.thing1 || "thing1"; 
            
        },
          
        addDropElems: function(){
            const questions = ["Q1", "Q2"];
            let html = `<option value="">Please Select</option>`;
            questions.forEach(quest => {
                html += `<option value=${quest}>${quest}</option>`
            });
            const select = document.querySelector("#options-dropdown");
            select.innerHTML = html;
            
        }

    })
});
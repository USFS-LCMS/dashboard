define([
    "dojo/_base/declare"
], function(declare){

    return declare(null,{

        constructor: function(options){

        },

        basicAccordion: function(){
            // Create a basic html seashell for the accordion
            // Just document write it for now.
            // So the first thing will just be a variable assignment - call it an accordion and spit it onto the document
            // let acc = `<button class="accordion">Test Section</button>`

            const acc =  document.createElement("div");

            acc.innerHTML = `<button class="accordion">Test Section</button>`

            console.log(acc);
            // But where to insert it? Let's insert it riiiight into Class: "main" ID: "main-map"
            // Lets drop it in as a child element?
            const select = document.querySelector(".main")

            // Try appending the button onto the main element... ?
            select.appendChild(acc);

            // Just see if something happens :)
            console.log("stuff worked!")
        },

        insertTopLeftBar: function() {
            // Create a nav (emulate LCexpl)
            const nav = document.createElement("nav");

            

        }

    
    })
});
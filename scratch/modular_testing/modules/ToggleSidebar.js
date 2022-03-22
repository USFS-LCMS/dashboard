define([
    "dojo/_base/declare"
], function(declare){

    return declare(null,{

        showSidebar: 'false',

        constructor: function(options){
            
        },

        hamburgerToggle: function(){
            
            // $('#sidebar-left').toggle('collapse');

            // Grab the hamburger button.
            const hamburger = document.getElementById("hamburger");

            // Grab the list thing under the sidebar just in case...
            const inside_sidebar_elem = document.getElementById("parameters-collapse-label-parameters-collapse-div");

            // display: none;
            // overflow: hidden;

            // inside_sidebar_elem.style.display = 'none';
            // inside_sidebar_elem.style.overflow = 'hidden';

            // Add a click event listener that will - maybe - ???? - do what I want.
            hamburger.addEventListener("click", function() {
                // sidebar.toggle("active");
                // Above does not work! Let's try just making sure something happens.
                console.log("burger")
                
                // Swap!
                if ( inside_sidebar_elem.style.display === 'none' ) {
                    inside_sidebar_elem.style.display = 'block';
                }
                else {
                    inside_sidebar_elem.style.display = 'none';
                }
                // inside_sidebar_elem.style.overflow = 'auto';
            })
        },

        // Create a hover and onclick functionality for the inner button
        accordionTabToggle: function() {

            // Grab outer div element
            const outer_elem = document.getElementById("parameters-collapse-label-parameters-collapse-div");

            // Grab the element list that is contained within
            const elem_list = document.getElementById("accordion-tab-element-list-collapse-div");

            elem_list.style.display = 'none';

            outer_elem.addEventListener("click", function() {
                
                if ( elem_list.style.display === 'none') {
                    elem_list.style.display = 'block';
                }
                else {
                    elem_list.style.display = 'none';
                }

            })

        },

        // Create onclick functionality for the inner questions to pop out - make it more general this time
        questionTabToggle: function() {
            // Create an outer div element
            const outer_elem = document.getElementById("forest-health-question");
            console.log(outer_elem);

            // Do the same for the inner elem
            const inner_elem = document.getElementsByClassName("forest-health-question-1");
            console.log(inner_elem);

            // outer_elem.style.cursor = "pointer";
            inner_elem.style.display = 'none';

            outer_elem.addEventListener("click", function () {
                if (inner_elem.style.display === "none") {
                    inner_elem.style.display = "block";
                }
                else {
                    inner_elem.style.display = "none";
                }
            })

        }


    })
});
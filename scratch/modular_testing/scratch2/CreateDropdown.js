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
          
          toggleDisplay: function(elem){
            const curDisplayStyle = elem.style.display;			
                  
            if (curDisplayStyle === 'none' || curDisplayStyle === ''){
              elem.style.display = 'block';
            }
            else{
              elem.style.display = 'none';
            }
          },
          
          toggleMenuDisplay: function(e){
            function toggleClass(elem,className){
                if (elem.className.indexOf(className) !== -1){
                    elem.className = elem.className.replace(className,'');
                }
                else{
                    elem.className = elem.className.replace(/\s+/g,' ') + 	' ' + className;
                }
                
                return elem;
            }
            const dropdown = e.currentTarget.parentNode;
            const menu = dropdown.querySelector('.menu');
            const icon = dropdown.querySelector('.fa-angle-right');
          
            toggleClass(menu,'hide');
            toggleClass(icon,'rotate-90');
          },
          
        handleOptionSelected: function(e){
            function toggleClass(elem,className){
                if (elem.className.indexOf(className) !== -1){
                    elem.className = elem.className.replace(className,'');
                }
                else{
                    elem.className = elem.className.replace(/\s+/g,' ') + 	' ' + className;
                }
                
                return elem;
            }
            toggleClass(e.target.parentNode, 'hide');			
          
            const id = e.target.id;
            const newValue = e.target.textContent + ' ';
            const titleElem = document.querySelector('.dropdown .title');
            const icon = document.querySelector('.dropdown .title .fa');
          
            titleElem.textContent = newValue;
            titleElem.appendChild(icon);
            
            //trigger custom event
            document.querySelector('.dropdown .title').dispatchEvent(new Event('change'));
            //setTimeout is used so transition is properly shown
            setTimeout(() => toggleClass(icon,'rotate-90',0));
            
            // Step 1: Setup the case dictionary that lets you translate questions to chart types
            const quest_dict = {
                "Option 1 ": "Change---Fast Loss",
                "Option 2 ": "Change---Slow Loss",
                "Option 3 ": "Change---Gain",
                "Option 4 ": "Change---Stable"
            }

            // Step 2: Output the chart type
            this.out_chart_type = quest_dict[newValue];
            return this.out_chart_type;
        }
    })
});
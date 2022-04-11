define([
    "dojo/_base/declare",
    "esri/layers/ImageryLayer",
    "modules/ToggleSidebar"
], function(
    declare,
    ImageryLayer,
    ToggleSidebar
    ){
 
    return declare(null,{

        constructor: function(options){
            
        },
        createModals: function(){

            const modal_html =`
            <div id="myModal1" class="modal">
            <div class="modal-content">
              <span id="close1" class="close">&times;</span>
              <p>11Some text in the Modal describing LCMS data product here..</p>
                </div>      
            </div>

            <div id="myModal2" class="modal">
            <div class="modal-content">
              <span id="close2" class="close">&times;</span>
              <p>10Some text in the Modal describing LCMS data product here..</p>
                </div>      
            </div>

            <div id="myModal3" class="modal">
            <div class="modal-content">
              <span id="close3" class="close">&times;</span>
              <p>9Some text in the Modal describing LCMS data product here..</p>
                </div>      
            </div>

            <div id="myModal4" class="modal">
            <div class="modal-content">
              <span id="close4" class="close">&times;</span>
              <p>8Some text in the Modal describing LCMS data product here..</p>
                </div>      
            </div>

            <div id="myModal5" class="modal">
            <div class="modal-content">
              <span id="close5" class="close">&times;</span>
              <p>7Some text in the Modal describing LCMS data product here..</p>
                </div>      
            </div>

            <div id="myModal6" class="modal">
            <div class="modal-content">
              <span id="close6" class="close">&times;</span>
              <p>6Some text in the Modal describing LCMS data product here..</p>
                </div>      
            </div>

            <div id="myModal7" class="modal">
            <div class="modal-content">
              <span id="close7" class="close">&times;</span>
              <p>6Some text in the Modal describing LCMS data product here..</p>
                </div>      
            </div>

            <div id="myModal8" class="modal">
            <div class="modal-content">
              <span id="close8" class="close">&times;</span>
              <p>6Some text in the Modal describing LCMS data product here..</p>
                </div>      
            </div>
          `

          $('#mainwrapperid').append(modal_html);
        },

        createInfoModalDict: function() {
            // Create a dictionary of imagery layers
            const infoModalDict = {
                'span_popup1': "myModal1",
                'span_popup2': "myModal2",
                'span_popup3': "myModal3",
                'span_popup4': "myModal4",
                'span_popup5': "myModal5",
                'span_popup6': "myModal6",
                'span_popup7': "myModal7",
                'span_popup8': "myModal8"

            };
            const closeModalDict = {
                'span_popup1': "close1",
                'span_popup2': "close2",
                'span_popup3': "close3",
                'span_popup4': "close4",
                'span_popup5': "close5",
                'span_popup6': "close6",
                'span_popup7': "close7",
                'span_popup8': "close8"

            };

            Object.keys(infoModalDict).forEach((k) => {
                
                var modal = document.getElementById(infoModalDict[k]);

                // Get the button that opens the modal
                var btn = document.getElementById(k);

                // Get the <span> element that closes the modal
                // var span = document.getElementsByClassName("close")[0];
                var span = document.getElementById(closeModalDict[k]);

                // When the user clicks the button, open the modal 
                btn.onclick = function() {
                modal.style.display = "block";
                }

                // When the user clicks on <span> (x), close the modal
                span.onclick = function() {
                modal.style.display = "none";
                }

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
                }

            })
            // return infoModalDict;
        }
    })
});
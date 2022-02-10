define([
    "dojo/_base/declare"
], function(declare){

    return declare(null,{

        outputPDF: null,

        constructor: function(options){
            // specify class defaults

        },
        //Function to download a pdf report
        downloadPDF: function(){
            console.log('Downloading PDF');

            let outFilename = 'LCMS-Summaries'
            // if($('#pdfFilename').val() !== ''){
            // outFilename = $('#pdfFilename').val()
            // }  
        
            // Add area names
            let doc = new jspdf.jsPDF('portrait');
            let h = doc.internal.pageSize.height;
            let w = doc.internal.pageSize.width;
            let margin = 10;
            doc.setFontSize(20);
            doc.text(margin, margin, "The following areas are included in this summary:");
            doc.setFontSize(5);
            // // doc.text(margin, margin*2, selectedAreaNameList.join(', '),{ maxWidth: doc.internal.pageSize.width-margin*2});
            // doc.addPage();

            // //Add charts
            let currentY = margin;
            let chartW = w - margin*2;

            const canvas = document.getElementById("chart-canvas");

            const chartHeight = canvas.height;
            const chartWidth = canvas.width;
            let aspectRatio = chartHeight/chartWidth;
            var chartH = chartW*aspectRatio;
            // if(currentY + chartH > h){
            //     doc.addPage();
            //     currentY = margin;
            // }
            doc.addImage(canvas.toDataURL("image/jpeg", 1.0), 'JPEG', margin, currentY, chartW, chartH );
            // currentY = currentY+ chartH + margin;
            
            
            doc.save(outFilename+'.pdf');
        }
    })
});
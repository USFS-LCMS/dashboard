define([
    "dojo/_base/declare"
], function(declare){

    return declare(null,{

        outputPDF: null,

        constructor: function(options){
            // specify class defaults

        },
        //Function to download a pdf report
        
        downloadPDF: function(results){            
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
            doc.text(margin, margin, "LCMS Summary:");
            doc.text(margin*2, margin*2, "The following areas are included in this summary:");

            doc.setFontSize(5);
            // // doc.text(margin, margin*2, selectedAreaNameList.join(', '),{ maxWidth: doc.internal.pageSize.width-margin*2});
            // doc.addPage();

            // //Add charts
            let currentY = margin*3;
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
            doc.addImage(canvas.toDataURL("image/jpeg", 1.0), 'JPEG', margin, currentY, chartW, chartH ,{compresion:'NONE'});
            currentY = currentY+ chartH + margin;
            
            //draw table
            // ultimately want a table with 
            var years = results.features[0].attributes["years"].split(",");
            var fastLoss = results.features[0].attributes["Change---Fast Loss"].split(",").map(f => parseFloat(f));
            var total = 0;
            for (var i=0; i<fastLoss.length; i++){
                total+=fastLoss[i]}
            var meanFastLoss = total/fastLoss.length;
            var forestName =results.features[0].attributes["FORESTNAME"]
            var objectID =results.features[0].attributes["OBJECTID"]
            var Region =results.features[0].attributes["REGION"]
            var Area = results.features[0].attributes["GIS_ACRES"]

            var head = [["ID","Forest", "Region", "Area (acres)", "Mean Fast Loss"]]
            var body = [[objectID, forestName, Region, Area, meanFastLoss]] //will change this so that if user selects multiple polygons (???) theyll all populate in chart
            doc.autoTable({
                head:head,
                body:body,
                startY: currentY,
                margin:{horizontal:10},
                styles:{overflow:"linebreak"},
                theme:'striped',
                headStyles:{fillColor:[8,124,124]},
                alternateRowStyles:[181, 231, 221],
                tableLineColor:[8, 124, 124],//[0,0,0],//
                tableLineWidth:0.1,
                columnStyles:{1:{cellWidth:"wrap"}},            
            })
                // bodyStyles: { valign: "top" },
                // columnStyles: { email: { columnWidth: "wrap" } },
                // showHead: "everyPage",
                // didDrawPage: function (data) {
                //   // Header
                //   doc.setFontSize(16);
                //   doc.setTextColor("#161C22");
                //   doc.text("Table", data.settings.margin.left, 35);
                //   doc.text("Brand", 465, 34);
          
                //   // Footer
                //   let str = "" + doc.internal.getNumberOfPages();
                //   doc.setFontSize(10);
          
                //   // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                //   let pageSize = doc.internal.pageSize;
                //   let pageHeight = pageSize.height
                //     ? pageSize.height
                //     : pageSize.getHeight();
                //   doc.text("Footer text", data.settings.margin.left, pageHeight - 10);
                //   doc.text(575, 830, str);
                // }

            
            
            doc.save(outFilename+'.pdf');
        }
    })
});
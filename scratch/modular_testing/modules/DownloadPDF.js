
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "./CreateRobotoFont"
], function(
    declare,
    arrayUtils,
    CreateRobotoFont){

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
        
            // Add area namess
            let doc = new jspdf.jsPDF('portrait');
            let h = doc.internal.pageSize.height;
            let w = doc.internal.pageSize.width;
            let margin = 10;
           
            // Robotofont class (contains text needed to read ttf files)
            const robotoFontClass = CreateRobotoFont({});            
            const robotoNormal = robotoFontClass.getRobotoNormal();
            const robotoBold = robotoFontClass.getRobotoBold();  
            doc.addFileToVFS("RobotoCondensed-Regular-normal.ttf", robotoNormal);
            doc.addFont("RobotoCondensed-Regular-normal.ttf", "RobotoCondensed", "normal");
            doc.addFileToVFS("RobotoCondensed-Bold-normal.ttf", robotoBold);
            doc.addFont("RobotoCondensed-Bold-normal.ttf", "RobotoCondensed", "bold");
                   
            doc.setFont('RobotoCondensed','normal'); 

            //header 
            //header color block
            var fontSize = 12
            doc.setFontSize(fontSize);
            doc.setFillColor(169,209,142);
            //doc.setTextColor(8,124,124);
            doc.rect(0, 0, 600, 20, 'F'); //x, y, w, h, style

            //header logo image
            var fsLogo = new Image();
            fsLogo.src = "../../images/usfslogo_black.png";
            doc.addImage(fsLogo, 'PNG', 3, 3, 15,15);//x,y,w,h
            var usdaLogo = new Image();
            usdaLogo.src = "../../images/usda_logo_black.png";
            doc.addImage(usdaLogo, 'PNG', 20,4, 17,13)//, 15);

            //header text
            var headerTextHeight=18
            var widthPng = 34
            doc.text(margin+widthPng,headerTextHeight, "Region 10");
            doc.setFont(undefined,'bold');
            doc.text(margin+widthPng+19, headerTextHeight, "LCMS");
            doc.setFont(undefined,'normal');
            doc.text(margin+ widthPng+ 32,headerTextHeight,'Report');

            //add title/unit info
            var forestName =results.features[0].attributes["FORESTNAME"]; // ensure that fields are attributed with forest or just splice str(outID)[0]
            var objectID =results.features[0].attributes["OBJECTID"];
            var unitName ='LTA' //update this when we get the real data to be dynamic with what type of data (only allow user to select multiply polygons within one laeyr?? e.g. only LTAs OR only watersheds.. not one LTA and one watershed)
            

            doc.setFontSize(16);
            doc.setTextColor(0,0,0);
            doc.setFont(undefined,'bold')
            var yPos = 30
            doc.text(margin, yPos, "LANDSCAPE CHANGE MONITORING SYSTEM SUMMARY");//x,y,text
            var lineHeight = doc.getLineHeight("LANDSCAPE CHANGE MONITORING SYSTEM SUMMARY") / doc.internal.scaleFactor
            var lines = 1//splittedText.length  // splitted text is a string array
            var blockHeight = lines * lineHeight            
            yPos+= blockHeight+5;
            doc.setFont(undefined,'normal');

            doc.setFontSize(26);
            doc.setFont(undefined,'normal')
            doc.setTextColor(8,124,124)
            var question ="How does climate change...[This is the selected question of interest]?"; //change to document.getElementById("options-dropdown").value;//
            var wrapQuestion= doc.splitTextToSize(question, 180);
            doc.text(margin, yPos, wrapQuestion);

            var lineHeight = doc.getLineHeight(question) / doc.internal.scaleFactor
            var lines = wrapQuestion.length  // splitted text is a string array
            var blockHeight = lines * lineHeight
            yPos+= blockHeight-18

            doc.setFontSize(16)
            doc.setTextColor(0,0,0);
            doc.text(margin, yPos+= blockHeight, "The following areas are included in this summary:");
            doc.setFontSize(16)
            doc.setFont(undefined,'bold');
            var lineHeight = doc.getLineHeight("The following areas are included in this summary:") / doc.internal.scaleFactor
            var lines = 1//wrapQuestion.length  // splitted text is a string array
            var blockHeight = lines * lineHeight
            yPos+= blockHeight+1
            doc.setTextColor(8,124,124)
            doc.text(margin*2, yPos, unitName + ' '+objectID+',') //
            yPos+=blockHeight
            doc.text(margin*2, yPos,forestName )     
            doc.setFont(undefined,'normal');       
            doc.setFontSize(12);
            doc.setTextColor(0,0,0);
            yPos+=blockHeight+5;
            var wrapParagraph = doc.splitTextToSize("This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc.",180);
            doc.text(margin, yPos, wrapParagraph);
            var lineHeight = doc.getLineHeight("The ") / doc.internal.scaleFactor
            var lines = wrapParagraph.length  // splitted text is a string array
            var blockHeight = lines * lineHeight
            yPos+= blockHeight
            //doc.setFontSize(5);
            // // doc.text(margin, margin*2, selectedAreaNameList.join(', '),{ maxWidth: doc.internal.pageSize.width-margin*2});
            // doc.addPage();

            // //Add charts
            let currentY = yPos;
            let chartH = h - margin*2 - yPos;  //target height          

            
            const screenshotMap = document.getElementsByClassName(
                "js-screenshot-image"
              )[0];
            //console.log(screenshotMap.src+"is screenshot map")

            var chartHeight = screenshotMap.height;
            var chartWidth = screenshotMap.width;
            let aspectRatio = chartWidth/chartHeight;
            let chartW = chartH*aspectRatio;
            // if(currentY + chartH > h){
            //     doc.addPage();
            //     currentY = margin;
            // }
            doc.addImage(screenshotMap.src, 'png', margin, currentY, chartW, chartH );//,{compresion:'NONE'});
            
            //new page
            doc.addPage();

            //add graph
            currentY = margin;// currentY+ chartH + margin;
            chartW = w - margin*2;
            const canvas = document.getElementById("chart-canvas");
            chartHeight = canvas.height;
            chartWidth = canvas.width;
            aspectRatio = chartHeight/chartWidth;
            chartH = chartW*aspectRatio;

            doc.addImage(canvas.toDataURL("image/jpeg", 1.0), 'JPEG', margin, currentY, chartW, chartH ,{compresion:'NONE'});

            currentY = currentY+ chartH + margin;
            //draw table
            // ultimately want a table with 
            var years = results.features[0].attributes["years"].split(",");
            var fastLoss = results.features[0].attributes["Change---Fast Loss"].split(",").map(f => parseFloat(f));
            var total = 0;
            for (var i=0; i<fastLoss.length; i++){
                total+=fastLoss[i]}
            var meanFastLoss = parseFloat(String(total/fastLoss.length).slice(0,8));
            var Region =results.features[0].attributes["REGION"];
            var Area = results.features[0].attributes["GIS_ACRES"];

            var head = [["ID","Forest", "Region", "Area (acres)", "Mean Fast Loss"]];
            var body = [[objectID, forestName, Region, Area, meanFastLoss]]; //will change this so that if user selects multiple polygons (???) theyll all populate in chart
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

            
            let finalY = doc.lastAutoTable.finalY; // The y position on the page
            console.log(finalY+'is final y of table')
            doc.setFontSize(12)
            doc.text(margin, finalY+5, "Table 1. Summary of units analyzed")

            //add page numbers to bottom of each page
            var pageCount = doc.internal.getNumberOfPages();
            console.log(pageCount+'is page count'+h+'is height'+w+'is width')
            for (i=0; i< pageCount; i++){
                doc.setPage(i);
                let pageCurrent = String(doc.internal.getCurrentPageInfo().pageNumber);
                doc.setFontSize(12);
                doc.text(pageCurrent,w-margin-pageCurrent.length, h-margin);
                console.log(pageCurrent.length+'len pg cur')
            }


            doc.save(outFilename+'.pdf');
            //doc.printout();
            console.log('Finished Downloading PDF');
        }
    })
});
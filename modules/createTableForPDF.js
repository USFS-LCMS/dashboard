define([
    "dojo/_base/declare",
    "modules/DownloadPDF"
], function(
    declare,
    DownloadPDF
    ){
 
    return declare(null,{

        constructor: function(){


        },
    createTable: function(results, thisFC, currentY){
        var forestDict = {'1':'Tongass National Forest', '2':'Chugach National Forest'}

        var Region ="10"//results.features[0].attributes["REGION"];           
                
        var head = [["ID","Forest", "Region", "Area (km2)", "Mean Fast Loss"]];
        var body = []// [[objectID, forestName, Region, Area, meanFastLoss]]; //will change this so that if user selects multiple polygons theyll all populate in chart
        for (let i=0; i<results[thisFC].features.length; i++){

            var years = results[thisFC].features[i].attributes["years"].split(",");
            var fastLoss = results[thisFC].features[i].attributes["Change---Fast Loss"].split(",").map(f => parseFloat(f));
            var total = 0;
            for (var j=0; j<fastLoss.length; j++){
                total+=fastLoss[j]}
            var meanFastLoss = parseFloat(String(total/fastLoss.length).slice(0,8));

            var objectID =results[thisFC].features[i].attributes["outID"];
            var forestName = forestDict[String(objectID)[0]] // ensure that fields are attributed with forest or just splice str(outID)[0]
            
            var Area = results[thisFC].features[i].attributes["planarArea"]; //this.getArea(results.geometry);
            Area = String(Area).slice(0,9)
            body.push([objectID, forestName, Region, Area, meanFastLoss])
        }  

        return{
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
        }

    }
});
})
/* March 2017
 * Tommy Dang, Assistant professor, iDVL@TTU
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

var selectedCut = 0;

function setCut(){
    var selectedvalue = $('#sdropdown').val();
    if(selectedvalue==="optimized"){

    }else{
         selectedCut = +selectedvalue-1;
    }
    selectHistogram();
}

function selectHistogram(){
    for (var c=0; c<numCut;c++) {
        if (c==selectedCut){
            svg.selectAll(".histogram"+c).style("fill-opacity", 1)
                .style("stroke-opacity", 1);
            for (var m = 1; m < numMonth; m++) {
                var nodes = [];
                if (graphByMonths[m][c]!=undefined){
                    nodes= graphByMonths[m][c].nodes;
                }
                var links = [];
                if (graphByMonths[m][c]!=undefined){
                    links= graphByMonths[m][c].links;
                }
                updateSubLayout(nodes, links, m);
            }
        }
        else{
            svg.selectAll(".histogram"+c).style("fill-opacity", 0.1)
                .style("stroke-opacity", 0.3);
        }
    }
}

function drawHistograms(yStartHistogram){
    for (var cut=0; cut<numCut;cut++){
        svg.selectAll(".histogram"+cut).remove();
        var updateHistogram =  svg.selectAll(".histogram"+cut)
            .data(graphByMonths);
        var enterHistogram = updateHistogram.enter();
        enterHistogram.append("rect")
            .attr("class", "histogram"+cut)
            .attr("id", cut)
            .style("stroke","#000")
            .style("stroke-width",0.3)
            .style("stroke-opacity",function () {
                return cut==selectedCut ? 1 :0.3;
            })
            .style("fill", getColor3(cut))
            .style("fill-opacity",function () {
                return cut==selectedCut ? 1 :0.1;
            })
            .attr("x", function(d,i) {
                var w = XGAP_/(numCut+1);
                if (lMonth-numLens<=i && i<=lMonth+numLens)
                    w = w*lensingMul/2;

                return  xStep+xScale(i)+cut*w-2*w;    // x position is at the arcs
            })
            .attr("y", function(d,i) {
                if (d==undefined || d[cut]==undefined)
                    return yStartHistogram;
                var hScale = d3.scale.linear()
                    .range([1, 40])
                    .domain([0,1]);
                return yStartHistogram- hScale(d[cut].Qmodularity); })
            .attr("height", function(d,i) {
                if (d==undefined || d[cut]==undefined)
                    return 0;
                var hScale = d3.scale.linear()
                    .range([1, 40])
                    .domain([0,1]);
                return hScale(d[cut].Qmodularity); })
            .attr("width", function(d,i){
                var w = XGAP_/(numCut+1);
                if (lMonth-numLens<=i && i<=lMonth+numLens)
                    w = w*lensingMul/2;
                return w;
            });
    }
}


// This Texts is independent from the lower text with stream graphs
var tNodes;
function drawTextClouds(yTextClouds){
    var numTerms = 5; // numTerms in each month
    tNodes = [];
    for(var m = 0;m<numMonth;m++){
        var nodes=[];
        if (graphByMonths[m]==undefined || graphByMonths[m][selectedCut]==undefined) continue;
        for(var i=0;i< graphByMonths[m][selectedCut].nodes.length;i++){
            var nod = graphByMonths[m][selectedCut].nodes[i];
            nodes.push(nod);
        }
        nodes.sort(function (a, b) {
            if (a.weight < b.weight) {   // weight is the degree of nodes
                return 1;
            }
            else if (a.weight > b.weight) {
                return -1;
            }
            else{
                if (a.community < b.community) { // cluster id, generated by Vinh Nguyen
                    return 1;
                }
                else if (a.community > b.community) {
                    return -1;
                }
                else{
                    -1
                }

            }
        });
        for(var i = 0;i<numTerms && i<nodes.length;i++){
            nodes[i].indexForTextClouds=i;  // This is  the index for textcloud for every month
            tNodes.push(nodes[i]);
        }
    }


    svg.selectAll(".textCloud3").remove();
    var yStep =15;
    var updateText =  svg.selectAll(".textCloud3")
            .data(tNodes);
    var enterText = updateText.enter();
    enterText.append("text")
        .attr("class", "textCloud3")
        .style("fill", "#000000")
        .style("text-anchor","end")
        .style("text-shadow", "1px 1px 0 rgba(255, 255, 255, 0.6")
        //.attr("x", xStep-2)   show text on the left side
        .attr("x", function(d,i) {
            console.log(i+" "+d);
            return  xStep+xScale(d.m) -2;    // x position is at the arcs
        })
        .attr("y", function(d) {
            return yTextClouds + d.indexForTextClouds * yStep;     // Copy node y coordinate
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .text(function(d) {  return d.name });

}

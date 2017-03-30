/* March 2017
 * Tommy Dang, Assistant professor, iDVL@TTU
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

var selectedCut = 0;

function setCut(cutvalue){
    var selectedvalue = cutvalue;
    if (selectedvalue === "optimized") {
        selectedCut = -100;
        cutOffvalue=get_bestCut(graphByMonths);
        createForceOptimized();
        updateHistogramOptimized();
    } else {
        selectedCut = +selectedvalue - 1;
        selectHistogram();
    }

}

function selectHistogram() {
    for (var c = 0; c < numCut; c++) {
        if (c == selectedCut) {
            svg.selectAll(".histogram" + c).style("fill-opacity", 1)
                .style("stroke-opacity", 1);
            for (var m = 1; m < numMonth; m++) {
                var nodes = [];
                if (graphByMonths[m][c] != undefined) {
                    nodes = graphByMonths[m][c].nodes;
                }
                var links = [];
                if (graphByMonths[m][c] != undefined) {
                    links = graphByMonths[m][c].links;
                }
                updateSubLayout(nodes, links, m);
            }
        }
        else {
            svg.selectAll(".histogram" + c).style("fill-opacity", 0.1)
                .style("stroke-opacity", 0.3);
        }
    }
}
function updateHistogramOptimized() {
    for (var c = 0; c < numCut; c++) {
        svg.selectAll(".histogram" + c)
            .style("fill-opacity", function (d,m) {
                if (c==cutOffvalue[m]-1){
                    return 1;
               }
               else{
                   return 0.1;
               }
            })
            .style("stroke-opacity", function (d,m) {
                if (c==cutOffvalue[m]-1){
                    return 1;
                }
                else{
                    return 0.3;
                }
            });
    }
}
function createForceOptimized() {
    console.log("createForceOptimized");
    for (var c = 0; c < numCut; c++) {
        for (var m = 1; m < numMonth; m++) {
            if (c==cutOffvalue[m]-1){
                if (m==17)
                    debugger;
                var nodes = [];
                if (graphByMonths[m][c] != undefined) {
                    nodes = graphByMonths[m][c].nodes;
                }
                var links = [];
                if (graphByMonths[m][c] != undefined) {
                    links = graphByMonths[m][c].links;
                }
                updateSubLayout(nodes, links, m);
            }
        }
    }
}

function drawHistograms(yStartHistogram) {
    for (var cut = 0; cut < numCut; cut++) {
        svg.selectAll(".histogram" + cut).remove();
        var updateHistogram = svg.selectAll(".histogram" + cut)
            .data(graphByMonths);
        var enterHistogram = updateHistogram.enter();
        enterHistogram.append("rect")
            .attr("class", "histogram" + cut)
            .attr("id", cut)
            .style("stroke", "#000")
            .style("stroke-width", 0.3)
            .style("stroke-opacity", function () {
                return cut == selectedCut ? 1 : 0.3;
            })
            .style("fill", getColor3(cut))
            .style("fill-opacity", function () {
                return cut == selectedCut ? 1 : 0.1;
            })
            .attr("x", function (d, i) {
                var w = XGAP_ / (numCut + 1);
                if (lMonth - numLens <= i && i <= lMonth + numLens)
                    w = w * lensingMul / 2;

                return xStep + xScale(i) + cut * w - 2 * w;    // x position is at the arcs
            })
            .attr("y", function (d, i) {
                if (d == undefined || d[cut] == undefined)
                    return yStartHistogram;
                var hScale = d3.scale.linear()
                    .range([1, 40])
                    .domain([0, 1]);
                return yStartHistogram - hScale(d[cut].Qmodularity);
            })
            .attr("height", function (d, i) {
                if (d == undefined || d[cut] == undefined)
                    return 0;
                var hScale = d3.scale.linear()
                    .range([1, 40])
                    .domain([0, 1]);
                return hScale(d[cut].Qmodularity);
            })
            .attr("width", function (d, i) {
                var w = XGAP_ / (numCut + 1);
                if (lMonth - numLens <= i && i <= lMonth + numLens)
                    w = w * lensingMul / 2;
                return w;
            });
    }
}


// This Texts is independent from the lower text with stream graphs
var tNodes;
function drawTextClouds(yTextClouds) {
    var numTerms = 5; // numTerms in each month
    tNodes = [];
    for (var m = 0; m < numMonth; m++) {
        var newCut = selectedCut;
        if (newCut<0){  // Best Q modularity selected
            newCut = cutOffvalue[m];
        }

        var nodes = [];
        if (graphByMonths[m] == undefined || graphByMonths[m][newCut] == undefined) continue;
        for (var i = 0; i < graphByMonths[m][newCut].nodes.length; i++) {
            var nod = graphByMonths[m][newCut].nodes[i];
            nodes.push(nod);
        }
        nodes.sort(function (a, b) {
            if (a.weight < b.weight) {   // weight is the degree of nodes
                return 1;
            }
            else if (a.weight > b.weight) {
                return -1;
            }
            else {
                if (a.community < b.community) { // cluster id, generated by Vinh Nguyen
                    return 1;
                }
                else if (a.community > b.community) {
                    return -1;
                }
                else {
                    -1
                }

            }
        });
        for (var i = 0; i < numTerms && i < nodes.length; i++) {
            nodes[i].indexForTextClouds = i;  // This is  the index for textcloud for every month
            tNodes.push(nodes[i]);
        }
    }

    var max = 1;
    var min =  1;
    for (var i=0;i<tNodes.length;i++){
        if (tNodes[i].weight>max)
            max = tNodes[i].weight;
        if (tNodes[i].weight<min)
            min = tNodes[i].weight;
    }


    svg.selectAll(".textCloud3").remove();
    var yStep = 15;
    var updateText = svg.selectAll(".textCloud3")
        .data(tNodes);
    var enterText = updateText.enter();
    enterText.append("text")
        .attr("class", "textCloud3")
        .style("text-anchor", "middle")
        .style("text-shadow", "1px 1px 0 rgba(0, 0, 0, 0.6")
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d) {
            var s=100;
            console.log("d.weight="+d.weight);
            if (d.weight==undefined)
                s = 10;
            else if (lMonth-numLens<=d.m && d.m<=lMonth+numLens){
                var sizeScale = d3.scale.linear()
                    .range([10, 20])
                    .domain([min, max]);
                s = sizeScale(d.weight);
            }
            else{
                var sizeScale = d3.scale.linear()
                    .range([2, 12])
                    .domain([min, max]);
                s = sizeScale(d.weight);
            }
            return s+"px";
        })
        .style("fill", function(d) {
            return getColor3(d.category);
        })
        .attr("x", function(d,i) {
            return xStep + xScale(d.m);    // x position is at the arcs
        })
        .attr("y", function (d) {
            return yTextClouds + d.indexForTextClouds * yStep;     // Copy node y coordinate
        })
        .text(function(d) {
            if (lMonth-numLens<=d.m && d.m<=lMonth+numLens){
                return d.name.substring(0,18);
            }
            else{
                return d.name.substring(0,10);
            }
        });

}

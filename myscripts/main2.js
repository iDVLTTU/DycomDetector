/* 2017
 * Tommy Dang, Assistant professor, iDVL@TTU
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */


var graphByMonths = [];
var termList = {}; // List of term to feed to TimeArcs in main.js
var lNodes, lLinks;  // Nodes in the lensing month

function computeMonthlyGraphs() {
    for (var m = 1; m < numMonth; m++) {
        var arr = [];
        for (var i = 0; i < termArray.length; i++) {
            var att = termArray[i].term;
            if (terms[att][m] && att.length>=2) {  // Term contains at least 2 characters
                var obj = new Object();
                var previous = 0;
                if (terms[att][m - 1])
                    previous = terms[att][m - 1];
                var net = (terms[att][m] + 1) / (previous + 1);
                obj.term = att;
                obj.net = net;
                obj.count = terms[att][m];
                obj.category = termArray[i].category;
                obj.m = m;
                arr.push(obj);
            }
        }

        arr.sort(function (a, b) {
            if (a.count < b.count) {
                return 1;
            }
            if (a.count > b.count) {
                return -1;
            }
            return 0;
        });
        var arr2 = arr.filter(function (d, i) {
            return i < 50;
        });

        var cut = 3;
        graphByMonths[m] = [];
        while (cut < 4) {
            // *********** VERTICES **************
            var nodes5 = [];
            for (var i = 0; i < arr2.length; i++) {
                var nod = new Object();
                nod.id = i;
                nod.m = m;
                nod.category = arr2[i].category;
                nod.name = arr2[i].term;
                nod.net = arr2[i].net;
                nod.x = xStep + xScale(nod.m);   // 2016 initialize x position
                nod.y = height / 2;

                //if (termArray3[i].isConnected>0)  // Only allow connected items
                nodes5.push(nod);

                termList[nod.name] = nod;// List of term to feed to TimeArcs in main.js
            }
            // *********** EDGES **************
            var links5 = [];
            var relationshipMax5 = 0;
            // for(var cut=1; cut<30;cut++){
            for (var i = 0; i < nodes5.length; i++) {
                var term1 = nodes5[i].name;
                for (var j = i + 1; j < nodes5.length; j++) {
                    var term2 = nodes5[j].name;
                    if (relationship[term1 + "__" + term2] && relationship[term1 + "__" + term2][m] >= cut) {
                        var l = new Object();
                        l.source = nodes5[i];
                        nodes5[i].isConnected = true;
                        l.target = nodes5[j];
                        nodes5[j].isConnected = true;
                        l.count = relationship[term1 + "__" + term2][m];
                        l.m = m;
                        links5.push(l);
                        if (relationship[term1 + "__" + term2][m] > relationshipMax5)
                            relationshipMax5 = relationship[term1 + "__" + term2][m];
                    }
                }
            }


            var tempnodes = nodes5.filter(function (d, i) {
                return d.isConnected;
            });
            var templinks = links5;
            if(tempnodes.length==0&&templinks.length==0){
                break;
            }

            var graph = {};
            graph.nodes = tempnodes;
            graph.links = templinks;




            //Betweenness centrality value
            var adjancylist = new Array(graph.nodes.length);
            graph.nodes.forEach(function (d,i) {
                adjancylist[i]=[];
            })
            var tempgraph = JSON.parse(JSON.stringify(graph));
            tempgraph.links.forEach(function (l) {
                tempgraph.nodes.forEach(function (n,i) {
                    if(n.id==l.source.id){
                        l.source =i;
                    }
                    if(n.id==l.target.id){
                        l.target=i;
                    }
                })
            })
            tempgraph.links.forEach(function (d) {
                adjancylist[d.source].push(d.target);
                adjancylist[d.target].push(d.source)
            })

            var Abetweenness = betweenness_centrality(adjancylist);
            var Obetweenness = new Object();
            for(var i=0;i<graph.nodes.length;i++){
                Obetweenness[graph.nodes[i].id]=Abetweenness[i];
            }

            //End of betweenness centrality

            




            var node_ids = [], link_ids = [];
            tempnodes.forEach(function (d) {
                node_ids.push(d.id);
            });
            templinks.forEach(function (d) {
                link_ids.push({"source": d.source.id, "target": d.target.id, "weight": 1})
            });

            var community = jLouvain().nodes(node_ids).edges(link_ids)();
            var adjmatrix = create_adjmatrix(graph);
            graph.nodes.forEach(function (d) {
                d.community = community[d.id];
            });

            var groups = d3.nest()
                .key(function (d) {
                    return d.community;
                })
                .entries(graph.nodes);
            var partition = [];
                groups.forEach(function (d) {
                    var par = [];
                    d.values.forEach(function (a) {
                        par.push(graph.nodes.findIndex(x => x.id == a.id)
                        )
                    });
                    partition.push(par);
                })
            graph.Qmodularity = modularity(partition, adjmatrix);
            graph.cutoff = cut;
            graphByMonths[m].push(graph);
            cut += 1;
        }
        //console.log(graphByMonths[m].sort(function (a,b) {
        //    return b.Qmodularity - a.Qmodularity
        //}));
        if (graphByMonths[m][0]!=undefined)
             updateSubLayout(graphByMonths[m][0].nodes, graphByMonths[m][0].links, m);
    }
}

function drawgraph2(m){
    var startMonth= m>numLens ? m-numLens : m;
    var endMonth = startMonth+numLens*2+1;
    var breakCheck = false;
    lNodes = [];
    for(var m = startMonth;m<endMonth;m++){
        if (graphByMonths[m]==undefined || graphByMonths[m][0]==undefined) continue;
        for(var i=0;i< graphByMonths[m][0].nodes.length;i++){
            if(lNodes.length==100){
                breakCheck=true;
                break;
            }
            var nod = graphByMonths[m][0].nodes[i];
            var found = false;
            for (var j=0; j<lNodes.length;j++){
                if (lNodes[j].name==nod.name) {
                    found = true;
                    break;
                }
            }
            if (!found){
                lNodes.push(nod);
            }
        }
        if (breakCheck)
            break;
    }






    var yStart = height+150 ; // y starts drawing the stream graphs
    var yStep = 13

    svg.selectAll(".layer3").remove();
    var update_ =  svg.selectAll(".layer3")
     .data(lNodes, function(d) {  return d.name })
        ;//.style("fill", "black");

    var enter_ = update_.enter();


    enter_.append("path")
     .attr("class", "layer3")
     .style("stroke", function(d) { return  "#000"; })
     .style("stroke-width",0.5)
     .style("stroke-opacity",0.5)
     .style("fill-opacity",0.3)
     .style("fill", function(d) {
          return getColor3(d.category);
     })
     .attr("d", function(d, index) {
         if (termList[d.name].monthly==undefined){
             termList[d.name].monthly = computeMonthlyData(d.name);
         }
         for (var i=0; i<termList[d.name].monthly.length; i++){
             termList[d.name].monthly[i].yNode = yStart+index*yStep;     // Copy node y coordinate
         }
         return area(termList[d.name].monthly);
     }) ;

    // LINKs **********************************
    lLinks = [];
    for(var m = startMonth;m<endMonth;m++){
        if (graphByMonths[m]==undefined || graphByMonths[m][0]==undefined) continue;
        for(var i=0;i< graphByMonths[m][0].links.length;i++){
            var lin = graphByMonths[m][0].links[i];
            lLinks.push(lin);

        }
    }


    svg.selectAll(".linkArc3").remove();
    svg.selectAll(".linkArc3")
        .data(lLinks)
        .enter().append("path")
        .attr("class", "linkArc3")
        .style("stroke-width", function (d) {
            return 5*linkScale3(d.count);
        })
        .attr("d", linkArc3);



    svg.selectAll(".nodeText3").remove();
    var updateText =  svg.selectAll(".nodeText3")
        .data(lNodes, function(d) { return d.name })
        ;//.style("fill", "black")
        //.text(function(d) { return d.name });
    var enterText = updateText.enter();
    enterText.append("text")
        .attr("class", "nodeText3")
        .style("fill", "#000000")
        .style("text-anchor","end")
        .style("text-shadow", "1px 1px 0 rgba(255, 255, 255, 0.6")
        .attr("x", xStep-2)
        .attr("y", function(d, i) {
            return  yStart + i * yStep+4;     // Copy node y coordinate
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .text(function(d) { return d.name });
}

function computeMonthlyData(term){
    var monthly = [];
    for (var m=0; m<numMonth; m++){
        var mon = new Object();
        if (terms[term][m]){
            mon.value = terms[term][m];
            mon.monthId = m;
            monthly.push(mon);
        }
    }
    // Add another item to first
    if (monthly.length>0){
        var firstObj = monthly[0];
        if (firstObj.monthId>0){
            var mon = new Object();
            mon.value = 0;
            mon.monthId = firstObj.monthId-1;
            monthly.unshift(mon);
        }

        // Add another item
        var lastObj = monthly[monthly.length-1];
        if (lastObj.monthId<numMonth-1){
            var mon = new Object();
            mon.value = 0;
            mon.monthId = lastObj.monthId+1;
            monthly.push(mon);
        }
    }
    return monthly;
}

function linkArc3(d) {
    var term1 = d.source.name;
    var term2 = d.target.name;
    var x1 = xStep+xScale(d.m);
    var x2 = x1;
    var y1 = termList[term1].monthly[0].yNode;
    var y2 = termList[term2].monthly[0].yNode;
    console.log(y1+" "+y2);

    var dx = x2 - x1,
        dy = y2 - y1,
        dr = Math.sqrt(dx * dx + dy * dy)/2;
    if (y1<y2)
        return "M" + x1 + "," + y1 + "A" + dr + "," + dr + " 0 0,1 " +x2 + "," +y2;
    else
        return "M" + x2 + "," + y2 + "A" + dr + "," + dr + " 0 0,1 " + x1 + "," + y1;
}
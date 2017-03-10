/* 2017
 * Tommy Dang, Assistant professor, iDVL@TTU
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */



// TermArray contains a smaller list of terms with NET > 2
var graphByMonths=[];

function computeMonthlyGraphs(){
    for (var m=1; m<numMonth;m++) {
        var arr = [];
        for (var i = 0; i < termArray.length; i++) {
            var att = termArray[i].term;
            if (terms[att][m]) {
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
        var arr2 =arr.filter(function(d,i){
            return i<300;
        });


        var nodes5 = [];
        for (var i=0; i<arr2.length;i++){
            var nod = new Object();
            nod.id = i;
            nod.m = m;
            nod.category = arr2[i].category;
            nod.name = arr2[i].term;
            nod.net = arr2[i].net;
            nod.x=xStep+xScale(nod.m);   // 2016 initialize x position
            nod.y=height/2;

            //if (termArray3[i].isConnected>0)  // Only allow connected items
            nodes5.push(nod);
        }


        // *********** LINKS **************
        var links5 = [];
        var relationshipMax5 = 0;

        var cut = 1;
        for (var i=0; i<nodes5.length;i++) {
            var term1 = nodes5[i].name;
            for (var j = i + 1; j < nodes5.length; j++) {
                var term2 = nodes5[j].name;
                if (relationship[term1 + "__" + term2] && relationship[term1 + "__" + term2][m] >= cut) {
                    var l = new Object();
                    l.source = nodes5[i];
                    nodes5[i].isConnected =  true;
                    l.target = nodes5[j];
                    nodes5[j].isConnected =  true;
                    l.count = relationship[term1 + "__" + term2][m];
                    l.m = m;
                    links5.push(l);
                    if (relationship[term1 + "__" + term2][m] > relationshipMax5)
                        relationshipMax5 = relationship[term1 + "__" + term2][m];
                }
            }
        }


        graphByMonths[m] = {};
        graphByMonths[m].nodes = nodes5.filter(function(d,i){
            return d.isConnected;
        });
        graphByMonths[m].links = links5;

        // console.log("m="+m+" nodes="+graphByMonths[m].nodes.length+" links5="+graphByMonths[m].links.length+" relationshipMax5="+relationshipMax5);

        var node_ids = [], link_ids=[];
        graphByMonths[m].nodes.forEach(function (d) {
            node_ids.push(d.id);
        });
        graphByMonths[m].links.forEach(function (d) {
            link_ids.push({"source":d.source.id,"target":d.target.id,"weight":1})
        })
<<<<<<< Updated upstream

        var community  = jLouvain().nodes(node_ids).edges(links5)();
=======
        var community  = jLouvain().nodes(node_ids).edges(link_ids)();
        console.log(links5)
        //console.log(links5)
>>>>>>> Stashed changes
        graphByMonths[m].nodes.forEach(function (d) {
            d.community = community[d.id];
        });
       updateSubLayout(graphByMonths[m].nodes,graphByMonths[m].links)

        //debugger;
    }
}

/*

function computeConnectivity2(a, m, cut) {
    for (var i=0; i<a.length;i++){
        a[i].isConnected=-100;
    }

    for (var i=0; i<a.length;i++){
        var term1 =  a[i].term;
        for (var j=i+1; j<a.length;j++){
            var term2 =  a[j].term;
            if (relationship[term1+"__"+term2][m] && relationship[term1+"__"+term2][m]>=cut){
                a[i]
            }
            else if (relationship[term2+"__"+term1] && relationship[term2+"__"+term1].max>=cut){
                if (relationship[term2+"__"+term1].max>a[i].isConnected){
                    a[i].isConnected = relationship[term2+"__"+term1].max;
                    a[i].isConnectedMaxMonth = relationship[term1+"__"+term2].maxMonth;
                }
                if (relationship[term2+"__"+term1].max>a[j].isConnected){
                    a[j].isConnected = relationship[term2+"__"+term1].max;
                    a[j].isConnectedMaxMonth = relationship[term1+"__"+term2].maxMonth;
                }    ø
            }
        }
    }
}*/
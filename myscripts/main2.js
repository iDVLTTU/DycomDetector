/* 2017
 * Tommy Dang, Assistant professor, iDVL@TTU
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */



// TermArray contains a smaller list of terms with NET > 2
var termsByMonths=[];

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
                obj.category = termArray[i].category;
                obj.m = m;
                arr.push(obj);
            }
        }

        arr.sort(function (a, b) {
            if (a.net < b.net) {
                return 1;
            }
            if (a.net > b.net) {
                return -1;
            }
            return 0;
        });
        termsByMonths[m]=arr.filter(function(d,i){
            return i<200;
        });


        var nodes5 = [];
        for (var i=0; i<termsByMonths[m].length;i++){
            var nod = new Object();
            nod.id = i;
            nod.m = m;
            nod.category = termsByMonths[m][i].category;
            nod.name = termsByMonths[m][i].term;
            nod.x=xStep+xScale(nod.m);   // 2016 initialize x position
            nod.y=height/2;

            //if (termArray3[i].isConnected>0)  // Only allow connected items
            nodes5.push(nod);
        }


        // *********** LINKS **************
        var links5 = [];
        var relationshipMaxMax5 = 0;

        var cut = 0;
        for (var i=0; i<nodes5.length;i++) {
            var term1 = nodes5[i].name;
            for (var j = i + 1; j < nodes5.length; j++) {
                var term2 = nodes5[j].name;
                if (relationship[term1 + "__" + term2] && relationship[term1 + "__" + term2][m] >= cut) {
                    var sourceNodeId = i;
                    var targetNodeId = j;

                    var l = new Object();
                    l.source = sourceNodeId;
                    l.target = targetNodeId;
                    l.count = relationship[term1 + "__" + term2][m];
                    l.m = m;
                    links5.push(l);
                    if (relationship[term1 + "__" + term2][m] > relationshipMaxMax5)
                        relationshipMaxMax5 = relationship[term1 + "__" + term2][m];
                }
            }
        }
        console.log("nodes="+nodes5.length+" links5="+links5.length);
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
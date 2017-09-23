//Constants for the SVG
var margin = {top: 0, right: 0, bottom: 5, left: 0};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 50 - margin.top - margin.bottom;



//---End Insert------

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", 1400);

var personTerms;
var locTerms;
var misTerms;
var orgTerms;

var data, data2;
var minYear = 2005;
var maxYear = 2015;
var numMonth = 12 * (maxYear - minYear);

var sourceList = {};
var numSource = {};
var maxCount = {}; // contain the max frequency for 4 categories

var nodes;
var numNode, numNode2;

var link;
var links;
var linkArcs;
var termArray, termArray2, termArray3;
var relationship;
var termMaxMax, termMaxMax2;
var terms;
var xStep = 179;
var yScale;
var linkScale;
var searchTerm = "";

var nodeY_byName = {};

var isLensing = false;
var lensingMul = 7;
var lMonth = -lensingMul * 2;
var oldLmonth = -1000; // use this variable to compare if we are lensing over a different month

var coordinate = [0, 0];
var XGAP_ = 17; // gap between months on xAxis
var numLens = 3;

function xScale(m) {
    if (isLensing) {
        var maxM = Math.max(0, lMonth - numLens - 1);
        var numMonthInLense = (lMonth + numLens - maxM + 1);

        //compute the new xGap
        var total = numMonth + numMonthInLense * (lensingMul - 1);
        var xGap = (XGAP_ * numMonth) / total;

        if (m < lMonth - numLens)
            return m * xGap;
        else if (m > lMonth + numLens) {
            return maxM * xGap + numMonthInLense * xGap * lensingMul + (m - (lMonth + numLens + 1)) * xGap;
        }
        else {
            return maxM * xGap + (m - maxM) * xGap * lensingMul;
        }
    }
    else {
        return m * XGAP_;
    }
}



var area = d3.svg.area()
    .interpolate("basic")
    .x(function (d) {
        return xStep + xScale(d.monthId);
    })
    .y0(function (d) {
        return d.yNode - yScale(d.value);
    })
    .y1(function (d) {
        return d.yNode + yScale(d.value);
    });

var optArray = [];   // FOR search box

var numberInputTerms = 0;
var listMonth;


var nodes2 = [];
var links2 = [];
var nodes2List = {};
var links2List = {};

// Replacing the silder value ******************
var valueSlider =5;
    

     //d3.tsv("data/americablog.tsv", function (error, data_) {
    // d3.tsv("data/crooks_and_liars.tsv", function (error, data_) {
    // d3.tsv("data/emptywheel.tsv", function (error, data_) {
    // d3.tsv("data/esquire.tsv", function (error, data_) {
    // d3.tsv("data/factcheck.tsv", function (error, data_) {
    // d3.tsv("data/glenngreenwald.tsv", function (error, data_) {
   // data_ d3.tsv("data/huffington.tsv", function (error, data_) {
    //d3.tsv("data/propublica.tsv", function (error, data_) {
d3.tsv("data/wikinews.tsv", function (error, data_) {

    if (error) throw error;
    data = data_;

    terms = new Object();
    termMaxMax = 1;
    data.forEach(function (d) {
        d.source = d["source"];
        // Process date
        var curDate = Date.parse(d["time"]);
        d.date = new Date(d["time"]);
        var year = d.date.getFullYear();
        var m = 12 * (year - minYear) + d.date.getMonth();
        d.m = m;

        if (year >= minYear && year <= maxYear) {
            // Add source to sourceList
            if (!sourceList[d.source])
                sourceList[d.source] = 1;
            else
                sourceList[d.source]++;
        }

        if (d["person"] != "") {
            var list = d["person"].split("|");
            for (var i = 0; i < list.length; i++) {
                var term = list[i];
                d[term] = 1;
                if (!terms[term]) {
                    terms[term] = new Object();
                    terms[term].max = 0;
                    terms[term].maxMonth = -100;   // initialized negative
                    terms[term].category = "person";
                }
                if (!terms[term][m])
                    terms[term][m] = 1;
                else {
                    terms[term][m]++;
                    if (terms[term][m] > terms[term].max) {
                        terms[term].max = terms[term][m];
                        terms[term].maxMonth = m;
                        if (terms[term].max > termMaxMax)
                            termMaxMax = terms[term].max;
                    }
                }
            }
        }

        if (d["location"] != "" && d["location"] != 1) {
            var list = d["location"].split("|");
            for (var i = 0; i < list.length; i++) {
                var term = list[i];
                d[term] = 1;
                if (!terms[term]) {
                    terms[term] = new Object();
                    terms[term].max = 0;
                    terms[term].maxMonth = -100;   // initialized negative
                    terms[term].category = "location";
                }
                if (!terms[term][m])
                    terms[term][m] = 1;
                else {
                    terms[term][m]++;
                    if (terms[term][m] > terms[term].max) {
                        terms[term].max = terms[term][m];
                        terms[term].maxMonth = m;
                        if (terms[term].max > termMaxMax)
                            termMaxMax = terms[term].max;

                    }
                }
            }
        }
        if (d["organization"] != "" && d["organization"] != 1) {
            var list = d["organization"].split("|");
            for (var i = 0; i < list.length; i++) {
                var term = list[i];
                d[term] = 1;
                if (!terms[term]) {
                    terms[term] = new Object();
                    terms[term].max = 0;
                    terms[term].maxMonth = -100;   // initialized negative
                    terms[term].category = "organization";
                }
                if (!terms[term][m])
                    terms[term][m] = 1;
                else {
                    terms[term][m]++;
                    if (terms[term][m] > terms[term].max) {
                        terms[term].max = terms[term][m];
                        terms[term].maxMonth = m;
                        if (terms[term].max > termMaxMax)
                            termMaxMax = terms[term].max;

                    }
                }
            }
        }
        if (d["miscellaneous"] != "" && d["miscellaneous"] != 1) {
            var list = d["miscellaneous"].split("|");
            for (var i = 0; i < list.length; i++) {
                var term = list[i];
                d[term] = 1;
                if (!terms[term]) {
                    terms[term] = new Object();
                    terms[term].max = 0;
                    terms[term].maxMonth = -100;   // initialized negative
                    terms[term].category = "miscellaneous";
                }
                if (!terms[term][m])
                    terms[term][m] = 1;
                else {
                    terms[term][m]++;
                    if (terms[term][m] > terms[term].max) {
                        terms[term].max = terms[term][m];
                        terms[term].maxMonth = m;
                        if (terms[term].max > termMaxMax)
                            termMaxMax = terms[term].max;
                    }
                }
            }
        }
    });
    console.log("DONE reading the input file = " + data.length);

    readTermsAndRelationships();
    console.log("DONE computing relationshipMaxMax=" + relationshipMaxMax);

    // 2017. this function is main2.js
    computeMonthlyGraphs();

    drawColorLegend();
    drawTimeLegend();

    drawTimeBox(); // This box is for brushing
    drawLensingButton();

    computeNodes();
    computeLinks();


    updateTransition(1);

    for (var i = 0; i < termArray.length / 10; i++) {
        optArray.push(termArray[i].term);
    }
    optArray = optArray.sort();
    $(function () {
        $("#search").autocomplete({
            source: optArray
        });
    });
});

function recompute() {
    var bar = document.getElementById('progBar'),
        fallback = document.getElementById('downloadProgress'),
        loaded = 0;

    var load = function () {
        loaded += 1;
        bar.value = loaded;

        /* The below will be visible if the progress tag is not supported */
        $(fallback).empty().append("HTML5 progress tag not supported: ");
        $('#progUpdate').empty().append(loaded + "% loaded");

        if (loaded == 100) {
            clearInterval(beginLoad);
            $('#progUpdate').empty().append("Complete");
        }
    };
}

function readTermsAndRelationships() {
    data2 = data.filter(function (d, i) {
        if (!searchTerm || searchTerm == "") {
            return d;
        }
        else if (d[searchTerm])
            return d;
    });

    var selected = {}
    if (searchTerm && searchTerm != "") {
        data2.forEach(function (d) {
            for (var term1 in d) {
                if (!selected[term1])
                    selected[term1] = {};
                else {
                    if (!selected[term1].isSelected)
                        selected[term1].isSelected = 1;
                    else
                        selected[term1].isSelected++;
                }
            }
        });
    }

    var removeList = {};   // remove list **************
    removeList["source"] = 1;
    removeList["person"] = 1;
    removeList["location"] = 1;
    removeList["organization"] = 1;
    removeList["miscellaneous"] = 1;

    removeList["muckreads weekly deadly force"] = 1
    removeList["propublica"] = 1;
    removeList["white this alabama judge has figured out how"] = 1;
    removeList["dea ’s facebook impersonato"] = 1;
    removeList["dismantle roe"] = 1;
    removeList["huffington post"] = 1;


    termArray = [];
    var nodesMonth = [];

    for (var att in terms) {
        var e = {};
        e.term = att;
        if (removeList[e.term] || (searchTerm && searchTerm != "" && !selected[e.term])) // remove list **************
            continue;

        var maxNet = 0;
        var maxMonth = -1;
        for (var m = 1; m < numMonth; m++) {
            if (terms[att][m]) {
                var previous = 0;
                if (terms[att][m - 1])
                    previous = terms[att][m - 1];
                var net = (terms[att][m] + 1) / (previous + 1);
                if (net > maxNet) {
                    maxNet = net;
                    maxMonth = m;
                }
            }
        }
        e.max = maxNet;
        e.maxMonth = maxMonth;
        e.category = terms[att].category;



        if (e.term == searchTerm) {
            e.max = 10000;
            e.isSearchTerm = 1;
        }

        else if (searchTerm && searchTerm != "" && selected[e.term] && selected[e.term].isSelected) {
            e.max = 5000 + selected[e.term].isSelected;
            //   console.log("e.term = "+e.term+" e.max =" +e.max );
        }

        // if (!e.max && e.max!=0)
        //     console.log("What the e.term = "+e.term+" e.max =" +e.max );

        if (e.max > 2)    // Only get terms with some increase
            termArray.push(e);
    }
    termArray.sort(function (a, b) {
        if (a.max < b.max) {
            return 1;
        }
        if (a.max > b.max) {
            return -1;
        }
        return 0;
    });

    console.log("termArray.length=" + termArray.length);

    numberInputTerms = termArray.length;
    console.log(termArray);
    personTerms = 0;
    locTerms = 0;
    misTerms = 0;
    orgTerms = 0;
    for(i = 0;i <numberInputTerms; i++){
        if(termArray[i].category == "organization"){
            orgTerms++;
        }
        else if(termArray[i].category == "person"){
            personTerms++;
        }
        else if(termArray[i].category == "location"){
            locTerms++;
        }
        else
            misTerms++;

    }

    console.log(personTerms + " terms of " + "Person");
    console.log(locTerms + " terms of " + "location");
    console.log(orgTerms + " terms of " + "organization");
    console.log(misTerms + " terms of " + "miscellaneous");


        // Compute relationship **********************************************************
        numNode = Math.min(40, termArray.length);
        numNode2 = Math.min(numNode*3, termArray.length);
        var selectedTerms = {};
        for (var i=0; i<numNode2;i++){
           selectedTerms[termArray[i].term] = termArray[i].max;
        }
        

        relationship ={};
        relationshipMaxMax =0;
        data2.forEach(function(d) { 
            var year = d.date.getFullYear();
            if (year>=minYear && year<=maxYear){
                var m = d.m;
                for (var term1 in d) {
                    if (selectedTerms[term1]){   // if the term is in the selected 100 terms
                        for (var term2 in d) {
                            if (selectedTerms[term2]){   // if the term is in the selected 100 terms
                                if (!relationship[term1+"__"+term2]){
                                    relationship[term1+"__"+term2] = new Object();
                                    relationship[term1+"__"+term2].max = 1;
                                    relationship[term1+"__"+term2].maxMonth =m;
                                }    
                                if (!relationship[term1+"__"+term2][m])
                                    relationship[term1+"__"+term2][m] = 1;
                                else{
                                    relationship[term1+"__"+term2][m]++;
                                    if (relationship[term1+"__"+term2][m]>relationship[term1+"__"+term2].max){
                                        relationship[term1+"__"+term2].max = relationship[term1+"__"+term2][m];
                                        relationship[term1+"__"+term2].maxMonth =m; 
                                        
                                        if (relationship[term1+"__"+term2].max>relationshipMaxMax) // max over time
                                            relationshipMaxMax = relationship[term1+"__"+term2].max;
                                    }  
                                }    

                            }
                        }
                    }
                }
            }

    });
}

function computeConnectivity(a, num, cut) {
    for (var i = 0; i < num; i++) {
        a[i].isConnected = -100;
        a[i].isConnectedMaxMonth = a[i].maxMonth;
    }

    for (var i = 0; i < num; i++) {
        var term1 = a[i].term;
        for (var j = i + 1; j < num; j++) {
            var term2 = a[j].term;
            if (relationship[term1 + "__" + term2] && relationship[term1 + "__" + term2].max >= cut) {
                if (relationship[term1 + "__" + term2].max > a[i].isConnected) {
                    a[i].isConnected = relationship[term1 + "__" + term2].max;
                    a[i].isConnectedMaxMonth = relationship[term1 + "__" + term2].maxMonth;
                }
                if (relationship[term1 + "__" + term2].max > a[j].isConnected) {
                    a[j].isConnected = relationship[term1 + "__" + term2].max;
                    a[j].isConnectedMaxMonth = relationship[term1 + "__" + term2].maxMonth;
                }
            }
            else if (relationship[term2 + "__" + term1] && relationship[term2 + "__" + term1].max >= cut) {
                if (relationship[term2 + "__" + term1].max > a[i].isConnected) {
                    a[i].isConnected = relationship[term2 + "__" + term1].max;
                    a[i].isConnectedMaxMonth = relationship[term1 + "__" + term2].maxMonth;
                }
                if (relationship[term2 + "__" + term1].max > a[j].isConnected) {
                    a[j].isConnected = relationship[term2 + "__" + term1].max;
                    a[j].isConnectedMaxMonth = relationship[term1 + "__" + term2].maxMonth;
                }
            }
        }
    }
}

function computeNodes() {
    termArray2 = [];
    for (var i = 0; i < termArray.length; i++) {
        if (termList[termArray[i].term] != undefined)  // Filter the terms from force layouts in main2.js
            termArray2.push(termArray[i])
        if (termArray2.length >= 1000) break;        // Skip variables in the main screen since they are not important
    }
    var cut = valueSlider;
    computeConnectivity(termArray2, termArray2.length, cut);


    termArray3 = [];
    for (var i = 0; i < termArray2.length; i++) {
        if (termArray2[i].isSearchTerm || termArray2[i].isConnected > 0)
            termArray3.push(termArray2[i]);
    }

    termArray3.sort(function (a, b) {
        if (a.isConnected < b.isConnected) {
            return 1;
        }
        else if (a.isConnected > b.isConnected) {
            return -1;
        }
        else {
            if (a.max < b.max) {
                return 1;
            }
            if (a.max > b.max) {
                return -1;
            }
            return 0;
        }
    });

    computeConnectivity(termArray3, termArray3.length, cut);

    nodes = [];
    for (var i = 0; i < termArray3.length && i < numNode; i++) {
        var nod = new Object();
        nod.id = i;
        nod.group = termArray3[i].category;
        nod.name = termArray3[i].term;
        nod.max = termArray3[i].max;
        var maxMonthRelationship = termArray3[i].maxMonth;
        nod.isConnectedMaxMonth = termArray3[i].isConnectedMaxMonth;
        nod.maxMonth = termArray3[i].isConnectedMaxMonth;
        nod.month = termArray3[i].isConnectedMaxMonth;
        nod.x = xStep + xScale(nod.month);   // 2016 initialize x position
        nod.y = height / 2;
        if (nodeY_byName[nod.name] != undefined)
            nod.y = nodeY_byName[nod.name];

        if (termArray3[i].isSearchTerm) {
            nod.isSearchTerm = 1;
            if (!nod.month)
                nod.month = termArray3[i].maxMonth;
            if (!nod.isConnectedMaxMonth)
                nod.isConnectedMaxMonth = termArray3[i].maxMonth;
        }

        if (!maxCount[nod.group] || nod.max > maxCount[nod.group])
            maxCount[nod.group] = nod.max;

        if (termArray3[i].isConnected > 0)  // Only allow connected items
            nodes.push(nod);
    }
    numNode = nodes.length;

    console.log("numNode=" + numNode + " termArray3.length=" + termArray3.length);


    // compute the monthly data
    termMaxMax2 = 0;
    for (var i = 0; i < numNode; i++) {
        nodes[i].monthly = [];
        for (var m = 0; m < numMonth; m++) {
            var mon = new Object();
            if (terms[nodes[i].name][m]) {
                mon.value = terms[nodes[i].name][m];
                if (mon.value > termMaxMax2)
                    termMaxMax2 = mon.value;
                mon.monthId = m;
                mon.yNode = nodes[i].y;
                nodes[i].monthly.push(mon);
            }
        }
        // Add another item to first
        if (nodes[i].monthly.length > 0) {
            var firstObj = nodes[i].monthly[0];
            if (firstObj.monthId > 0) {
                var mon = new Object();
                mon.value = 0;
                mon.monthId = firstObj.monthId - 1;
                mon.yNode = firstObj.yNode;
                nodes[i].monthly.unshift(mon);
            }

            // Add another item
            var lastObj = nodes[i].monthly[nodes[i].monthly.length - 1];
            if (lastObj.monthId < numMonth - 1) {
                var mon = new Object();
                mon.value = 0;
                mon.monthId = lastObj.monthId + 1;
                mon.yNode = lastObj.yNode;
                nodes[i].monthly.push(mon);
            }
        }
    }

    // Construct an array of only parent nodes
    pNodes = new Array(numNode); //nodes;
    for (var i = 0; i < numNode; i++) {
        pNodes[i] = nodes[i];
    }
}

function computeLinks() {
    links = [];
    relationshipMaxMax2 = 1;
    for (var i = 0; i < numNode; i++) {
        var term1 = nodes[i].name;
        for (var j = i + 1; j < numNode; j++) {
            var term2 = nodes[j].name;
            if (relationship[term1 + "__" + term2] && relationship[term1 + "__" + term2].max >= valueSlider) {
                for (var m = 1; m < numMonth; m++) {
                    if (relationship[term1 + "__" + term2][m] && relationship[term1 + "__" + term2][m] >= valueSlider) {              
                        if (relationship[term1 + "__" + term2][m] > relationshipMaxMax2)
                            relationshipMaxMax2 = relationship[term1 + "__" + term2][m];
                    }
                }
            }
        }
    }
}


$('#btnUpload').click(function () {
    var bar = document.getElementById('progBar'),
        fallback = document.getElementById('downloadProgress'),
        loaded = 0;

    var load = function () {
        loaded += 1;
        bar.value = loaded;

        /* The below will be visible if the progress tag is not supported */
        $(fallback).empty().append("HTML5 progress tag not supported: ");
        $('#progUpdate').empty().append(loaded + "% loaded");

        if (loaded == 100) {
            clearInterval(beginLoad);
            $('#progUpdate').empty().append("Upload Complete");
            console.log('Load was performed.');
        }
    };

    var beginLoad = setInterval(function () {
        load();
    }, 50);

});



function searchNode() {
    searchTerm = document.getElementById('search').value;
    valueSlider = 2;
    handle.attr("cx", xScaleSlider(valueSlider));

    recompute();
}

// check if a node for a month m already exist.
function isContainedChild(a, m) {
    if (a) {
        for (var i = 0; i < a.length; i++) {
            var index = a[i];
            if (nodes[index].month == m)
                return i;
        }
    }
    return -1;
}

// check if a node for a month m already exist.
function isContainedInteger(a, m) {
    if (a) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] == m)
                return i;
        }
    }
    return -1;
}

function linkArc(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy) / 2;
    if (d.source.y < d.target.y)
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr * 1.2 + " 0 0,1 " + d.target.x + "," + d.target.y;
    else
        return "M" + d.target.x + "," + d.target.y + "A" + dr + "," + dr * 1.2 + " 0 0,1 " + d.source.x + "," + d.source.y;
}



function updateTransition(durationTime) {
    updateTimeLegend();
    updateTimeBox(durationTime);
}

var statesGlobal = [];
var selectedStates = 0;
var count=0;
var cheio=false;
var indice=0;


var arrivals=true;
var departures=false;
var cancellations=false;
var delays=false;

var four=true;
var christmas=false;
var thanksgiving=false;

var range1="#DCDCDC";
var range2="#4775d1";
var range3="#4169E1";
var range4="#2e5cb8";

var highColor='#4169E1';
var lowColor="#DCDCDC";



var chordData= new Array();
var usaData= new Array();
var year_from = "2013";
var year_to = "2017";
var month_from =1;
var month_to =12;

var summ_data = "data/ARRIVALS_GROUPBY.CSV";

var usaMap ="data/arrivals_usaMap.csv"; 
var chord_data = 'data/chord_diagram_data.csv';

///////////////////// UPDATE FUNCTIONS /////////////////////////////
var updateGraphsSlider = function(date1,date2) {

  var months = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6, "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12}  

  year_from =  date1.substring(3).trim();
  year_to = date2.substring(3).trim();

  month_from = months[date1.substring(0,3)];
  month_to =  months[date2.substring(0,3)];

  gen_chord(year_from,year_to);
  gen_vis();
}

var updateGraphFilters = function(arrivals,departures,cancellations,delays){

  arrivals = arrivals;
  departures = departures;
  cancellations = cancellations;
  delays = delays;

  if (arrivals) {
    summ_data = "data/ARRIVALS_GROUPBY.CSV";
    usaMap = "data/arrivals_usaMap.csv";
    chord_data = 'data/chord_diagram_data.csv';
    gen_summ();
    gen_vis();
    gen_chord();
  } else if (departures) {
    summ_data = "data/departures_GROUPBY.CSV";
    usaMap = "data/departures_usaMap.csv";
    chord_data = 'data/chord_diagram_data.csv';

    gen_vis();
    gen_summ();
    gen_chord();
  } else if (cancellations) {
    summ_data = "data/lines_cancellations.csv";
    usaMap = "data/choropleth_cancellations.csv";
    chord_data = "data/chord_cancelled_FLIGHTS.csv" 
    gen_vis();
    gen_summ();
    gen_chord();
  } else if (delays) {
    summ_data = "data/lines_delays.csv";
    usaMap = "data/choropleth_delays.csv";
    chord_data ="data/chord_delayed_FLIGHTS.csv" 
    gen_vis();
    gen_summ();
    gen_chord();
  } 

  
}

//// FUTURE WORK ///////////////
var updateGraphFiltersHoliday = function(four,christmas,thanksgiving)
{  
  four=four;
  christmas=christmas;
  thanksgiving=thanksgiving;

  if(four)
  {
    if(arrivals){
      usaMap="data/holidaysFiltersChoropleth/choropleth_ARRIVALS_4th.csv"
      //summ_data=""
      chord_data = 'data/chord_diagram_data.csv';
       gen_vis();
       gen_chord();
    //gen_summ();
    }  
    else if(departures){
      usaMap="data/holidaysFiltersChoropleth/choropleth_DEPARTURES_4th.csv"
      //summ_data=""
      chord_data = 'data/chord_diagram_data.csv';
       gen_vis();
       gen_chord();
    //gen_summ();
  }
    else if(delays){
      usaMap="data/holidaysFiltersChoropleth/choropleth_DELAYS_4th.csv"
      //summ_data=""
      //chord_data = 
       gen_vis();
    //gen_summ();
    //gen_chord();
  }
    else if(cancellations){
      usaMap="data/holidaysFiltersChoropleth/choropleth_CANCELLATIONS_4th.csv"
      //summ_data=""
      //chord_data = 
       gen_vis();
    //gen_summ();
    //gen_chord();
  } 

  }
  else if(christmas)
  {
    if(arrivals){
      usaMap="data/holidaysFiltersChoropleth/choropleth_ARRIVALS_christmas.csv"
      //summ_data=""
      chord_data = 'data/chord_diagram_data.csv';
       gen_vis();
       gen_chord();
    //gen_summ();
  }
    else if(departures){
      usaMap="data/holidaysFiltersChoropleth/choropleth_DEPARTURES_christmas.csv"
      //summ_data=""
      chord_data = 'data/chord_diagram_data.csv';
       gen_vis();
       gen_chord();
    //gen_summ();
  }
    else if(delays){
      usaMap="data/holidaysFiltersChoropleth/choropleth_DELAYS_christmas.csv"
      //summ_data=""
      //chord_data = 
       gen_vis();
    //gen_summ();
    //gen_chord();
  }
    else if(cancellations){
      usaMap="data/holidaysFiltersChoropleth/choropleth_CANCELLATIONS_christmas.csv"
      //summ_data=""
      //add chord map
      //chord_data = 
       gen_vis();
    //gen_summ();
    //gen_chord();
  }
  }
  else if(thanksgiving)
  {
    if(arrivals){
      usaMap="data/holidaysFiltersChoropleth/choropleth_ARRIVALS_thanksgiving.csv"
      //summ_data=""
      chord_data = 'data/chord_diagram_data.csv';
       gen_vis();
       gen_chord();
    //gen_summ();
  }
    else if(departures){
      usaMap="data/holidaysFiltersChoropleth/choropleth_DEPARTURES_thanksgiving.csv"
      //summ_data=""
      chord_data = 'data/chord_diagram_data.csv';
       gen_vis();
       gen_chord();
    //gen_summ();
  }
    else if(delays){
      usaMap="data/holidaysFiltersChoropleth/choropleth_DELAYS_thanksgiving.csv"
      //summ_data=""
      //chord_data = 
       gen_vis();
    //gen_summ();
    //gen_chord();
  }
    else if(cancellations){
      usaMap="data/holidaysFiltersChoropleth/choropleth_CANCELLATIONS_thanksgiving.csv"
      //summ_data=""
      //chord_data = 
       gen_vis();
    //gen_summ();
    //gen_chord();
  }

  }
  else
    updateGraphFilters(arrivals,departures,cancellations,delays);


}

gen_vis();
gen_chord();
gen_map();


function gen_vis() {
  while (document.getElementById("vis").firstChild) {
    document.getElementById("vis").removeChild(document.getElementById("vis").firstChild);
}
//**************************************************
//  CREATE CHOROPLETH
//**************************************************
  var width = 530;
  var height = 365;



    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-5, 0])
        .html(function(d) {
          var dataRow = dataset.get(d.properties.name);          
             if (dataRow) {
                 return d.properties.name + ": " + dataRow;
             } else {
                return d.properties.name + ": No data.";
             }
        })

    var svg = d3.select('.vis').append('svg')
        .attr('width', width)
        .attr('height', height);

    svg.call(tip);

    var projection = d3.geo.albersUsa()
      .translate([width/2+10, height/2]) // translate to center of screen
      .scale([580]); // scale things down so see entire US

    var path = d3.geo.path()
        .projection(projection);


    var colorScale = d3.scale.linear().range([highColor, lowColor]).interpolate(d3.interpolateLab);

      // we use queue because we have 2 data files to load.  
    queue()
        .defer(d3.json, "data/usa.json")
        .defer(d3.csv, usaMap)     // process    
        .await(loaded);

    var dataset = d3.map();

        d3.csv(usaMap, function(error, data) {
      data.forEach(function (d){
          if(d.TOTAL_FLIGHTS != "" && d.MONTH != ""){
              d.TOTAL_FLIGHTS = parseInt(d.TOTAL_FLIGHTS)
              d.MONTH  = parseInt(d.MONTH);
              usaData.push(d);
             } 

      })});


      function getColor(d) {

        var dataRow = dataset.get(d.properties.name);          
          if (dataRow) {
              return colorScale(dataRow);
          } else {
              return "#ccc";
          }
      }


    function loaded(error, usa, flights) {

       for(var i in flights){
            if(flights[i].TOTAL_FLIGHTS != "" && flights[i].MONTH != ""){
                flights[i].TOTAL_FLIGHTS = parseInt(flights[i].TOTAL_FLIGHTS)
                flights[i].MONTH  = parseInt(flights[i].MONTH);
        }
      }
      var data = flights.filter(element => (element['YEAR'] >=year_from && element['YEAR'] <= year_to) && (element['MONTH'] >=month_from && element['MONTH'] <= month_to));

      data = alasql('SELECT STATE,SUM(TOTAL_FLIGHTS) as TOTAL_FLIGHTS FROM ? GROUP BY STATE',[data]);

      for (i in data)
        dataset.set(data[i].STATE, data[i].TOTAL_FLIGHTS);  
   

      colorScale.domain(d3.extent(data, function(d) {return +d.TOTAL_FLIGHTS;}));
        

        var states = topojson.feature(usa, usa.objects.units).features;

            var us = svg.selectAll('path.states')
            .data(states)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .attr('id', function(d) {
              var id = d.properties.name;
              return id.replace(/\s+/g, '');
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr('fill', function(d,i) {
                return getColor(d);
            })
            .on('click', function(d,i) {
              if (count == 4) {
                cheio=true;
                ;
              } 

              for(var i=0; i<statesGlobal.length; i++) {
                if(statesGlobal[i]==d.properties.name.replace(/\s+/g, '')){
                  d3.select('#'+ statesGlobal[i]).style("stroke","white").style("stroke-width","1px");;
                  d3.select('#' + statesGlobal[i] + '2013').style("stroke","none");
                  d3.select('#' + statesGlobal[i] + '2014').style("stroke","none");
                  d3.select('#' + statesGlobal[i] + '2015').style("stroke","none");
                  d3.select('#' + statesGlobal[i] + '2016').style("stroke","none");
                  d3.select('#' + statesGlobal[i] + '2017').style("stroke","none");

                  delete statesGlobal[i];
                  count--;
                  cheio=false;
                  gen_summ();
                  return;
                }
              } 

              if(cheio == true) {
                return;
              }

              statesGlobal[selectedStates]=d.properties.name.replace(/\s+/g, '');
              d3.select(this).style("stroke","orange").style("stroke-width","3px");

              d3.select('#' + d.properties.name.replace(/\s+/g, '') + '2013').style("stroke","orange").style("stroke-width","1px");
              d3.select('#' + d.properties.name.replace(/\s+/g, '') + '2014').style("stroke","orange").style("stroke-width","1px");
              d3.select('#' + d.properties.name.replace(/\s+/g, '') + '2015').style("stroke","orange").style("stroke-width","1px");
              d3.select('#' + d.properties.name.replace(/\s+/g, '') + '2016').style("stroke","orange").style("stroke-width","1px");
              d3.select('#' + d.properties.name.replace(/\s+/g, '') + '2017').style("stroke","orange").style("stroke-width","1px");

              count++;
              gen_summ();              
              selectedStates++              
            });



         // add a legend
        var w = 360, h = 200;

        var key = svg
          .append("svg")
          .attr("width", h)
          .attr("height", w)
          .attr("class", "legend");

        var legend = key.append("defs")
          .append("svg:linearGradient")
          .attr("id", "gradient")
          .attr("x1", "100%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "65%")
          .attr("spreadMethod", "pad");

        legend.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", highColor)
          .attr("stop-opacity", 1);
            
        legend.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", lowColor)
          .attr("stop-opacity", 1);

        key.append("rect")
          .attr("width", 20)
          .attr("height", w-25)
          .style("fill", "url(#gradient)")
          .attr("transform", "translate(5,5)");

        var y = d3.scale.linear()
          .range([5, w-20])
          .domain([0, 2200000]);

        var yAxis = d3.svg.axis().scale(y).ticks(6);

        key.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(25,0)rotate(90)")
          .style("fill", "white)")
          .call(yAxis);

    if(arrivals || delays || cancellations || departures) {
      for (var i = 0; i < statesGlobal.length; i++) {
              d3.select('#'+statesGlobal[i]).style("stroke","orange").style("stroke-width","3px");
      }
    }

    }

}


function gen_map() {
//************************************************
//  CREATE HEATMAP
//************************************************    
    while (document.getElementById("heatmap").firstChild) {
    document.getElementById("heatmap").removeChild(document.getElementById("heatmap").firstChild);
}
    var itemSize = 11,
          cellSize = itemSize - 1,
          margin = {top: 50, right: 20, bottom: 20, left: 90};
          
      var width_1 = 600 - margin.right - margin.left,
          height_1 = 200 - margin.top - margin.bottom;

      var lowColorMAP = "#24478f";
      var highColorMAP = '#DCDCDC';

      d3.csv('data/process_count1.csv', function ( response ) {

        var data = response.map(function( item ) {
            var newItem = {};
            newItem.year = item.x_year;
            newItem.state = item.y_state;
            newItem.count = item.value;

            return newItem;
        })

        var x_elements = d3.set(data.map(function( item ) { return item.year; } )).values(),
            y_elements = d3.set(data.map(function( item ) { return item.state; } )).values();

        var xScale = d3.scale.ordinal()
            .domain(x_elements)
            .rangeBands([0, x_elements.length * itemSize]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(function (d) {
                return d;
            }).orient("top");
             

        var yScale = d3.scale.ordinal()
            .domain(y_elements)
            .rangeBands([0, y_elements.length * itemSize]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .tickFormat(function (d) {
                return d;
            }).orient("left");
         

        var colorScale = d3.scale.threshold()
            .domain([10000, 50000, 100000, 250000, 500000])
            .range([highColorMAP, "#99b3e6", "#4775d1","#2e5cb8",  "#4169E1", lowColorMAP]);

        var svg = d3.select('.heatmap')
            .append("svg")
            .attr("height", width_1 + margin.left + margin.right)
            .attr("width", 200 + margin.top)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");          ;

        var cells = svg.selectAll('rect')
            .data(data)
            .enter().append('g').append('rect')
            .attr('class', 'cell')
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('y', function(d) { return yScale(d.state); })
            .attr('x', function(d) { return xScale(d.year); })
            .attr("rx",3)
            .attr("rx",3)
            .attr('id', function(d) {
              var id = y_elements[yScale(d.state)/itemSize].trim() + x_elements[xScale(d.year)/itemSize];
              return id.replace(/\s+/g, '');
            })
            .attr('fill', function(d) { return colorScale(d.count); })
            .on("click", clickHM);

            function clickHM(d) {
            var auxiliar, auxiliar2;

             if(count == 4) {
                cheio=true;
                ;
              }

              for (var i = 0; i < statesGlobal.length; i++) {
                if (statesGlobal[i] == y_elements[yScale(d.state)/itemSize].trim().replace(/\s+/g, '')) {
                  auxiliar = d3.select(this)[0][0].id;
                  auxiliar2 = auxiliar.substring(0, auxiliar.length-4);
                  d3.select('#' + auxiliar2 + '2013').style("stroke","none");
                  d3.select('#' + auxiliar2 + '2014').style("stroke","none");
                  d3.select('#' + auxiliar2 + '2015').style("stroke","none");
                  d3.select('#' + auxiliar2 + '2016').style("stroke","none");
                  d3.select('#' + auxiliar2 + '2017').style("stroke","none");
                  d3.select('#' + auxiliar2).style("stroke","white").style("stroke-width","1px");
                  delete statesGlobal[i];
                  count--;
                  cheio=false;
                  gen_summ();
                  return 0;
                }
              }  

              if(cheio == true) {
                return;
              }

              statesGlobal[selectedStates]=y_elements[yScale(d.state)/itemSize].trim().replace(/\s+/g, '');
              auxiliar = d3.select(this)[0][0].id;
              auxiliar2 = auxiliar.substring(0, auxiliar.length-4);

              d3.select('#' + auxiliar2 + '2013').style("stroke","orange").style("stroke-width","1px");
              d3.select('#' + auxiliar2 + '2014').style("stroke","orange").style("stroke-width","1px");
              d3.select('#' + auxiliar2 + '2015').style("stroke","orange").style("stroke-width","1px");
              d3.select('#' + auxiliar2 + '2016').style("stroke","orange").style("stroke-width","1px");
              d3.select('#' + auxiliar2 + '2017').style("stroke","orange").style("stroke-width","1px");
              d3.select('#' + auxiliar2).style("stroke","orange").style("stroke-width","3px");
              selectedStates++;
              count++;
              gen_summ();
            };
        
        // tooltip
        tooltip=d3.select("body").append("div").style("background","#A9A9A9")
        .style("opacity","1").style("position","absolute").style("border-radius","5px").style("visibility","hidden")
        .style("box-shadow","0px 0px 6px #7861A5").style("padding","10px");
        
        toolval=tooltip.append("div");
        
        // selection of cells     
        cells.on("mouseover",function(d){
           d3.select(this).style("opacity","0.7");
       });

        //unselection of cells  
        cells.on("mouseout",function(){
            d3.select(this).style("opacity","1");
            tooltip.style("visibility","hidden");});

        cells.on("mousemove",function(d){
            tooltip.style("visibility","visible")
            .style("top",(d3.event.pageY-30)+"px").style("left",(d3.event.pageX+20)+"px");
            
            tooltip.select("div").html(d.year+" in "+d.state+ "<br>"+(+d.count) + " Flights").style("color", "white")
            
        });

        //LEGENDA

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll('text')
            .attr('font-weight', 'normal')
            .attr('color','white');

        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis)
            .selectAll('text')
            .attr('font-weight', 'normal')
            .style("text-anchor", "start")
            .attr("dx", ".8em")
            .attr("dy", ".5em")
            .attr("transform", function (d) {
                return "rotate(-50)";
            });

      });
}

function gen_chord(year_from=2013, year_to=2017) {

   while (document.getElementById("chord_d").firstChild) {
    document.getElementById("chord_d").removeChild(document.getElementById("chord_d").firstChild);
}

//***************************************
//  CREATE CHORD
//****************************************
    

        d3.csv(chord_data, function (error, data) {

        chordData = data;
        for(var i in chordData){
            if(chordData[i].TOTAL_FLIGHTS != ""){
                chordData[i].TOTAL_FLIGHTS = parseInt(chordData[i].TOTAL_FLIGHTS);
        }
      }
      
      var data1 =  chordData.filter(element => (element['YEAR'] >=year_from && element['YEAR'] <= year_to));

      data1 = alasql('SELECT ORIGIN_STATE_NM, DEST_STATE_NM, SUM(TOTAL_FLIGHTS) as TOTAL_FLIGHTS FROM ? GROUP BY ORIGIN_STATE_NM,DEST_STATE_NM',[data1]);

      var mpr = chordMpr(data1);
        mpr
          .addValuesToMap('ORIGIN_STATE_NM')
          .setFilter(function (row, a, b) {
            return (row.ORIGIN_STATE_NM === a.name && row.DEST_STATE_NM === b.name);
          })
          .setAccessor(function (recs, a, b) {
            if (!recs[0]) return 0;
            return +recs[0].TOTAL_FLIGHTS;
          });
        drawChords(mpr.getMatrix(), mpr.getMap());
      
      })
   

      //*******************************************************************
      //  DRAW THE CHORD DIAGRAM
      //*******************************************************************
       function drawChords (matrix, mmap) {
        var w = 500, h = 500, r1 = h / 2, r0 = r1 - 100;
        var fill = d3.scale.ordinal()
            .domain(d3.range(4))
           .range([range1, range2, range3, range4]);
        var chord = d3.layout.chord()
            .padding(.02)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);
        var arc = d3.svg.arc()
            .innerRadius(r0)
            .outerRadius(r0 + 20);
        var svg = d3.select("#chord_d").append("svg:svg")
            .attr("width", w)
            .attr("height", h)
          .append("svg:g")
            .attr("id", "circle")
            .attr("transform", "translate(" + w/2 +"," + h/2+")");
            svg.append("circle")
                .attr("r", r0 + 20);
        var rdr = chordRdr(matrix, mmap);
        chord.matrix(matrix);
        var g = svg.selectAll("g.group")
          .data(chord.groups())
          .enter().append("svg:g")
            .attr("class", "group")
            .on("mouseover", mouseover)
            .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
        g.append("svg:path")
            .style("stroke", "black")
            .style("fill", function(d) { return fill(d.index); })
            .attr("d", arc);
        g.append("svg:text")
            .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
            .style("font-family", "arial, helvetica, sans-serif")
            .style("font-size", "10px")
            .style("fill","#f1f1f1")
            .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
            .attr("transform", function(d) {
              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                  + "translate(" + (r0 + 26) + ")"
                  + (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .text(function(d) { return rdr(d).gname; });
          var chordPaths = svg.selectAll("path.chord")
                .data(chord.chords())
              .enter().append("svg:path")
                .attr("class", "chord")
                .style("stroke", function(d) { return d3.rgb(fill(d.target.index)).darker(); })
                .style("fill", function(d) { return fill(d.target.index); })
                .attr("d", d3.svg.chord().radius(r0))
                .on("mouseover", function (d) {
                  d3.select("#tooltip")
                    .style("visibility", "visible")
                    .html(chordTip(rdr(d)))
                    .style("top", function () { return (d3.event.pageY - 100)+"px"})
                    .style("left", function () { return (d3.event.pageX - 100)+"px";})
                })
                .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
          function chordTip (d) {
            var p = d3.format(".2%"), q = d3.format(",.2r")
            return "Route Info:<br/>"
              + p(d.svalue/d.stotal) + " (" + q(d.svalue) + ") of "
              + d.sname + " flies to " + d.tname
              + (d.sname === d.tname ? "": ("<br/>while...<br/>"
              + p(d.tvalue/d.ttotal) + " (" + q(d.tvalue) + ") of "
              + d.tname + " flies to " + d.sname))
          }
          function groupTip (d) {
            var p = d3.format(".1%"), q = d3.format(".1")
            return "State Info:<br/>"
                + d.gname + " : " + q(d.gvalue) + "<br/>"
                + p(d.gvalue/d.mtotal) + " of Matrix Total (" + q(d.mtotal) + ")"
          }
          function mouseover(d, i) {
            d3.select("#tooltip")
              .style("visibility", "visible")
              .html(groupTip(rdr(d)))
              .style("top", function () { return (d3.event.pageY - 80)+"px"})
              .style("left", function () { return (d3.event.pageX - 130)+"px";})
            chordPaths.classed("fade", function(p) {
              return p.source.index != i
                  && p.target.index != i;
            });
          }
      }
}

function gen_summ() {
if (count <= 1) {
    while (document.getElementById("summ").firstChild) {
      document.getElementById("summ").removeChild(document.getElementById("summ").firstChild);
    }  

    if (count == 1) {
    	document.getElementById("flight_sum").style.visibility='visible';
    	var estado = statesGlobal.filter(function (el) { return el != null; });

		/// SELECTED STATE
		document.getElementById("#state_seleccionado").innerHTML = estado;
		
		/// NUM FLIGHTS
		var total_flights_now = 0;
		d3.csv('data/process_count1.csv', function ( response ) {

	        var data = response.map(function( item ) {
	            var newItem = {};
	            newItem.year = item.x_year;
	            newItem.state = item.y_state.replace(/\s+/g, '');
	            newItem.count = parseInt(item.value);

	            return newItem;
	        })

		    for (var i = 0; i < data.length; i++) {
		    	if (data[i].state == estado) {
		    		total_flights_now = total_flights_now + data[i].count;
		   		}
			}

			document.getElementById("#total_flights").innerHTML = total_flights_now + " Flights";
    	})


		
		/// TOP ROUTE
	    d3.csv('data/file_top_routes.csv', function ( response ) {

	        var data_routes = response.map(function( item ) {
	            var newItem = {};
	            newItem.origin = item.ORIGIN_STATE_NM;
	            newItem.dest = item.DEST_STATE_NM;
	            return newItem;
	     	})
	    
		    for (var i = 0; i < data_routes.length; i++) {
		    	if (data_routes[i].origin == estado) {
		    		var top_route_now = data_routes[i].dest;
		    	}
		    }

			document.getElementById("#top_route").innerHTML = top_route_now;
		})

		/// TOP AIRLINE
		d3.csv('data/airlines_sum.csv', function ( response ) {

          var data_airlines = response.map(function( item ) {
              var newItem = {};
              newItem.state = item.dest_state_nm_1;
              newItem.airline = item.AIRLINE;
              return newItem;
        })
      
        for (var i = 0; i < data_airlines.length; i++) {
          if (data_airlines[i].state == estado) {
            var airline_now = data_airlines[i].airline;
          }
        }

      document.getElementById("#top_airline").innerHTML = airline_now;
    })

		/// TOP DELAY
    d3.csv('data/delays_sum.csv', function ( response ) {

          var data_delays = response.map(function( item ) {
              var newItem = {};
              newItem.state = item.dest_state_nm_1;
              newItem.delays = item.DELAYED;
              return newItem;
        })
      
        for (var i = 0; i < data_delays.length; i++) {
          if (data_delays[i].state == estado) {
            var delays_now = data_delays[i].delays;
          }
        }

      document.getElementById("#top_delay").innerHTML = delays_now;
    })

		/// TOP CANCELLATION
    d3.csv('data/cancellations_sum.csv', function ( response ) {

          var data_cancel = response.map(function( item ) {
              var newItem = {};
              newItem.state = item.dest_state_nm_1;
              newItem.delays = item.CANCELLED;
              return newItem;
        })

        for (var i = 0; i < data_cancel.length; i++) {
          if (data_cancel[i].state == estado) {
            var delays_now = data_cancel[i].delays;
          }
        }

      document.getElementById("#top_cancellation").innerHTML = delays_now;
    })
	}

    if (count == 0) {
      document.getElementById("#state_seleccionado").innerHTML = "No Selected State";
      document.getElementById("#total_flights").innerHTML = "Total Number of Flights";
      document.getElementById("#top_route").innerHTML = "Top Route";
      document.getElementById("#top_airline").innerHTML = "Top Airline";
      document.getElementById("#top_delay").innerHTML = "Top Delay Reason";
      document.getElementById("#top_cancellation").innerHTML = "Top Cancellation Reason";

    }

    return;
  }

  else{
    while (document.getElementById("summ").firstChild) {
      document.getElementById("summ").removeChild(document.getElementById("summ").firstChild);
    }
    document.getElementById("flight_sum").style.visibility='hidden';
  }


// Set the dimensions of the canvas / graph
var margin = {top: 20, right: 50, bottom: 70, left: 60},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scale.linear().range([1, width]);
var y = d3.scale.log().range([height, 10]);
//var y = d3.scale.linear().range([height, 10]).nice();

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5).tickFormat(d3.format("d"));

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(7);

// Define the line
var priceline = d3.svg.line() 
    .x(function(d) { return x(d.YEAR); })
    .y(function(d) { return y(d.TOTAL_FLIGHTS); })
    .interpolate("linear");


// Adds the svg canvas
var svg = d3.select("#summ")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv(summ_data, function(error, data) {
    data.forEach(function(d) {
      d3.ascending
    });

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {
          for (var i = 0; i < statesGlobal.length; i++){
            if(d.STATE.replace(/\s+/g, '') == statesGlobal[i]) {
              return d.STATE;
            }
          }
        })
        .sortKeys(d3.ascending)
        .entries(data)
        .slice(0,count);


        // Scale the range of the data
    x.domain([2013, 2017]);
    y.domain([1, 700000]); 

    var color = d3.scale.category10();   // set the colour scale

    legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 

      // add line
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .attr("id", d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline(d.values))
            .attr("fill", "none");
            
        // Add the Legend
        svg.append("text")
            .attr("x", legendSpace/2+i*legendSpace)  // space legend
            .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", "legend")    // style the legend
            .style("fill", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .text(d.key);
    });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
        
    // Multi-line tooltip on mouse over
    var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

     // this is the black vertical line that follows the mouse
    mouseG.append("path")
      .attr("class", "mouse-line")
      .style("stroke", "white")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(data) //dataNest
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 2)
      .style("stroke", "white")
      .style('fill', 'white')
      .style("stroke-width", "0.5px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

     // append a rect to catch mouse movements on canvas
    mouseG.append('svg:rect')
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {

            var xDate = parseInt(x.invert(mouse[0])),
                idx = xDate-2013;

            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .text(function(d){ if((dataNest[i].values[idx].TOTAL_FLIGHTS) === "1") return "0";
                else return dataNest[i].values[idx].TOTAL_FLIGHTS;});
              console.log(dataNest);

            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });
  });
}
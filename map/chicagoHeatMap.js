

var heatMapVis = function(){
    var newHeatMap = {
        drawMap: function(svg, bottom, minPrice, maxPrice, parks, schools){
            
            d3.json(/*"https://dhruvkore.github.io/DataVisualization_FinalProject/map/chicago.json"*/"chicago.json", function(json) {

                //Loads heat map data from csv -- will work with any CSV where zip is first column
                d3.csv("https://dhruvkore.github.io/DataVisualization_FinalProject/map/Avg-SAT-by-Zip-Chi.csv", function(data){
                    var SATdict = {};
                    var rentDict={};
                    
                    var sats = [];
                    var rents = [];
                    for(d=0; d < data.length; d++){
                        if(data[d].avgSAT === "null"){}
                        else{sats.push(data[d].avgSAT);}
                        rents.push(data[d].MedGrossRent)
                        SATdict[data[d].zip] = data[d].avgSAT;
                        rentDict[data[d].zip] = data[d].MedGrossRent;
                    }

                    var rating = function(/*minPrice, maxPrice, parks, minSAT, schools,*/ zipcodeData){
                        var output = 0.0;
                        var medRent = rentDict[zipcodeData.properties.ZIP];
                        var avgSAT = SATdict[zipcodeData.properties.ZIP];
                        if(minPrice > /*zipcodeData.MedGrossRent*/ medRent || 
                            maxPrice < /*zipcodeData.MedGrossRent*/ medRent || 
                            bottom > /*zipcodeData.avgSAT*/ avgSAT){
                            return 0.0;
                        }
                        var value = 0.0;
                        if(parks == 1){value += zipcodeData.properties.parks;}
                        if(schools == 1){value += zipcodeData.properties.schools;}
                        value += ( avgSAT * 10 / 2400 ); /* arbitrary multiplier of 10 */
                        try{
                            if(medRent != null && medRent > 0){
                                output = value / medRent; /* Value per Dollar */
                            }
                        }
                        catch(err){
                            return 0.0;
                        }
                        return output;
                    }

                    var maxSAT = Math.max(...sats);
                    var minSAT = Math.min(...sats);

                    var maxRent = Math.max(...rents);
                    var minRent = Math.min(...rents);

                    console.log(sats)
                    console.log(`MAX SAT: ${maxSAT}`)
                    console.log(`MIN SAT: ${minSAT}`)
                    console.log(`MAX RENT: ${maxRent}`)
                    console.log(`MIN RENT: ${minRent}`)

                svg.selectAll(".path").remove();

                // //Width and height
                var width = +svg.attr("width");
                var height = +svg.attr("height");

                // create a first guess for the projection
                var center = d3.geoCentroid(json)
                var scale = 150;
                var projection = d3.geoMercator().scale(scale).center(center);
                //Define path generator
                var path = d3.geoPath()
                                .projection(projection);

                // using the path determine the bounds of the current map and use
                // these to determine better values for the scale and translation
                var bounds = path.bounds(json);
                var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
                var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
                var scale = (hscale < vscale) ? hscale : vscale;
                var offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
                                height - (bounds[0][1] + bounds[1][1]) / 2];

                // new projection
                projection = d3.geoMercator().center(center)
                .scale(scale * 0.9).translate(offset);
                path = path.projection(projection);

                //Create SVG element
                svg = d3.select("#chart")
                        .attr("width", width)
                        .attr("height", height)


                //Bind data and create one path per GeoJSON feature
                svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("id", function(d){
                    return d.properties.ZIP
                })
                .attr("class", "path")
                .attr("rating", function(d){
                    return rating(d);
                })
                .attr("sat", function(d){
                    return SATdict[d.properties.ZIP];
                })
                .attr("fill", function(d){
                    var val = (rentDict[d.properties.ZIP]-minRent)/(maxRent - minRent);  //TODO: replace this rating function
                    if(rentDict[d.properties.ZIP] > maxPrice || 
                        rentDict[d.properties.ZIP] < minPrice ||
                        SATdict[d.properties.ZIP] < bottom
                        ){
                        return 'rgb(150,150,150)'
                    }else{
                    var red = (0 * val);
                    var blue = (0 * val);
                    var green = (255 * val);
                    return `rgb(${Math.floor(red)}, ${Math.floor(green)}, ${Math.floor(blue)})`;
                    }
                })
                .on("click", function(d){newHeatMap.dispatch.call("selected", {}, SATdict[d.properties.ZIP]);});
                

            });
                

            });
        },

        dispatch: d3.dispatch("selected")
    }
    return newHeatMap;
}
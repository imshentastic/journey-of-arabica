document.addEventListener("DOMContentLoaded", () => {

    //TESTING
    
    let margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = document.getElementById("scatterZoom").clientWidth - margin.left - margin.right,
        height = document.getElementById("scatterZoom").clientHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select("#scatterZoom")
        .append("svg")
            .attr("width", width + margin.top + margin.bottom)
            .attr("height", height + margin.top + margin.bottom)
            .attr('viewBox', `0 0 ${width+300} ${height}`)
            .attr('preserveAspectRatio', 'xMinYMid')
        .append("g")
            .attr("transform",
                `translate( ${margin.left}, ${margin.top} )`)
            .attr("class","transform")
    let x = d3.scaleLinear()
        // .domain([5.6, 9])
        .range([ 0, width ]);
    let xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        // .call(d3.axisBottom(x));
    let y = d3.scaleLinear()
        // .domain([6, 8.8])
        .range([ height, 0]);
    let yAxis = svg.append("g")
        // .attr("transform", "translate(0," + height + ")")
        // .call(d3.axisLeft(y));
    let xVar;
    let yVar;

    let allGroup = ["Aroma", "Flavor", "Aftertaste", "Acidity", "Body", "Balance"]
    let allGroup2 = [ "Flavor", "Aroma","Aftertaste", "Acidity", "Body", "Balance"]
    d3.select("#xSelection")
        .selectAll('myOptions')
            .data(allGroup)
        .enter()
            .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#ySelection")
        .selectAll('myOptions')
            .data(allGroup2)
        .enter()
            .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; })

    function update (xInput, yInput) {
        
        if (xInput) xVar = xInput;
        
        if (yInput) yVar = yInput;

        d3.csv("/assets/data/arabica-data.csv", function(data) {

            //Axes
            let pad = 0.3;
            x.domain( [d3.min(data,function(d) {return +d[xVar]})-pad, d3.max(data,function(d) {return +d[xVar]})+pad])
            xAxis.transition().duration(1000).call(d3.axisBottom(x))

            y.domain( [d3.min(data,function(d) {return +d[yVar]})-pad, d3.max(data,function(d) {return +d[yVar]})+pad])
            yAxis.transition().duration(1000).call(d3.axisLeft(y))
            svg.append("text")
                .attr("class","svgTitle")
                .attr("text-anchor","start")
                .attr("x", width/3.2)
                .attr("y", "-40")
                .style("font-size","45px")
                .text("Arabica Coffee Bean Rating")
            svg.append("text")
                .attr("class","svgTitle")
                .attr("text-anchor","start")
                .attr("x", width/2.5)
                .attr("y", "-5px")
                .text("by Coffee Quality Institute")
            svg.append("text")
                .attr("class","axisLabel")
                .attr("text-anchor","end")
                .attr("x", width/2)
                .attr("y", height+50)
                .text(xVar)

            svg.append("text")
                .attr("class","axisLabel")
                .attr("text-anchor","end")
                .attr("x", 60)
                .attr("y", -20)
                .text(yVar)
            // clipPath prevents drawing outside of svg width/height
            let clip = svg.append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width )  
                .attr("height", height )
                .attr("x", 0)
                .attr("y", 0);
                // let allgroups = ["Brazil", "China", "CostaRica", "ElSalvador", "Ethiopia", "Guatemala", "Honduras", "Indonesia", "Kenya", "Mexico", "Nicaragua", "Peru", "Taiwan", "Tanzania", "Thailand", "Uganda", "US-Hawaii", "Vietnam","Other" ]
                let allgroups = [
                    "Brazil",
                    "China",
                    "Colombia",
                    "CostaRica",
                    "Ethiopia",
                    "Guatemala",
                    "Honduras",
                    "Mexico",
                    "Taiwan",
                    "US-Hawaii" ]
            let color = d3.scaleOrdinal()
                .domain(allgroups)
                .range(d3.schemePaired)
                // .range(["#451e3e" ,"#fe4a49","#851e3e","#f6abb6", "#fe8a71", "#dec3c3", "#3da4ab", "#451e3e" ,"#fe4a49","#851e3e","#f6abb6", "#fe8a71", "#dec3c3", "#3da4ab", "#451e3e" ,"#fe4a49","#851e3e","#f6abb6", "#fe8a71", "#dec3c3", "#3da4ab", "#451e3e" ,"#fe4a49","#851e3e","#f6abb6", "#fe8a71", "#dec3c3", "#3da4ab"])
                // .range(["#BFC8D7" ,"#E2D2D2","#E3E2B4","#A2B59F", "#D18063", "#917B56", "#D1DFE8", "#909FA6" ,"#EEB8B8","#C9CBE0","#B57FB3", "#AEDDEF", "#B1D3C5", "#CFDD8E", "#6ECEDA" ,"#C7D6DB","#5F7DAF","#CE8467", "#DADAFC", "#dec3c3", "#3da4ab", "#451e3e" ,"#fe4a49","#851e3e","#f6abb6", "#fe8a71", "#dec3c3", "#3da4ab"])
            // let color = f(n)
            // color = d3.scaleSequential(d3.interpolateInferno)
            //     .domain([0,width])

            // color = d3.scaleOrdinal(d3.schemePaired).domain(d3.range(0, 20));
            // color = d3.scaleSequential(d3.interpolatePiYG).domain(d3.range(0,20))
            // color = d3.scaleLinear()
            // .domain(d3.range(0,20))
    // .interpolate(d3.interpolateRainbow(0.5))
      

                
            let dashColor = (d) => {
                return ColorLuminance(color(d.Country),-0.1)
            }

            let highlight = function(d){
                // reduce opacity of all groups
                d3.selectAll(".bubbles")
                    .transition()
                    .duration(100)
                    .style("opacity", .01)
                // expect the one that is hovered
                d3.selectAll("."+d)
                    .transition()
                    .delay(150)
                    .style("opacity", 0.8)
                    .style("stroke", dashColor)
                    .style("stroke-width","2px")
            }
            
            // And when it is not hovered anymore
            let noHighlight = function(d) {
                d3.selectAll(".bubbles")
                    .transition()
                    .delay(100)
                    .style("opacity", 0.4)
                d3.selectAll("."+d)
                    .style("opacity", 0.01)
                    .style("stroke", function(d){return(color(d.Country))})
            }

            let active = false;

            let size = 40;
            
            let legendTransformX = document.getElementById("scatterZoom").clientWidth / 1.05;

            svg.selectAll("myrect")
            .data(allgroups)
            .enter()
            .append("circle")
                .attr("cx", legendTransformX)
                .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", document.getElementById("scatterZoom").clientWidth * document.getElementById("scatterZoom").clientHeight/70000)
                .style("fill", function(d){ return color(d)})
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)
                // .on("click",staticToggle)

            // Add labels beside legend dots
            
            svg.selectAll("mylabels")
            .data(allgroups)
            .enter()
            .append("text")
                .attr("x", legendTransformX + size*.8)
                .attr("y", function(d,i){ return i * (size + 5) + (size/3)}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d){ return color(d)})
                .style("font-size","30px")
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)
                       
           
            

            // scatter letiable, to allow for both circles and brush
            let scatter = svg.append('g')
                .attr("clip-path", "url(#clip)")

                //tooltip invisible until opacity changed
            let tooltip = d3.select("#scatterZoom")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "grey")
                .style("border-radius", "5px")
                .style("padding", "8px")
                .style("color", "white")
                .style("width", "auto")
                .style("height", "auto")
                .style("position", "absolute")
                .style("text-align", "left")
                .style("font", "15px sans-serif")

            let showTooltip = function(d) {
                selectedCountry = d.Country

                d3.selectAll(".bubbles")
                    .transition().duration(80)
                    .style("opacity", 0.01)

                d3.selectAll("."+ selectedCountry)
                    .transition().duration(80)
                    .style("stroke", dashColor)
                    .style("opacity", 0.4)

                tooltip
                    .transition()
                    .duration(200)
                tooltip
                    .style("opacity", 1)
                    .html("Country: " + d.Country +`<br> ${xVar}: ` + d[xVar] +`<br> ${yVar}: ` + d[yVar])
                    .style("left", (document.getElementById("scatterZoom").clientWidth/5) + "px")
                    .style("top", (document.getElementById("scatterZoom").clientHeight/20) + "px")
            }
            
            let hideTooltip = function(d) {
                d3.selectAll(".bubbles")
                    .transition().duration(80)
                    .style("stroke", function(d){return(color(d.Country))})
                    .style("opacity", 0.4)

                tooltip
                    .transition()
                    .duration(100)
                    .style("opacity", 0)
            }

            let zoom = d3.zoom()
                .scaleExtent([.5, 20])  //unzoom and zoom
                .extent([[0, 0], [width, height]])
                .on("zoom", updateChart);
            
            //new test!!!!!
            let j = scatter.selectAll("dot")
                .data(data)

            j.enter()
                .append("circle")
                .attr("class", function(d) { return "bubbles " + d.Country })
                .merge(j)
                .on("mouseover", showTooltip )
                .on("mouseleave", hideTooltip )
                .transition().duration(400)
                .attr("cx", function (d) { return x(d[xVar]); } )
                .attr("cy", function (d) { return y(d[yVar]); } )
                .attr("r", document.getElementById("scatterZoom").clientWidth * document.getElementById("scatterZoom").clientHeight/90000)

                
                .style("fill", function (d) { return color(d.Country) } )
                .style("opacity", 0.8)
                

            // j.exit().remove();
            //  svg.selectAll("circle").remove();
    

            d3.select('svg').call(zoom);

            // d3.select("#scatterZoom").append("button")
            //     .text("change data")
            //     .on("click", function (){

            //     })

            
                
            function updateChart() {
                let newX = d3.event.transform.rescaleX(x);
                let newY = d3.event.transform.rescaleY(y);
                // update axes
                xAxis.call(d3.axisBottom(newX))
                yAxis.call(d3.axisLeft(newY))
                // update circle
                scatter
                    .selectAll("circle")
                    .attr('cx', function(d) {return newX(d[xVar])})
                    .attr('cy', function(d) {return newY(d[yVar])});
            }

            function ColorLuminance(hex, lum) {
                // validate hex string
                hex = String(hex).replace(/[^0-9a-f]/gi, '');
                if (hex.length < 6) {
                    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
                }
                lum = lum || 0;
                // convert to decimal and change luminosity
                var rgb = "#", c, i;
                for (i = 0; i < 3; i++) {
                    c = parseInt(hex.substr(i*2,2), 16);
                    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                    rgb += ("00"+c).substr(c.length);
                }
                return rgb;
            }

            // function updateSelection(selectedGroup) {
            //     doNotTrack.dat(dataFilter)
            //     .transition()
            //     .duration(1000)
            //     .attr("cx", function(d) { return x(+d[xVar]) })
            //     .attr("cy", function(d) { return y(+d.) })
            // }

            // d3.select("#reset").on("click", zoomOut);
            // var zoomy = d3v3.behavior.zoom()
            // function zoomOut() {
            //     // zoom.scale()
            //     zoomy.scale(zoomy.scale()/2)
            // }
            function remove() {

                svg.selectAll("circle").remove();
                svg.selectAll("mylabels").remove();
                svg.selectAll("myrect").remove();
                svg.selectAll(".axisLabel").remove();
            }

            d3.select("#xSelection").on("change", function(d) {
                // recover the option that has been chosen
                let selectedOption = d3.select(this).property("value")
                // run the updateChart function with this selected option
                remove()
                update(selectedOption, yVar)
            })
            d3.select("#ySelection").on("change", function(d) {
                // recover the option that has been chosen
                let selectedOption = d3.select(this).property("value")
                // run the updateChart function with this selected option
                remove()
                update(xVar,selectedOption)
            })

        

        })
    }

    
    update('Aroma','Flavor')
})
document.addEventListener("DOMContentLoaded", () => {


    
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
    
    //Axes
    let x = d3.scaleLinear()
        .domain([5.6, 9])
        .range([ 0, width ]);
    let xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    let y = d3.scaleLinear()
        .domain([6, 8.8])
        .range([ height, 0]);

    let yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    d3.csv("/assets/data/arabica-data.csv", function(data) {
        

        // clipPath prevents drawing outside of svg width/height
        let clip = svg.append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width )  
            .attr("height", height )
            .attr("x", 0)
            .attr("y", 0);

        let color = d3.scaleOrdinal()
            .domain(["Brazil", "China", "Colombia", "Costa Rica", "ElSalvador", "Ethiopia", "Guatemala", "Honduras", "Indonesia", "Kenya", "Mexico", "Nicaragua", "Peru", "Taiwan", "Tanzania", "Thailand", "Uganda", "US(Hawaii)", "Vietnam" ])
            .range(d3.schemeSet3)

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
            
        let dashColor = (d) => {
            return ColorLuminance(color(d.Country),-0.1)
        }

        let highlight = function(d){
            // reduce opacity of all groups
            d3.selectAll(".bubbles")
                .transition()
                .style("opacity", .01)
            // expect the one that is hovered
            d3.selectAll("."+d)
                .transition()
                .style("opacity", 1)
                .style("stroke", dashColor)
        }
        
        // And when it is not hovered anymore
        let noHighlight = function(d) {
            d3.selectAll(".bubbles")
                .style("opacity", 1)
            d3.selectAll("."+d)
                .style("opacity", 0.01)
                .style("stroke", "")
        }

        let size = 30;
        let allgroups = ["Brazil", "China", "Colombia", "Costa Rica", "ElSalvador", "Ethiopia", "Guatemala", "Honduras", "Indonesia", "Kenya", "Mexico", "Nicaragua", "Peru", "Taiwan", "Tanzania", "Thailand", "Uganda", "US(Hawaii)", "Vietnam" ]
        let legendTransformX = document.getElementById("scatterZoom").clientWidth / 1.05;
        console.log(`${document.getElementById("scatterZoom").clientWidth}`);

        svg.selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("circle")
            .attr("cx", legendTransformX)
            .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 9)
            .style("fill", function(d){ return color(d)})
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // Add labels beside legend dots
        svg.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
            .attr("x", legendTransformX + size*.8)
            .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
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
                .style("opacity", 1)

            tooltip
              .transition()
              .duration(200)
            tooltip
              .style("opacity", 1)
              .html("Country: " + d.Country +"<br> Acidity: " + d.Acidity+"<br> Aftertaste: " + d.Aftertaste)
              .style("left", (document.getElementById("scatterZoom").clientWidth/5) + "px")
              .style("top", (document.getElementById("scatterZoom").clientHeight/20) + "px")
          }
        // let moveTooltip = function(d) {
        // tooltip
        //     .style("left", (x(d.Acidity)) + "px")
        //     // console.log(x(d.Acidity))
        //     // console.log(d.Acidity)
        //     .style("top", (y(d.Aftertaste)) + "px")
        // }
        let hideTooltip = function(d) {
            d3.selectAll(".bubbles")
                .transition().duration(80)
                .style("stroke", function(d){return(color(d.Country))})
                .style("opacity", 1)

            tooltip
                .transition()
                .duration(100)
                .style("opacity", 0)
        }


        let zoom = d3.zoom()
            .scaleExtent([.5, 20])  //unzoom and zoom
            .extent([[0, 0], [width, height]])
            .on("zoom", updateChart);

        

        scatter.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("class", function(d) { return "bubbles " + d.Country })
                .attr("cx", function (d) { return x(d.Acidity); } )
                .attr("cy", function (d) { return y(d.Aftertaste); } )
                .attr("r", 13)
                .style("fill", function (d) { return color(d.Country) } )
                .style("opacity", 0.8)
                .on("mouseover", showTooltip )
                // .on("mousemove", moveTooltip )
                .on("mouseleave", hideTooltip )
            

            d3.select('svg').call(zoom);

            


            
        function updateChart() {
            let newX = d3.event.transform.rescaleX(x);
            let newY = d3.event.transform.rescaleY(y);
            // update axes
            xAxis.call(d3.axisBottom(newX))
            yAxis.call(d3.axisLeft(newY))
            // update circle
            scatter
                .selectAll("circle")
                .attr('cx', function(d) {return newX(d.Acidity)})
                .attr('cy', function(d) {return newY(d.Aftertaste)});
    }

    

    })
})
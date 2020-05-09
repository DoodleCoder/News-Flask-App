var wordReq = new XMLHttpRequest();
wordReq.open('GET', '/words', true);
wordReq.onreadystatechange = function() {
    if(wordReq.readyState == 4) {
        if(wordReq.status == 200) {
            var myWords = JSON.parse(wordReq.responseText);

            var layout = d3.layout.cloud()
                .size([280, 280])
                .words(myWords)
                .padding(6)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw);

            layout.start();

            function draw(words) {
            d3.select("#my_dataviz").append("svg")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .append("g")
                .attr("transform", "translate(" + 140 + "," + 140 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", "Impact")
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
            }
        }
    }
};
wordReq.send();
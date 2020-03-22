// Use 'd3.json' to import data
d3.json(`./static/samples.json`).then(function(data) {
    console.log(data)

    // Create dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    data.names.forEach(function(entry) {
        dropdownMenu.append('option').attr('value', entry).text(entry).property('value')
    });
        
    

    // Update page when a new ID is selected
    function updatePage(sample, id) {
        
        var sampData = d3.select(`#sample-metadata`);

        // Use .html to clear existing meta data
        sampData.html("");

        // Use 'Object.entries' to add each key and value
        Object.entries(sample).forEach(function([key, value]) {
            sampData.append('p').text(`${key}:${value}`)
            
        });

        // Creates bar chart of top ten OTUs

       var barData = [{
           x: id.sample_values.slice(0,10).reverse(),
           y: id.otu_ids.slice(0,10).reverse(),
           text: id.otu_labels.slice(0,10).reverse(),
           marker: {
               color: 'blue'},
           type:  'bar',
           orientation: 'h'          
        }]

        var barLayout = {
            title: "Top 10 OTU",
            yaxis:{autorange: true,
                type: 'category',
            }
        };

        Plotly.newPlot("bar", barData, barLayout, responsive = true);

        // Creates individual bubble chart of top ten OTUs
        var bubbleData = [{
            x: id.otu_ids,
            y: id.sample_values,
            mode: "markers",
            marker: {
                size: id.sample_values,
                color: id.otu_ids},
            text: id.otu_labels
        }]

        var bubbleLayout = {
            xaxis: {title:"OTU ID"},
            
        }

        Plotly.newPlot("bubble", bubbleData, bubbleLayout, responsive = true);

        var gaugeData = [
            {value: parseFloat(sample.wfreq),
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            rotation: 90,
            type: "indicator",
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
                    steps:[
                        { range: [0,1], color: '#ffffff' },
                        { range: [1,2], color: '#e6ffe6' },
                        { range: [2,3], color: '#ccffcc' },
                        { range: [3,4], color: '#b3ffb3' },
                        { range: [4,5], color: '#99ff99' },
                        { range: [5,6], color: '#80ff80' },
                        { range: [6,7], color: '#00b300' },
                        { range: [7,8], color: '#009900' },
                        { range: [8,9], color: '#008000' }
                    ],
                    text: [
                        "0-1",
                        "1-2",
                        "2-3",
                        "3-4",
                        "4-5",
                        "5-6",
                        "6-7",
                        "7-8",
                        "8-9"
                    ],
                    textinfo: "text",
                    texposition: "inside",

                }
                }
        ];
        var gaugeLayout = { width: 500, height: 400,  margin: { t: 20, b: 40 } 
        };

        Plotly.newPlot('gauge', gaugeData, gaugeLayout, responsive = true);

    };

    // Initialize the page with the default plot of the first individual
    function init(){
        var firstMetadata = data.metadata[0];
        var firstSample = data.samples[0];
        
        updatePage(firstMetadata, firstSample);

        // Update page when new ID is selected
        d3.selectAll("#selDataset").on("change", function(){
            var sample = data.metadata.find(element => element.id == this.value);
            var id = data.samples.find(element => element.id == this.value);
            
            updatePage(sample, id);
        });
    };

    init();
});

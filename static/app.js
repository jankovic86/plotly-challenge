function buildCharts(samples) {
    d3.json("data/samples.json").then(function (data) {
        var sample = data.samples;
        var results = sample.filter(sampleobject => sampleobject.id == samples);
        var finalresult = results[0]

        var ids = finalresult.otu_ids;
        var labels = finalresult.otu_labels;
        var values = finalresult.sample_values;

        var data = [
            {
                y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: values.slice(0, 10).reverse(),
                text: labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"

            }
        ];

        var layout = {
            title: "Top 10 OTU's Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", data, layout);

        var Layout = {
            margin: { t: 0 },
            xaxis: { title: "Id's" },
            hovermode: "closest",
        };

        var Data = [
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                    color: ids,
                    size: values,
                }
            }
        ];

        Plotly.plot("bubble", Data, Layout);

    });
}

function buildMetadata(samples) {
    d3.json("data/samples.json").then(function (data) {
        var metadata = data.metadata;
        var filtered = metadata.filter(sampleobject => sampleobject.id == samples);
        var result = filtered[0]
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key}: ${value}`);
        });
    });
}

function init() {
    var selector = d3.select("#selDataset");

    d3.json("data/samples.json").then(function (data) {
        var names = data.names;
        names.forEach(function (sample) {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        const firstSample = names[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}
init();
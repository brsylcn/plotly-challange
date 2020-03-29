function getBio(samples) {
    d3.json("samples.json").then((data) => {
        
        var metadata = data.metadata; //---> It gives us the whole data as Obj(array)

        //console.log(metadata)

        var metaData_filter = metadata.filter(meta => meta.id.toString() === samples)[0]; //---> Meta info filtered by ID       
        
        //console.log(metaData_filter)

        var demoTopanel = d3.select("#sample-metadata"); //---> Select panel to insert the data selected above
            
        demoTopanel.html(""); //---> empty the panel for each selection
    
        Object.entries(metaData_filter).forEach(([key, value]) => {   
            
            demoTopanel.append("h6").text(`${key}: ${value}`);    
        }); //---> grab the necessary data and append to the panel
    });
};

//**********************************************************************************************//
//Start plotting the chars --Bubble and Bar--

function charCreat(samples) {
    d3.json("samples.json").then((data) => {
        var bubble = data.samples;
        
        var id_fetch = bubble.filter(meta => meta.id.toString() == samples)[0]; //---> Bubble info filtered by ID  
        

        var ID_otu = id_fetch.otu_ids; //---> OTU IDs fetching by calling them with theri name "otu_ids"
        //console.log(ID_otu)
        var Label_otu = id_fetch.otu_labels; //---> same
        //console.log(Label_otu)
        var Value_sample = id_fetch.sample_values; //---> same
        //console.log(Value_sample)        
        
        var bubbleLayout = {
            //title: "Bacteria Bubble Char",
            xaxis:{title: "Bacteria Bubble Char"},
            height: 600,
            width: 1000
        };
        var bubbleData = [{ //---> bubble char data (use the vars that you created above)
            x: ID_otu, //---> x axis for id
            y: Value_sample, //---> y axis for value
            text: Label_otu, //---> label them
            mode: "markers",
            marker: {
                size: Value_sample, //---> size was tricky!!! set it by the values of the samples
                color: ID_otu} //---> color will be set differently by the IDs
        }];
        
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); //---> call your all plots
        
        //var metadata = data.metadata;
        //var get_id = micro_data.samples[0].otu_ids;
        //var getOTUtop = ( metadata.samples.otu_ids.slice(0, 10));
        //var otuId = getOTUtop.map(ID2 => `OTU ${ID2}`).reverse();

        var bar_ID = ID_otu.slice(0, 10).map(ID2 => `OTU ${ID2}`).reverse();
        //console.log(bar_ID)
        
        //!!!!!!!! IMPORTANT NOTE HERE: reverse works after slicing. That's why the vars above are trash.

        var barData = [{ 
            y: bar_ID,
            x: Value_sample.slice(0, 10).reverse(),
            text: Label_otu.slice(0, 10).reverse(),
            
            marker: {
                color: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", 
                "purple", "#8fb91f", "#4F4B61", "#D4BFAF", "#639378"]},
            type:"bar",
            orientation: "h"
            
        }];
        var barLayout = {
            title: "Top 10 OTU",
            margin: {
                t: 30,
                l: 150
            }
        };
        Plotly.newPlot("bar", barData, barLayout); //---> call your all plots
    
    });
};

//**********************************************************************************************//
// Initialize the whole dashbord

function init() {

    var dropdown = d3.select("#selDataset"); //---> selection added for the dropdown (REFERE :D)

    d3.json("samples.json").then((data) => { //---> I used the names of the samples to generate the options!!!
        
        var sampleNames = data.names;
        
        sampleNames.forEach((sample) => { //---> thanks google!!!
            dropdown
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        
        var firstSample = sampleNames[0]; //---> create a var and assign it to the first name of the sample
        charCreat(firstSample); //---> calling the first option
        getBio(firstSample);
        getGauge(firstSample); 
    });
}

function optionChanged(newSample) { //---> it helps us to fetch the new data when the new sample is selected

    charCreat(newSample);
    getBio(newSample);
    getGauge(newSample); 
}

init(); //---> Initialize
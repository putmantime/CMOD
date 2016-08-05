
var jbrowse_url;


var launch_jbrowse = function(taxid){

    var defaultCoords = "&tracklist=0&menu=0&loc=" + taxid + ":" +
                    "100000..200000&tracks=genes_canvas_mod";
                jbrowse_url = "JBrowse-1.12.1-dev/index.html?data=sparql_data/sparql_data_" + taxid;
                $('#jbrowse').html("<span><iframe src=" + jbrowse_url + defaultCoords + "></iframe> </span>");
};

var focus_jbrowse = function(coords){
    $('#jbrowse').html("<span><iframe src=" + jbrowse_url + coords + "></iframe> </span>");
    console.log(coords);
};


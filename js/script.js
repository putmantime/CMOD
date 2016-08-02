$(document).ready(function () {


    //populate organism search box using getOrgs() as source
    //and return taxid of selected organism
    $(function () {
        var currentTaxa = [];
        var currentGenes = [];

        $("#orgform").autocomplete({
            minLength: 0,
            source: getOrgs(),
            autoFocus: true,
            select: function (event, ui) {
                $('div.geneData').empty();
                $('div.proteinData').empty();
                currentTaxa = [ui.item.label, ui.item.taxid, ui.item.qid, ui.item.refseq];
                $("#orgform").val("");
                //add organism name to boxheader
                addOrgName(currentTaxa[0]);
                //add gene form to page header once an organism has been selected
                addGeneForm();
                //add organism data to organism box
                addOrgData(currentTaxa[1], currentTaxa[3], currentTaxa[2]);
                //launch jbrowse iframe with taxid as variable
                launch_jbrowse(currentTaxa[1]);
                //add go boxes to protein box
                addGoBoxes();
                //form for choosing and selecting a gene
                $(function () {
                    var geneData = getGenes(currentTaxa[1]);
                    $("#geneform").autocomplete({
                        minLength: 0,
                        source: geneData,
                        autoFocus: true,
                        delay: 500,
                        select: function (event, ui) {
                            //focus jbrowse on selected gene
                            var gstart = ui.item.genomicstart - 400;
                            var gend = ui.item.genomicend - (-400);
                            var coords = "&tracklist=0&menu=0&loc=" + currentTaxa[3]
                                + ":" + gstart + ".." + gend;
                            focus_jbrowse(coords);


                            $("#molfuncdata").html("");
                            $("#bioprocdata").html("");
                            $("#celcompdata").html("");
                            currentGenes = [ui.item.label, ui.item.id, ui.item.gqid];
                            //html input for gene and protein
                            addGeneProteinData(
                                ui.item.label,
                                ui.item.id,
                                ui.item.gqid,
                                ui.item.locustag,
                                ui.item.genomicstart,
                                ui.item.genomicend,
                                ui.item.pqid,
                                ui.item.proteinLabel,
                                ui.item.uniprot,
                                ui.item.refseqProtein);
                            //get goterms from separate sparql query
                            getGOTerms(ui.item.uniprot);
                            $("#geneform").val("");
                            return false;
                        }
                    })
                        .autocomplete("instance")._renderItem = function (ul, item) {
                        return $("<li>")
                            .append("<div style=\"border-bottom: solid black 1px\"><strong>" + item.label +
                            "</strong><br>Entrez ID:" + item.id + "<br>Wikidata: " + item.gqid + "</div>")
                            .appendTo(ul);
                    };
                });

                return false;
            }
        })
            .autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
                .append("<div style=\"border-bottom: solid black 1px\"><i><strong>" +
                item.label + "</strong></i><br>Taxid: " + item.taxid + "<br>Wikidata: " +
                item.qid + "</div>")
                .appendTo(ul);
        };


    });


});


$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var availableTags = [];
    var taxids = {};
    var jbrowse_url;
    var queryOrgs = [
        "SELECT ?species ?speciesLabel ?taxid ?RefSeq",
        "WHERE { ?species wdt:P171* wd:Q10876;",
        "wdt:P685 ?taxid; wdt:P2249 ?RefSeq.",
        "SERVICE wikibase:label {",
        "bd:serviceParam wikibase:language \"en\" .}}"].join(" ");

    $.ajax({
        type: "GET",
        url: "https://query.wikidata.org/sparql?format=json&query=" + queryOrgs,
        dataType: 'json',
        success: function (data) {
            $.each(data['results']['bindings'], function (key, element) {
                availableTags.push(element['speciesLabel']['value']);
                taxids[element['speciesLabel']['value']] = [element['taxid']['value'],
                    element['species']['value'],
                    element['RefSeq']['value'],
                    element['speciesLabel']['value']];
            });
        }
    });
    $(function () {
        $("#orgform").autocomplete({
            source: availableTags
        });
    });
    $("#button1").off("click").click(function (event) {
        $("#gene_form_div").html("<form class=\"form-inline ui-widget\"> <div class=\"form-group\"> " +
            "<label for=\"geneForm\">Gene/Protein Selection:</label> <input type=\"text\" class=\"form-control formborders\" id=\"geneForm\" " +
            "name=\"geneFormItem\" placeholder=\"choose a gene\"> </div> <button id=\"button2\" type=\"submit\" " +
            "class=\"btn btn-primary formborders\">Select</button> </form>");
        var availablegeneTags = [];
        event.preventDefault();

        $('div.geneData').empty();
        $('div.proteinData').empty();

        var organism = $('input[name=orgFormItem]').val();
        var current_taxid = taxids[organism];
        var orgqid = current_taxid[1].split('/');
        $("#orgName").html("<h3><i>" + current_taxid[3] + "</i></h3>");

        $("div.orgData").html("<span><div class=\"dataul\"> <h4>NCBI Taxonomy ID:</h4>" + "<a target=\"_blank\" href=https://www.ncbi.nlm.nih.gov/taxonomy/" + current_taxid[0] + ">" + current_taxid[0] + "</a>" + "</div></span>" +
            "<span><div class=\"dataul\"> <h4>NCBI RegSeq Accession:</h4>" + "<a target=\"_blank\" href=http://www.ncbi.nlm.nih.gov/nuccore/" + current_taxid[2] + ">" + current_taxid[2] + "</a>" + "</div></span>" +
            "<span><div class=\"dataul\"> <h4>Wikidata Item ID:</h4>" + "<a  target=\"_blank\" href=" + current_taxid[1] + ">" + orgqid.slice(-1)[0] + "</a>" + "</div></span>"
        );
        $("#orgbut").html("<button data-toggle=\"tooltip\" title=\"Go to the Wikidata page for the microbe " + current_taxid[3] + "\"" + "id=\"wdorgbut\" class=\"wdbutton btn btn-default\"><img id=\"wdlogo1\" src=\"../img/GeneWikidata-logo-en.png\"></button>");


        $("#orgform").val("");
        $('#wdorgbut').off("click").click(function () {
            $(this).html("<a target=\"_blank\" href=" + current_taxid[1] + "> <img id=\"wdlogo1\" src=\"../img/GeneWikidata-logo-en.png\"></a>");
        });


        var defaultCoords = "&tracklist=0&menu=0&loc=" + current_taxid[2] + ":" + "100000..200000&tracks=genes_canvas_mod";
        jbrowse_url = "JBrowse-1.12.1-dev/index.html?data=sparql_data/sparql_data_" + current_taxid[0];
        $('#jbrowse').html("<span><iframe src=" + jbrowse_url + defaultCoords + "></iframe> </span>");

        var tid = current_taxid[0].trim();
        var queryGenes = ["SELECT  ?gene ?specieswd ?specieswdLabel ?taxid ?genomeaccession ?geneLabel ",
            "?locustag ?entrezid ?genomicstart ?genomicend ?strand ?protein ?proteinLabel ?uniprot ?refseqProtein ",
            "WHERE {",
            "?specieswd wdt:P685",
            "\"" + tid + "\".",
            "?specieswd wdt:P685 ?taxid;",
            "wdt:P2249 ?genomeaccession.",
            "?gene wdt:P703 ?specieswd;",
            "wdt:P351 ?entrezid ;",
            "wdt:P644 ?genomicstart;",
            "wdt:P645 ?genomicend;",
            "wdt:P2393 ?locustag;",
            "wdt:P2548 ?strand.",

            "OPTIONAL{?gene wdt:P688 ?protein.",
            "?protein wdt:P352 ?uniprot;",
            "wdt:P637 ?refseqProtein.}",
            "SERVICE wikibase:label {",
            "bd:serviceParam wikibase:language \"en\" .",
            "}}"
        ].join(" ");

        $.ajax({
            type: "GET",
            url: "https://query.wikidata.org/sparql?format=json&query=" + queryGenes,
            dataType: 'json',
            success: function (data) {
                $.each(data['results']['bindings'], function (key, element) {
                    availablegeneTags.push(element['geneLabel']['value']);

                });

                var genes = data['results']['bindings'];
                var i = null;

                $(function () {
                    $("#geneForm").autocomplete({
                        source: availablegeneTags
                    });
                });


                $("#button2").off("click").click(function (event2) {

                    console.log(taxids[current_taxid[3]]);
                    event2.preventDefault();
                    var gene = $('input[name=geneFormItem]').val();

                    for (i = 0; genes.length > i; i += 1) {
                        if (genes[i]['geneLabel']['value'] === gene) {

                            var gstart = genes[i]['genomicstart']['value'] - 400;
                            var gend = genes[i]['genomicend']['value'] - (-400);
                            var coords = "&tracklist=0&menu=0&loc=" + genes[i]['genomeaccession']['value'] + ":" + gstart + ".." + gend;
                            var gene_wd_uri = genes[i]['gene']['value'];
                            var geneqid = gene_wd_uri.split('/');
                            //$("#geneName").html("<h3>" + genes[i]['geneLabel']['value'] + "</h3>");
                            $("div.geneData").html("<span><div class=\"dataul\"> <h4>Gene Name:</h4>" + genes[i]['geneLabel']['value'] + "</div></span>" +
                                "<span><div class=\"dataul\">  <h4>Locus Tag:</h4>" + "<a target=\"_blank\" href=http://www.ncbi.nlm.nih.gov/gene/?term=" + genes[i]['locustag']['value'] + ">" + genes[i]['locustag']['value'] + "</a>" + "</div></span>" +
                                "<span><div class=\"dataul\">  <h4>Entrez ID:</h4>" + "<a target=\"_blank\" href=http://www.ncbi.nlm.nih.gov/gene/?term=" + genes[i]['entrezid']['value'] + ">" + genes[i]['entrezid']['value'] + "</a>" + "</div></span>" +
                                "<span><div class=\"dataul\">  <h4>Genome Start:</h4>" + genes[i]['genomicstart']['value'] + "</div></span>" +
                                "<span><div class=\"dataul\">  <h4>Genome End:</h4>" + genes[i]['genomicend']['value'] + "</div></span>" +
                                "<span><div class=\"dataul\">  <h4>Wikidata Item ID:</h4>" + "<a target=\"_blank\" href=" + genes[i]['gene']['value'] + ">" + geneqid.slice(-1)[0] + "</a>" + "</div></span>"
                            );

                            $("#genebut").html("<button data-toggle=\"tooltip\" title=\"Go to the Wikidata page for the gene "
                                + genes[i]['geneLabel']['value'] + "\"" + "id=\"wdgenebut\" class=\"wdbutton btn btn-default\"><img id=\"wdlogo2\" " +
                                "src=\"img/GeneWikidata-logo-en.png\"></button>");
                            $('#wdgenebut').off("click").click(function () {
                                $(this).html("<a target=\"_blank\" href=" + gene_wd_uri + "> <img id=\"wdlogo2\" src=\"../img/GeneWikidata-logo-en.png\"></a>");
                            });
                            $('#jbrowse').html("<span><iframe src=" + jbrowse_url + coords + "></iframe> </span>");
                            var prot_wd_uri = genes[i]['protein']['value'];
                            var protqid = prot_wd_uri.split('/');

                            //$("#protName").html("<h3>" + genes[i]['proteinLabel']['value'] + "</h3>");
                            $("div.proteinData").html("<span><div class=\"dataul\"> <h4>Protein Name:</h4>" + genes[i]['proteinLabel']['value'] + "</div></span>" +
                                "<span><div class=\"dataul\"> <h4>UniProt ID:</h4>" + "<a target=\"_blank\" href=http://purl.uniprot.org/uniprot/" + genes[i]['uniprot']['value'] + ">" + genes[i]['uniprot']['value'] + "</a>" + "</div></span>" +
                                "<span><div class=\"dataul\"> <h4>RefSeq Protein ID:</h4>" + "<a target=\"_blank\" href=https://www.ncbi.nlm.nih.gov/protein/" + genes[i]['refseqProtein']['value'] + ">" + genes[i]['refseqProtein']['value'] + "</a>" + "</div></span>" +
                                "<span><div class=\"dataul\"> <h4>Wikidata Item ID:</h4>" + "<a target=\"_blank\" href=" + genes[i]['protein']['value'] + ">" + protqid.slice(-1)[0] + "</a>" + "</div></span>"
                            );

                            $("#protbut").html("<button data-toggle=\"tooltip\" title=\"Go to the Wikidata page for the protein " + genes[i]['proteinLabel']['value'] + "\"" + "id=\"wdprotbut\" class=\"wdbutton btn btn-default\"><img id=\"wdlogo3\" src=\"../img/GeneWikidata-logo-en.png\"></button>");
                            $('#wdprotbut').off("click").click(function () {
                                $(this).html("<a target=\"_blank\" href=" + prot_wd_uri + "> <img id=\"wdlogo3\" src=\"../img/GeneWikidata-logo-en.png\"></a>");
                            });
                            var uniprot = genes[i]['uniprot']['value'];
                            var goQuery = ["SELECT distinct ?pot_go ?goterm_label ?goclass ?goclass_label WHERE { ?protein wdt:P352",
                                "\"" + uniprot + "\".",
                                "{?protein wdt:P680 ?pot_go} UNION {?protein wdt:P681 ?pot_go} UNION {?protein wdt:P682 ?pot_go} .",
                                "?pot_go wdt:P279* ?goclass. ?pot_go rdfs:label ?goterm_label. FILTER (LANG(?goterm_label) = \"en\")",
                                "FILTER ( ?goclass = wd:Q2996394 || ?goclass = wd:Q5058355 || ?goclass = wd:Q14860489)",
                                "?goclass rdfs:label ?goclass_label. FILTER (LANG(?goclass_label) = \"en\")}"
                            ].join(" ");


                            $.ajax({
                                type: "GET",
                                url: "https://query.wikidata.org/sparql?format=json&query=" + goQuery,
                                dataType: 'json',
                                success: function (data) {
                                    $("#molfunc").html("<div class=\"col-md-12 gutter_padding\">" +
                                        "<div  class=\"allborders go-box-height boxcolor\">" +
                                        "<div class=\"goboxheader\"><h4>Molecular Function</h4></div>" +
                                        "<div id=\"molfuncdata\" class=\"data\" ></div> </div> </div> </div>");

                                    $("#bioproc").html("<div class=\"col-md-12 gutter_padding\">" +
                                        "<div  class=\"allborders go-box-height boxcolor\">" +
                                        "<div class=\"goboxheader\"><h4>Biological Process</h4></div>" +
                                        "<div id=\"bioprocdata\" class=\"data\" ></div> </div> </div> </div>");

                                    $("#celcomp").html("<div class=\"col-md-12 gutter_padding\">" +
                                        "<div  class=\"allborders go-box-height boxcolor\">" +
                                        "<div class=\"goboxheader\"><h4>Cellular Component</h4></div>" +
                                        "<div id=\"celcompdata\" class=\"data\" ></div> </div> </div> </div>");

                                    $.each(data['results']['bindings'], function (key, element) {
                                        console.log(element);
                                        if (element['goclass_label']['value'] == 'biological process') {
                                            $("#bioprocdata").append("<div class=\"dataul\"><h4>" + element['goterm_label']['value'] + "</h4></div>");
                                        }

                                        if (element['goclass_label']['value'] == 'molecular function') {
                                            $("#molfuncdata").append("<div class=\"dataul\"><h4>" + element['goterm_label']['value'] + "</h4></div>");
                                        }

                                        if (element['goclass_label']['value'] == 'cellular component') {
                                            $("#celcompdata").append("<div class=\"dataul\"><h4>" + element['goterm_label']['value'] + "</h4></div>");
                                        }


                                    });
                                    $("#bioprocdata").append("<form style=\"margin-top:10px\" class=\"form-inline ui-widget\"> <div class=\"form-group\"> " +
                                        "<label>Add a biological product:</label> <input type=\"text\" class=\"form-control formborders\" " +
                                        "name=\"bioprocForm\" placeholder=\"biological process\"> </div> <button type=\"submit\" " +
                                        "class=\"btn btn-primary formborders\">Select</button> </form>");
                                    $("#molfuncdata").append("<form style=\"margin-top:10px\" class=\"form-inline ui-widget\"> <div class=\"form-group\"> " +
                                        "<label>Add a biological product:</label> <input type=\"text\" class=\"form-control formborders\" " +
                                        "name=\"molfuncForm\" placeholder=\"molecular function\"> </div> <button type=\"submit\" " +
                                        "class=\"btn btn-primary formborders\">Select</button> </form>");
                                    $("#celcompdata").append("<form style=\"margin-top:10px\" class=\"form-inline ui-widget\"> <div class=\"form-group\"> " +
                                        "<label>Add a cellular component:</label> <input type=\"text\" class=\"form-control formborders\" " +
                                        "name=\"celcompForm\" placeholder=\"cellular component\"> </div> <button type=\"submit\" " +
                                        "class=\"btn btn-primary formborders\">Select</button> </form>");

                                }
                            });
                        }


                    }
                    $("#molfuncdata").html("");
                    $("#bioprocdata").html("");
                    $("#celcompdata").html("");
                    $('#geneForm').val("");

                });
            }
        });


    });


});

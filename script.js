$(document).ready(function () {
    console.log("hello world");
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
        var availablegeneTags = [];
        event.preventDefault();

        $('div.geneData').empty();
        $('div.proteinData').empty();

        var organism = $('input[name=orgFormItem]').val();
        var current_taxid = taxids[organism];
        var orgqid = current_taxid[1].split('/');
        $("div.orgData").html("<span><div class=\"dataul\"> <h3>Organism Name:</h3>" + current_taxid[3] + "</div></span>" +
                              "<span><div class=\"dataul\"> <h3>NCBI Taxonomy ID:</h3>" + "<a href=https://www.ncbi.nlm.nih.gov/taxonomy/" + current_taxid[0] + ">" + current_taxid[0] + "</a>" + "</div></span>" +
                              "<span><div class=\"dataul\"> <h3>NCBI RegSeq Accession:</h3>" + "<a href=http://www.ncbi.nlm.nih.gov/nuccore/" + current_taxid[2] + ">" + current_taxid[2] + "</a>" + "</div></span>" +
                              "<span><div class=\"dataul\"> <h3>Wikidata Item ID:</h3>" + "<a href=" + current_taxid[1] + ">" + orgqid.slice(-1)[0] + "</a>" + "</div></span>"
        );


        $("#orgform").val("");
         $('#wdorgbut').off("click").click(function () {
            $(this).html("<a id=\"orgpop\" href=" + current_taxid[1] + "> <img id=\"wdlogo1\" src=\"img/GeneWikidata-logo-en.png\"></a>");
        });



        var defaultCoords = "&menu=0&loc=" + current_taxid[2] + ":" + "100000..200000&tracks=genes_canvas_mod";
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
                            var coords = "&loc=" + genes[i]['genomeaccession']['value'] + ":" + gstart + ".." + gend;
                            var geneqid = genes[i]['gene']['value'].split('/');
                            $("div.geneData").html("<span><div class=\"dataul\"> <h3>Gene Name:</h3>" + genes[i]['geneLabel']['value'] + "</div></span>" +
                                "<span><div class=\"dataul\">  <h3>Locus Tag:</h3>" + "<a href=http://www.ncbi.nlm.nih.gov/gene/?term=" + genes[i]['locustag']['value'] + ">" + genes[i]['locustag']['value'] + "</a>" + "</div></span>" +
                                "<span><div class=\"dataul\">  <h3>Entrez ID:</h3>" + "<a href=http://www.ncbi.nlm.nih.gov/gene/?term=" + genes[i]['entrezid']['value'] + ">" + genes[i]['entrezid']['value'] + "</a>" + "</div></span>" +
                                "<span><div class=\"dataul\">  <h3>Genome Start:</h3>" + genes[i]['genomicstart']['value'] + "</div></span>" +
                                "<span><div class=\"dataul\">  <h3>Genome End:</h3>" + genes[i]['genomicend']['value'] + "</div></span>" +
                                "<span><div class=\"dataul\">  <h3>Wikidata Item ID:</h3>" + "<a href=" + genes[i]['gene']['value'] + ">" + geneqid.slice(-1)[0] + "</a>" + "</div></span>"
                            );

                            $('#wdgenebut').html("<a href=" + genes[i]['gene']['value'] + "> <img id=\"wdlogo2\" src=\"img/GeneWikidata-logo-en.png\"></a>");
                            $('#jbrowse').html("<span><iframe src=" + jbrowse_url + coords + "></iframe> </span>");

                            var protqid = genes[i]['protein']['value'].split('/');

                            $("div.proteinData").html("<span><div class=\"dataul\"> <h3>Protein Name:</h3>" + genes[i]['proteinLabel']['value'] + "</div></span>" +
                                "<span><div class=\"dataul\"> <h3>UniProt ID:</h3>" + "<a href=http://purl.uniprot.org/uniprot/" + genes[i]['uniprot']['value'] + ">" + genes[i]['uniprot']['value'] + "</a>" + "</div></span>" +
                                "<span><div class=\"dataul\"> <h3>RefSeq Protein ID:</h3>" + "<a href=https://www.ncbi.nlm.nih.gov/protein/" + genes[i]['refseqProtein']['value'] + ">" + genes[i]['refseqProtein']['value'] + "</a>" + "</div></span>" +
                                "<span><div class=\"dataul\"> <h3>Wikidata Item ID:</h3>" + "<a href=" + genes[i]['protein']['value'] + ">" + protqid.slice(-1)[0] + "</a>" + "</div></span>"
                            );
                            $('#wdprotbut').html("<a href=" + genes[i]['protein']['value'] + "> <img id=\"wdlogo3\" src=\"img/GeneWikidata-logo-en.png\"></a>");
                        }


                    }
                    $('#geneForm').val("");

                });
            }
        });

    });


});

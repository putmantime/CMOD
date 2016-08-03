var addGeneForm = function () {
    $("#gene_form_div").html(
        "<form class=\"form-inline ui-widget\"> <div class=\"form-group\"> " +
        "<label for=\"geneform\">Gene/Protein Selection:</label> <input type=\"text\" " +
        "class=\"form-control formborders\" id=\"geneform\" " +
        "name=\"geneFormItem\" placeholder=\"choose a gene\"> </div></form>");
};

var addOrgName = function (name) {
    $("#orgName").html("<h1><i>" + name + "</i></h1>");
};


var addOrgData = function (taxid, refseq, qid) {
    var orgqid = qid.split('/');
    $("div.orgData").html(
        "<span><div class=\"dataul\"> <h4>NCBI Taxonomy ID:</h4>" +
        "<a target=\"_blank\" href=https://www.ncbi.nlm.nih.gov/taxonomy/" +
        taxid + ">" + taxid + "</a>" + "</div></span>" +
        "<span><div class=\"dataul\"> <h4>NCBI RegSeq Accession:</h4>" +
        "<a target=\"_blank\" href=http://www.ncbi.nlm.nih.gov/nuccore/" +
        refseq + ">" + refseq + "</a>" + "</div></span>" +
        "<span><div class=\"dataul\"> <h4>Wikidata Item ID:</h4>" +
        "<a  target=\"_blank\" href=" + qid + ">" + orgqid.slice(-1)[0] + "</a>" + "</div></span>"
    )
};


var addGeneProteinData = function (label, id, gqid,
                                   locustag, genomicstart,
                                   genomicend, pqid, proteinLabel,
                                   uniprot, refseqProtein) {


    $("div.geneData").html("<span><div class=\"dataul\"> <h4>Gene Name:</h4>" + label + "</div></span>" +
        "<span><div class=\"dataul\">  <h4>Locus Tag:</h4>" +
        "<a target=\"_blank\" href=http://www.ncbi.nlm.nih.gov/gene/?term=" + locustag + ">"
        + locustag + "</a>" + "</div></span>" +
        "<span><div class=\"dataul\">  <h4>Entrez ID:</h4>" +
        "<a target=\"_blank\" href=http://www.ncbi.nlm.nih.gov/gene/?term=" + id + ">"
        + id + "</a>" + "</div></span>" +
        "<span><div class=\"dataul\">  <h4>Genome Start:</h4>" + genomicstart + "</div></span>" +
        "<span><div class=\"dataul\">  <h4>Genome End:</h4>" + genomicend + "</div></span>" +
        "<span><div class=\"dataul\">  <h4>Wikidata Item ID:</h4>" +
        "<a target=\"_blank\" href=" + gqid + ">" + gqid + "</a>" + "</div></span>"
    );

    $("div.proteinData").html("<span><div class=\"dataul\"> <h4>Protein Name:</h4>" + proteinLabel + "</div></span>" +
        "<span><div class=\"dataul\"> <h4>UniProt ID:</h4>" + "<a target=\"_blank\" href=http://purl.uniprot.org/uniprot/"
        + uniprot + ">" + uniprot + "</a>" + "</div></span>" +
        "<span><div class=\"dataul\"> <h4>RefSeq Protein ID:</h4>" +
        "<a target=\"_blank\" href=https://www.ncbi.nlm.nih.gov/protein/" + refseqProtein + ">"
        + refseqProtein + "</a>" + "</div></span>" +
        "<span><div class=\"dataul\"> <h4>Wikidata Item ID:</h4>" + "<a target=\"_blank\" href=" + pqid + ">"
        + pqid + "</a>" + "</div></span>"
    );

};


var addGoBoxes = function () {
    $("#molfunc").html("<div class=\"col-md-12 gutter_padding\">" +
        "<div  class=\"goborders go-box-height boxcolor\">" +
        "<div class=\"goboxheader\">" +
        '<div class="row">' +
        '<div class="col-md-9"><h4 class="godataul">Molecular Function</h4></div>' +
        '<div class="col-md-3"><h4 class="godataul">GO ID</h4></div>' +
        '</div>' +
        '</div>' +
        '<div style="padding:20px" id="molfuncdata" class="data" ></div> </div> </div> </div>');

    $("#bioproc").html("<div class=\"col-md-12 gutter_padding\">" +
        "<div  class=\"goborders go-box-height boxcolor\">" +
        "<div class=\"goboxheader\">" +
        '<div class="row">' +
        '<div class="col-md-9"><h4 class="godataul">Biological Process</h4></div>' +
        '<div class="col-md-3"><h4 class="godataul">GO ID</h4></div>' +
        '</div>' +
        '</div>' +
        '<div style="padding:20px" id="bioprocdata" class="data" ></div> </div> </div> </div>');

    $("#celcomp").html("<div class=\"col-md-12 gutter_padding\">" +
        "<div  class=\"goborders go-box-height boxcolor\">" +
        "<div class=\"goboxheader\">" +
        '<div class="row">' +
        '<div class="col-md-9"><h4 class="godataul">Cellular Component</h4></div>' +
        '<div class="col-md-3"><h4 class="godataul">GO ID</h4></div>' +
        '</div>' +
        '</div>' +
        '<div style="padding:20px" id="celcompdata" class="data" ></div> </div> </div> </div>');


};

var appendGOForm = function () {
    $("#bioprocdata").append("<form  class=\"form-inline ui-widget goform\"> <div class=\"form-group\"> " +
        "<label>Add a biological process:</label> <input type=\"text\" class=\"form-control formborders\" " +
        "name=\"bioprocForm\" placeholder=\"biological process\"> </div> <button type=\"submit\" " +
        "class=\"btn btn-primary formborders\">Select</button> </form>");
    $("#molfuncdata").append("<form  class=\"form-inline ui-widget goform\"> <div class=\"form-group\"> " +
        "<label>Add a molecular function:</label> <input type=\"text\" class=\"form-control formborders\" " +
        "name=\"molfuncForm\" placeholder=\"molecular function\"> </div> <button type=\"submit\" " +
        "class=\"btn btn-primary formborders\">Select</button> </form>");
    $("#celcompdata").append("<form  class=\"form-inline ui-widget goform\"> <div class=\"form-group\"> " +
        "<label>Add a cellular component:</label> <input type=\"text\" class=\"form-control formborders\" " +
        "name=\"celcompForm\" placeholder=\"cellular component\"> </div> <button type=\"submit\" " +
        "class=\"btn btn-primary formborders\">Select</button> </form>");


};
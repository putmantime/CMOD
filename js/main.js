$(document).ready(function () {

    var currentTaxa = ['Chlamydia trachomatis 434/BU', '471472', 'Q20800254', 'NC_010287.1'];

    //Begin form modules
    //organism selection form module
    var orgForm = {
        init: function () {
            this.cacheDOM();
            this.acsource();
        },
        cacheDOM: function () {
            this.$of = $("#orgFormModule");
            this.$input = this.$of.find('input');
        },
        acsource: function () {
            var orginput = this.$input;
            orginput.autocomplete({
                minLength: 0,
                source: getOrgs(),
                autoFocus: true,
                select: function (event, ui) {
                    orginput.val("");
                    $("#orgData, #geneData, #protData, .main-go-data").html("");


                    // currentTaxa = [orgname, taxid, qid, refseq accession]
                    currentTaxa = [ui.item.label, ui.item.taxid, ui.item.qid, ui.item.refseq];
                    //initiate gene form with organism data
                    geneForm.init(currentTaxa[1]);
                    //render organism data
                    orgData.init(currentTaxa);
                    //launch jbrowse
                    jbrowse.init(currentTaxa[1], currentTaxa[3], ":100000..200000&tracks=genes_canvas_mod", currentTaxa[0]);
                    return false;
                }
            })
                //custom template for org search box
                .autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div style=\"border-bottom: solid black 1px\"><i><strong>" +
                    item.label + "</strong></i><br>Taxid: " + item.taxid + "<br>Wikidata: " +
                    item.qid + "</div>")
                    .appendTo(ul);
            };
        }
    };
    orgForm.init();


    //gene selection form module
    var geneForm = {
        currentGene: [],
        currentProteins: [],
        init: function (taxid) {
            this.cacheDOM();
            this.acsource(taxid);

        },
        cacheDOM: function () {
            this.$gf = $("#geneFormModule");
            this.$input = this.$gf.find('input');

        },

        acsource: function (taxid) {
            var geneinput = this.$input;
            geneinput.autocomplete({
                minLength: 0,
                source: getGenes(taxid),
                autoFocus: true,
                select: function (event, ui) {
                    geneinput.val("");
                    this.currentGene = [
                        ui.item.label,
                        ui.item.id,
                        ui.item.gqid,
                        ui.item.locustag,
                        ui.item.genomicstart,
                        ui.item.genomicend
                    ];
                    this.currentProtein = [
                        ui.item.proteinLabel,
                        ui.item.uniprot,
                        ui.item.refseqProtein,
                        ui.item.pqid
                    ];
                    //get GO Terms for this gene/protein
                    getGOTerms(this.currentProtein[1]);
                    //Render the data into the gene and protein boxes
                    geneData.init(this.currentGene);
                    proteinData.init(this.currentProtein);
                    //focus jbrowse on selected gene
                    var gstart = this.currentGene[4] - 400;
                    var gend = this.currentGene[5] - (-400);
                    jbrowse.init(currentTaxa[1], currentTaxa[3], ":" + gstart + ".." + gend, currentTaxa[0]);
                    return false;
                }
            })
                //custom template for gene search box
                .autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div style=\"border-bottom: solid black 1px\"><strong>" + item.label +
                    "</strong><br>Entrez ID:" + item.id + "<br>Wikidata: " + item.gqid + "</div>")
                    .appendTo(ul);
            };

        }


    };
    //End form modules

    //Begin data rendering modules
    //render the organism data in the Organism box
    var orgData = {
        init: function (taxData) {
            this.cacheDOM();
            this.render(taxData);

        },
        cacheDOM: function () {
            this.$od = $("#orgDataModule");
            this.$ul = this.$od.find('ul');
            this.$orgD = this.$od.find('#orgData');
            this.template = this.$od.find('#org-template').html();


        },
        render: function (taxData) {
            console.log(taxData);
            var data = {
                'organism': taxData
            };
            //this.$ul.html(Mustache.render(this.template, data));
            this.$orgD.html(
                "<div class='main-data'><h4>NCBI Taxonomy ID:</h4>" + taxData[1] + "</div>" +
                "<div class='main-data'><h4>Wikidata ID:</h4>" + taxData[2] + "</div>" +
                "<div class='main-data'><h4>NCBI RefSeq Accession:</h4>" + taxData[3] + "</div>"
            );
        }
    };

    var geneData = {
        init: function (gene) {
            this.cacheDOM();
            this.render(gene);


        },
        cacheDOM: function () {
            this.$gd = $("#geneDataModule");
            this.$ul = this.$gd.find('ul');
            this.$geneD = this.$gd.find('#geneData');

            this.template = this.$gd.find('#gene-template').html();

        },
        render: function (gene) {
            var data = {
                'gene': gene
            };
            console.log(data);
            //this.$ul.html(Mustache.render(this.template, data));
            this.$geneD.html(
                "<div class='main-data'><h4>Gene Name:</h4><i>" + data.gene[0] + "</i></div>" +
                "<div class='main-data'><h4>Entrez ID:</h4>" + data.gene[1] + "</div>" +
                "<div class='main-data'><h4>Wikidata ID:</h4>" + data.gene[2] + "</div>" +
                "<div class='main-data'><h4>Locus Tag:</h4>" + data.gene[3] + "</div>" +
                "<div class='main-data'><h4>Genomic Start:</h4>" + data.gene[4] + "</div>" +
                "<div class='main-data'><h4>Genomic End:</h4>" + data.gene[5] + "</div>"
            );

        }


    };
    var proteinData = {
        init: function (protein) {
            this.cacheDOM();
            this.render(protein);

        },
        cacheDOM: function () {
            this.$pd = $("#proteinDataModule");
            this.$ul = this.$pd.find('ul');
            this.$protD = this.$pd.find('#protData');
            this.template = this.$pd.find('#protein-template').html();

        },
        render: function (protein) {

            var data = {
                'protein': protein
            };
            console.log(data);
            //this.$ul.html(Mustache.render(this.template, data));
            this.$protD.html(
                "<div class='main-data'><h4>Protein Name:</h4><i>" + data.protein[0] + "</i></div>" +
                "<div class='main-data'><h4>UniProt ID:</h4>" + data.protein[1] + "</div>" +
                "<div class='main-data'><h4>Wikidata ID:</h4>" + data.protein[2] + "</div>" +
                "<div class='main-data'><h4>RefSeq ID:</h4>" + data.protein[3] + "</div>"
            );
        }

    };
//End data rendering modules

//    Begin JBrowse Module

    var jbrowse = {

        init: function (taxid, refseq, coords, name) {
            this.cacheDOM();
            this.render(taxid, refseq, coords, name);

        },
        url: "JBrowse-1.12.1-dev/index.html?data=sparql_data/sparql_data_",
        coordPrefix: "&tracklist=0&menu=0&loc=",
        cacheDOM: function () {
            this.$jb = $("#jbrowseModule");
            this.$browser = this.$jb.find('#jbrowse');
            this.$orgTitle = this.$jb.find('#main-organism-name');
            this.$name = this.$orgTitle.find('i');

            this.templateJB = this.$jb.find('#jbrowse-template').html();


        },
        render: function (taxid, refseq, coords, name) {
            var data = {
                'url': this.url + taxid + this.coordPrefix + refseq + coords,
                'name': name
            };
            this.$browser.html(Mustache.render(this.templateJB, data));
            this.$name.html(name);


        }


    };

    jbrowse.init('471472', 'NC_010287.1', ':100000..200000&tracks=genes_canvas_mod', 'Chlamydia trachomatis 434/BU');
    orgData.init(currentTaxa);
    geneForm.init('471472');
    geneData.init([
        '2-oxoglutarate dehydrogenase complex subunit dihydrolipoyllysine-residue succinyltransferase CTL0311',
        '5858187',
        'http://www.wikidata.org/entity/Q21168910',
        'CTL0311',
        '385948',
        '387045'
    ]);

    proteinData.init([
        '2-oxoglutarate dehydrogenase complex subunit dihydrolipoyllysine-residue succinyltransferase CTL0311',
        'A0A0H3MBK1',
        'http://www.wikidata.org/entity/Q21172795',
        'YP_001654394'
    ]);
    getGOTerms('A0A0H3MBK1');
//End Jbrowse module


});



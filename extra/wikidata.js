/* PRINCIPLES ############################################ */
// 1. API'S URL:
// 1a.Parts of the url:
wd = "http://www.wikidata.org/w/api.php?";
wp = "http://en.wikipedia.org/w/api.php?"; // list of iso-code = ? ----------------<
aw = "action=wbgetentities"; // rather wdpoint
aq = "action=query"; // ?rather wppage
ts = "&sites=enwiki"; // wd only&required. // list of wiki-code = ? --------------<
t = "&titles=" // target, wd|wp
i = "Dragon"; //item, wd|wp
// i_ht = "＊～米字鍵～" ; // wdpoint|wppage -- +few data
// i_hs = "＊～米字键～" ; // wdpoint: missing; wppage: redirect (confirmed)
// i_ht = "中國" ; // wdpoint|wppage -- +many data
// i_hs = "中国" ; // wdpoint: missing; wppage: redirect (idem)
l = "&languages=zh|zh-classical|zh-cn|zh-hans|zh-hant|zh-hk|zh-min-nan|zh-mo|zh-my|zh-sg|zh-tw|fr"; // wdpoint only
ps = "&props=sitelinks|labels|aliases|descriptions"; // wdpoint only
//sitelinks: all interwikis
//labels: title without _(tag), for l (languages) only
//aliases: label of redirect page
p = "&prop=extracts&exintro&explaintext&exsentences=10"; // wppage only
r = "&redirects&converttitles"; // wppage only
c = "&callback=?" // wd|wp
f = "&format=json" // wd|wp

//1b. Compose your url:
urlwd = wd + aw + ts + t + i + l + ps + c + f; // typical wd query
url = wp + aq + t + i + p + r + c + f; // typical wp query
// Examples print in console:
console.log("1. WD: " + urlwd);
console.log("2. WP: " + url);

//1c. DOM injection:
//$("body").html('<a href="'+url+'">Link</a>.<br />'+ url); //publish the url.
// wd+i INconsistently provide variants.

/* DEMO ################################################## */
/* 2. TEMPLATING ***************************************** */
// 2a. Single query :
function WD(item) {
    url = wp + aq + t + item + p + r + c + f;
    console.log(url);
    $.getJSON(url, function (json) {
        var item_id = Object.keys(json.query.pages)[0]; // THIS DO THE TRICK !
        extract = json.query.pages[item_id].extract;
        result = "<b>En :</b> <t>" + item + "</t> <b>⇒</b> " + extract;
        $('#anchor1').append("<div>" + result + "</div>"); // append
    });
}
WD("Dragon");

// 2b. Single query (alternative code):
function WD_i(item) {
    //var be = item
    url_tpl = wp + aq + t + item + p + r + c + f;
    $.getJSON(url_tpl, function (data) {
        $.each(data.query.pages, function (i, json) { // THIS DO THE TRICK !
            sent = json.extract.toString();
            result = "<b>En:</b> <t>" + item + "</t> <b>⇒</b> " + sent;
            $('#anchor2').append("<div>" + result + "</div>");// append
        });
    });
}
WD_i("unicorn");

/* LOOP ************************************************** */
// 2c. LOOP on a list of existing articles
function WD_list(list) {
    $.each(list, function (a, item) {
        WD_i(item);
    });
}

var List = [
    "Qilin",
    "Basilisk",
    "Biscione",
    "Chollima",
    "Cockatrice",
    "Dragon",
    "Enfield",
    "Garuda",
    "Griffin",
    "Keythong",
    "Harpy",
    "Lindworm",
    "Manticore",
    "Mermaid",
    "Pegasus",
    "Phoenix",
    "Salamander",
    "Sea-horse",
    "Sea-lion",
    "Turul",
    "Unicorn",
    "Wyver",
    "Yale"];
WD_list(List);
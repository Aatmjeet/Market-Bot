const prompt = require('prompt-sync')();
const fs = require('fs');
var request = require('request');
var market = require('steam-market-search').market;

var random = prompt('please enter query:');
let collection = [];
let start = 0;

const load = () => {
    console.log(`Fetching items... start=${start}`);

    // This will fetch all cases for CSGO.
    market.search(730, {
        count: 100,
        start,
        query: random,
        'category_730_Type[]': 'tag_CSGO_Type_WeaponCase',
        sort_column: 'quantity'
    }).then(results => {

        // Add the new results to the collection.
        collection = [...collection, ...results];
        // Increment the start value.
        start += results.length;
        console.log(`Added ${results.length} items to collection`);

        // If there were no results you have reached the end of the search.
        if (results.length === 0) done()
        else next();

    })
}

// Wait 5 seconds between each load so steam doesn't rate limit you.
const next = () => {
    console.log('Loading next page in 5 seconds');
    setTimeout(() => load(), 5000);
}

// When done, Dump the collection of results to a file.
const done = () => {
    console.log(`There are ${collection.length} results. Dumping to output.json`);
    fs.writeFile('../cases.json',
        JSON.stringify(collection, null, 2), function (err) {
						    if (err) {
						        console.log("An error occured while writing JSON Object to File.");
						        return console.log(err);
						    }
						 
						    console.log("JSON file has been saved.");
						});
    
}

// Start the search
next();

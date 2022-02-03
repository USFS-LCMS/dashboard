// // const test_lctype_names = lctype => {
// const names = {'Change':["Slow Loss","Fast Loss","Gain","Non-Processing Area Mask"],
// 'Land_Cover':["Trees",
// "Tall Shrubs & Trees Mix","Shrubs & Trees Mix","Grass/Forb/Herb & Trees Mix","Barren & Trees Mix","Tall Shrubs","Shrubs","Grass/Forb/Herb & Shrubs Mix","Barren & Shrubs Mix","Grass/Forb/Herb", "Barren & Grass/Forb/Herb Mix","Barren or Impervious","Snow or Ice","Water","Non-Processing Area Mask"],
// 'Land_Use':["Agriculture","Developed","Forest","Non-Forest Wetland","Other","Rangeland or Pasture","Non-Processing Area Mask"]
// }
    
// const fieldNames = names['Change'].map((w) => 'Change' + '---'+w); // Create field names
// console.log(fieldNames);

// I'm thinking that below will be the format I'd like to follow.
// But I'd like to map it out to a -- list? -- something like fieldnames.map(make a dictionary for it and store it...)
// const examp_dict = {
//     ctype: fieldNames[0],
//     cnums: {
//         1999: 1,
//         2000: 2,
//         2001: 3,
//         2002: 1,
//         2003: 2
//     }
// };
// console.log(examp_dict['cnums']['1999']);

// Have a bit of a plan - stopping point reached!
    // };
    
    // chartWhich.map((w) => setContentInfo(w));
    // setContentInfo('Change');
// }

// test_lctype_names();

const forest_cover = "0.07996259308689317,0.093760291697135,0.09669597319750636,0.09540409053775097,0.10128360369732449,0.10684656614725856,0.10049570160654989,0.11646605997696494,0.11918098130710474,0.12301492674147729,0.11756760835137293,0.09530080337501985,0.09076400270968515,0.0910180725695409,0.08316885256369343,0.08455121975248515,0.09986760163740599,0.10950976299721994,0.1142746475547251,0.11331745438744895,0.11436093010424739,0.10448299787879192,0.1023187563539078,0.10260781732969387,0.11311609724228927,0.11882130994397015,0.11952375909461684,0.10054500070859435,0.09590805683047064,0.109684120560157,0.11011586642052748,0.11270526451816365,0.10140749150480775,0.09722046716742147,0.10210729796090169,0.0974493790827350"
// Get element containing dates -- RETURNS STRING
const years = "1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020"
//// Parse strings to make lists -- RETURNS OBJECT
const fc_list_obj = forest_cover.split(",").map((fc) => parseFloat(fc));
const yr_list_obj = years.split(",").map((yr) => parseInt(yr));

const test_dict = {};
for(var i = 0; i < yr_list_obj.length; i++){
    test_dict[yr_list_obj[i]] = fc_list_obj[i];
};

console.log(test_dict);

const testit = (x) => {
    console.log(x);
}
testit('a');
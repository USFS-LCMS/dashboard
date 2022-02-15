define([
    "dojo/_base/declare"
], function(declare){

    return declare(null,{

        timeseries_types: null,
        bool_dict: null,
        filt_val_list: null,

        constructor: function(options){
            // this.timeseries_types = options.timeseries_types || {}; 
            this.bool_dict = options.bool_dict || {
                "question-1": false,
                "question-2": false
            };
        },
        //Function to download a pdf report
        pickChartType: function(in_key){
        
            // const quest_dict = {
            //     "question-1": "Change---Fast Loss",
            //     "question-2": "Change---Slow Loss"
            // };

            // Step 1: switch necessary switches on bool dict
            this.bool_dict[in_key] = !this.bool_dict[in_key];

            // Step 2: get keys of true values
            const bool_dict_entries = Object.entries(this.bool_dict);
            const filt_entries = bool_dict_entries.filter(([key,value]) => value === true);
            const filt_keys = filt_entries.map((keyval) => keyval[0]);

            // Step 3: assign class value based on keys that are "active" - or true
            const relationships = {
                "question-1": "Change---Fast Loss",
                "question-2": "Change---Slow Loss"
            };
            this.filt_val_list = filt_keys.map(k => relationships[k]);
            // alert(this.filt_val_list);
        }
    })
});
/*
Main File for Road Game Calculations
*/
// Wait for resource files to load (road_game.css, etc..)
// then check whether to display carbon features
window.onload = function() {
    // 'run_carbon' set in 'road_game_parameters_roads.js'
    // If true, lets un-hide our carbon elements!
    if (run_carbon){
        // By default carbon elements have "hide" class which sets
        // visibility to 'hidden'
        var hide_elements = document.getElementsByClassName("hide");

        var i;
        // Loop over carbon elements with 'hide' class and set visibility
        // to 'visible'
        for (i = 0; i < hide_elements.length; i++) {
            hide_elements[i].style.visibility = "visible";
        }
    }
};

// This function returns an array of road indices translated from game board
// row, col to matrix format.
function process_road_route(road_route){

    var road_indices = [];

    for (var i=0; i<road_route.length; i++)
    {
        var point_array = [];
        // Get the numerical index value from the alphabetical input
        point_array.push(row_translate.indexOf(road_route[i][0]));
        // Game board starts at 1 - 30, grab Int version of input and
        // subtract 1 to start at 0.
        point_array.push(parseInt(road_route[i][1]) - 1);
        // Simnply add the 3rd road param which deterimes if a 90 degree pixel
        point_array.push(road_route[i][2]);
        // Add new road index onto return array
        road_indices.push(point_array);
    }
    return road_indices;
};

// Given road indices in numerical format, return matrix where values of 1
// indicate direct road pixel and value of 2 indicates buffer pixel
function create_buffer_matrix(road_indices_array){
    var buffer_array = [];

    // Create a 30x30 matrix of 0s
    for (var i=0; i<matrix_map_size; i++){
        buffer_array.push([]);
        for (var j=0; j<matrix_map_size; j++){
            buffer_array[i].push(0);
        }
    }

    // Iterate over each road index
    for (var road_index=0; road_index<road_indices_array.length; road_index++){

        // Get 'row' value of the road index
        var row = road_indices_array[road_index][0];
        // Get 'col' value of the road index
        var col = road_indices_array[road_index][1];
        // Get the value indicating which kernel to use for buffer, 90 deg or
        // other
        var ker = road_indices_array[road_index][2];

        // Stamp a 1 for the direct road index.
        buffer_array[row][col] = 1;

        var kernel_index;
        // Iterate over the 3x3 kernel to look for buffer areas
        for (kernel_index=0; kernel_index < kern[ker].length; kernel_index++)
        {
            // x, y are the cells surrounding the road index
            var x = kern[ker][kernel_index][0] + row;
            var y = kern[ker][kernel_index][1] + col;

            // Make sure we're not out of bounds somewhere
            if (x >= 0 && x < matrix_map_size && y >= 0 && y < matrix_map_size){
                // Confusing, but basically that potential buffer isn't actually
                // another road pixel
                if (JSON.stringify(road_indices_array).indexOf(JSON.stringify([x, y, 0])) == -1 &&
                    JSON.stringify(road_indices_array).indexOf(JSON.stringify([x, y, 1])) == -1)
                {
                    // Make sure that we are NOT buffering on top of our city points
                    if (JSON.stringify(city_points).indexOf(JSON.stringify([x,y])) == -1){
                        // Finally set as buffer pixel
                        buffer_array[x][y] = 2;
                    }
                }
            }
        }
    }

    return buffer_array;
};

// Function sums values from 'cost_array' that fall under 'buffer_array' values
// that are either 1 or 2. 'use_buffer' indicates to only sum under 'buffer_array'
// where value is 2 (a buffer pixel), otherwise sum under value of 1 (road pixel)
function sum_array_mask(cost_array, buffer_array, use_buffer){

    var sum = 0;
    // Iterate over matrix
    for (var i=0; i<matrix_map_size; i++){
        for (var j=0; j<matrix_map_size; j++){
            if (use_buffer){
                if (buffer_array[i][j] == 2){
                    sum = cost_array[i][j] + sum;
                }
            }
            else{
                if (buffer_array[i][j] == 1){
                    sum = cost_array[i][j] + sum;
                }
            }
        }
    }
    return sum;
};

// For each index in 'mask_array' add the corresponding values from
// 'cost_array', if 'buffer_array' value is equal to 'buffer'.
function sum_mask_areas(cost_array, buffer_array, mask_array, buffer){

    var sum = 0;
    if (mask_array.length > 0){
        var mask_string = JSON.stringify(mask_array);
        for (var i=0; i<matrix_map_size; i++){
            for (var j=0; j<matrix_map_size; j++){
                if (buffer_array[i][j] == buffer && (mask_string.indexOf(JSON.stringify([i,j])) != -1)){
                    sum = cost_array[i][j] + sum;
                }
            }
        }
    }
    return sum;
};

// Returns array of indices translated from game board row, col
// to 2D array row, col values. Return translated index values
// from conservation blocks / wildlife crossings
function getCells(table){
    var results = [];
    // Iterate over table rows starting at 1 (0 is header)
    for (var i = 1, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        var points = [];
        var col_one = row.cells[1];
        var col_two = row.cells[2];

        if (col_one.firstChild.value == "" || col_two.firstChild.value == ""){
            continue;
        }
        else{
            // This is the row
            points.push(row_translate.indexOf(col_one.firstChild.value.toUpperCase()));
            // This is the column
            points.push(parseInt(col_two.firstChild.value) - 1);
            // Push point as row, col.
            results.push(points);
        }
    }
    return results;
};

// Call to display road benefit when a road has been selected
// 'road_dev_ben' defined in 'road_game_parameters_roads.js'
function displayBenefit(){
     document.getElementById("road_dev_ben").value = road_dev_ben;
};

// Main function to crunch numbers when user selects 'calculate'
function calculate(){
    try{
        var road_route = document.querySelector('input[name = "road_route"]:checked').value;
        console.log("road selected: " + road_route);
    }
    catch(err){
        // No road has been selected when clicking calculate!
        alert("No Road Selected!");
        return;
    }

    // Get the road indices
    var road_array = road_map[road_route];
    // Translate road indices from game board AA / base 1, to numerical base 0
    var road_ready = process_road_route(road_array);
    // Create a matrix representing the game board of road values and buffer
    // values. All else 0s
    var road_buffer_mask = create_buffer_matrix(road_ready);
    // Print out road buffer matrix
    console.log(JSON.stringify(road_buffer_mask));

    // Get Conservation Blocks and Wildlife Crossings
    var cons_blocks = getCells(document.getElementById("conservation_blocks"));
    var wildlife_crossings = getCells(document.getElementById("wildlife_crossings"));
    // Print out conservation and wildlife indices
    console.log(JSON.stringify(cons_blocks));
    console.log(JSON.stringify(wildlife_crossings));

    // Road construction cost score (RCS)  =
    // sum of values from RC array that fall under the direct path of the road ('road_const_cost')
    var road_const_cost = sum_array_mask(cost_points, road_buffer_mask, false)
    console.log("road_const_cost: " + road_const_cost);

    // Wildlife Crossing cost =
    // WCC * number of wildlife crossings used ('wild_cross_cost')
    var wild_cross_cost = wcc * wildlife_crossings.length;
    console.log("wild_cross_cost: " + wild_cross_cost);

    // Conservation block cost = PAC*number of conservation blocks ('cons_block_cost')
    var cons_block_cost = pac * cons_blocks.length;
    console.log("cons_block_cost: " + cons_block_cost);

    // Wildlife crossing benefit (WB) =
    // PHQ*sum of values in HQ array under any wildlife crossings located in the direct path of the road
    // (this value is reported in the scoring calculator, but not directly part of other calculations)
    var wild_cross_ben = (phq * sum_mask_areas(habitat_quality_points, road_buffer_mask, wildlife_crossings, 1));
    console.log("wild_cross_ben: " + wild_cross_ben);

    // Conservation block benefits (CBB) =
    // PPA*sum of values in CS array under any conservation blocks located in the road buffer (cons_carb_ben)+
    // PPA*sum of values in LR array under any conservation blocks located in the road buffer (cons_eros_ben)+
    // PPA*sum of values in HQ array under any conservation blocks located in the road buffer (cons_hq_ben)
    // (this value is reported in the scoring calculator, but not directly part of other calculations)
    var cons_carb_ben = 0;
    if (run_carbon) {
        cons_carb_ben = (ppa * sum_mask_areas(carbon_points, road_buffer_mask, cons_blocks, 2));
        console.log("cons_carb_ben: " + cons_carb_ben);
    }
    var cons_eros_ben = (ppa * sum_mask_areas(erosion_points, road_buffer_mask, cons_blocks, 2));
    var cons_hq_ben = (ppa * sum_mask_areas(habitat_quality_points, road_buffer_mask, cons_blocks, 2));
    var cons_block_ben = cons_carb_ben + cons_eros_ben + cons_hq_ben + cons_hq_ben;
    console.log("cons_block_ben : " + cons_block_ben);

    // Carbon storage loss score (CSS) =
    // sum of values from CS array under the direct path of the road*PD ('css_direct') +
    // sum of values from CS array under the road buffer*PB ('css_buffer') -
    // PPA*sum of values in CS array under any conservation blocks located in the road buffer ('css_cons')
    // Initialize to 0 for case where we don't use carbon
    var css_direct = 0;
    var css_buffer = 0;
    var css_cons = 0;
    var carb_stor_loss = css_direct + css_buffer - css_cons;
    if (run_carbon) {
        css_direct = (sum_array_mask(carbon_points, road_buffer_mask, false) * pd);
        css_buffer = (sum_array_mask(carbon_points, road_buffer_mask, true) * pb);
        css_cons = (ppa * sum_mask_areas(carbon_points, road_buffer_mask, cons_blocks, 2));
        carb_stor_loss = css_direct + css_buffer - css_cons;
    }
    console.log("carb_stor_loss: " + carb_stor_loss);

    // Drinking water quality loss score (WQS) =
    // sum of values from WQ array under the direct path of the road*PD ('wqs_direct') +
    // sum of values from WQ array under the road buffer*PB ('wqs_buffer') -
    // PPA*sum of values in CS array under any conservation blocks located in the road buffer ('wqs_cons')
    var wqs_direct = (sum_array_mask(sed_retention_points, road_buffer_mask, false) * pd);
    var wqs_buffer = (sum_array_mask(sed_retention_points, road_buffer_mask, true) * pb);
    var wqs_cons = 0;
    if (run_carbon) {
        wqs_cons = (ppa * sum_mask_areas(carbon_points, road_buffer_mask, cons_blocks, 2));
    }
    var wqs_loss = wqs_direct + wqs_buffer - wqs_cons;
    console.log("water_qual_loss: " + wqs_loss);

    // Erosion risk to road score (ERS)  =
    // sum of values from ER array under the direct path of the road*PD ('eros_cont_direct') +
    // sum of values from ER array under the road buffer*PB ('eros_cont_buffer') -
    // PPA*sum of values in ER array under any conservation blocks located in the road buffer ('eros_cont_cons')
    var eros_cont_direct = (sum_array_mask(erosion_points, road_buffer_mask, false) * pd);
    var eros_cont_buffer = (sum_array_mask(erosion_points, road_buffer_mask, true) * pb);
    var eros_cont_cons = (ppa * sum_mask_areas(erosion_points, road_buffer_mask, cons_blocks, 2));
    var eros_cont_loss = eros_cont_direct + eros_cont_buffer - eros_cont_cons;
    console.log("eros_cont_loss : " + eros_cont_loss);

    // Habitat loss score (HQS) =
    // sum of values from HQ array under the direct path of the road*PD ('hqs_direct') +
    // sum of values from HQ array under the road buffer*PB ('hqs_buffer') -
    // PPA*sum of values in HQ array under any conservation blocks located in the road buffer ('hqs_cons') -
    // PHQ*sum of values in HQ array under any wildlife crossings located in the direct path of the road ('hqs_wild')
    var hqs_direct = (sum_array_mask(habitat_quality_points, road_buffer_mask, false) * pd);
    var hqs_buffer = (sum_array_mask(habitat_quality_points, road_buffer_mask, true) * pb);
    var hqs_cons = (ppa * sum_mask_areas(habitat_quality_points, road_buffer_mask, cons_blocks, 2));
    var hqs_wild = (phq * sum_mask_areas(habitat_quality_points, road_buffer_mask, wildlife_crossings, 1));
    var hab_qual_loss = hqs_direct + hqs_buffer - hqs_cons - hqs_wild;
    console.log("hab_qual_loss: " + hab_qual_loss);

    // Total environmental loss score (TES) = CSS + WQS + LRS + HQS
    var total_env_loss = carb_stor_loss + wqs_loss + eros_cont_loss + hab_qual_loss;
    console.log("total_env_loss: " + total_env_loss);

    // Total score = road_dev_ben - RCS - CSS - WQS - LRS - HQS - PAS
    //var total_final = road_dev_ben - rcc_res - carb_stor_loss - wqs_res - lrs_res - hab_qual_loss - cons_block_score;
    var total_final = road_dev_ben - cons_block_cost - wild_cross_cost - road_const_cost - carb_stor_loss - total_env_loss;
    console.log("total_final: " + total_final);

    var output_map = [
        ["road_cons_cost", road_const_cost], ["wild_cross_cost", wild_cross_cost], ["cons_block_cost", cons_block_cost],
        ["total_env_losses", total_env_loss], ["total", total_final], ["wild_cross_ben", wild_cross_ben], ["cons_block_ben", cons_block_ben],
        ["water_qual_loss", wqs_loss], ["eros_cont_loss", eros_cont_loss], ["habitat_loss", hab_qual_loss], ["carbon_cost", carb_stor_loss] ];

    for (var i = 0; i < output_map.length; i++){

        var output_box = document.getElementById(output_map[i][0]);
        output_box.value = output_map[i][1];
    }
};

// Sets up inputs for an example run
function example(){

    // Default road A. options: "road_B", "road_C", "road_D", "road_E"
    var radiobtn = document.getElementById("road_A");
    radiobtn.checked = true;
    displayBenefit();
     // Get Conservation Blocks and Wildlife Crossings
    var cons_table = document.getElementById("conservation_blocks");
    var cons_blocks = [["G", "9"],["H", "8"]];
    var wildlife_table = document.getElementById("wildlife_crossings");
    var wild_crossings = [["G", "8"],["H", "9"]];

    // Set cons block input values
    for (var i = 1, row; row = cons_table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        var col_one = row.cells[1];
        var col_two = row.cells[2];
        if ((i) > cons_blocks.length)
        {
            break;
        }
        col_one.firstChild.value = cons_blocks[i-1][0];
        col_two.firstChild.value = cons_blocks[i-1][1];
    }
    // Set wildlife crossing input values
    for (var i = 1, row; row = wildlife_table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        var col_one = row.cells[1];
        var col_two = row.cells[2];
        if ((i) > wild_crossings.length)
        {
            break;
        }
        col_one.firstChild.value = wild_crossings[i-1][0];
        col_two.firstChild.value = wild_crossings[i-1][1];
    }
};

// Clear all inputs / outputs
function clearText(){

    var road_route = document.querySelector('input[name = "road_route"]:checked');
    road_route.checked = false;

    // Get Conservation Blocks and Wildlife Crossings
    var cons_table = document.getElementById("conservation_blocks");
    var wildlife_table = document.getElementById("wildlife_crossings");
    var output_table = document.getElementById("outputs");

    for (var i = 1, row; row = cons_table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        var col_one = row.cells[1];
        var col_two = row.cells[2];
        col_one.firstChild.value = "";
        col_two.firstChild.value = "";
    }
    for (var i = 1, row; row = wildlife_table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        var col_one = row.cells[1];
        var col_two = row.cells[2];
        col_one.firstChild.value = "";
        col_two.firstChild.value = "";
    }

    var inputs = output_table.getElementsByTagName( 'input' );
    for ( var z = 0; z < inputs.length; z++ ) {
        inputs[z].value = "";
    }
};
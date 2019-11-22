/*
This file holds the parameter values and the road arrays for the
Road Infrastructure Tradeoff Game
*/

// Size of our map. 30x30
var matrix_map_size = 30;

// Road Development Score
var road_dev_ben = 6000.0;

// Run using Carbon Storage, true or false
var run_carbon = false;

// Proportion of environmental values (carbon, drinking water quality,
// landslide risk, habitat quality) impacted in direct road path
var pd = 1.0;
// Proportion of environmental values (carbon, drinking water quality,
// landslide risk, habitat quality) impacted in road buffer
var pb = 0.5;
// Wildlife Crossing Cost
var wcc = 20.0;
// Proportion of original habitat quality score retained under
// wildlife crossing PHQ
var phq = 0.5;
// Protected area cost PAC
var pac = 50.0;
// Proportion of original environmental values (carbon, drinking water quality,
// landslide risk, habitat quality) retained in protected area PPA
var ppa = 1.0;

// City locations are D5 and AA28 on map
// City points as related to 2D array are:
var city_points = [[3, 4], [26, 27]];

// List of row indicators whose index represents row number in
// 2D array space
var row_translate = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
                     "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
                     "W", "X", "Y", "Z", "AA", "AB", "AC", "AD"];

// The following arrays are kernels which represent the buffer indices
// to check around a road pixel.

// This kernel is for a ninety degree turn pixel and looks to set buffer
// values NW, N, NE, W, E, SW, S, SE
// 1 1 1
// 1 0 1
// 1 1 1
var kernel_90 = [[-1, -1], [-1, 0], [-1, 1],
                  [0, -1], [0, 1],
                  [1, -1], [1, 0], [1, 1]]

// A normal kernel for all other pixels
// W, N, E, S
// 0 1 0
// 1 0 1
// 0 1 0
var kernel = [[-1, 0], [0, -1], [0, 1], [1, 0]]

// Map for the kernel typle selectoin
var kern = {0: kernel, 1: kernel_90};

// The following roads are indexed in order from City D5 to City AA28
// The first value is row position, then column position as viewed by
// map. The third value is whether the pixel is a 90 degree turn pixel.
// 0 indicates no, 1 indicates yes.
// ["E", "6", 0] = E6 on the map, and NOT a 90 degree pixel.
var road_a = [
    ["E", "6", 0], ["F", "7", 0], ["G", "8", 0], ["H", "9", 0], ["I", "10", 0], ["J", "11", 0],
    ["K", "12", 0], ["L", "13", 0], ["M", "14", 0], ["N", "15", 0], ["O", "16", 0], ["P", "17", 0],
    ["Q", "18", 0], ["R", "19", 0], ["S", "20", 0], ["T", "21", 0], ["U", "22", 0], ["V", "23", 0],
    ["W", "24", 0], ["X", "25", 0], ["Y", "26", 0], ["Z", "27", 0]];
var road_b = [
    ["E", "5", 0], ["F", "5", 0], ["G", "5", 0], ["H", "5", 0], ["I", "5", 0], ["J", "5", 0], ["K", "6", 0],
    ["L", "7", 0], ["M", "8", 0], ["N", "9", 0], ["O", "10", 0], ["P", "11", 0], ["Q", "12", 0], ["R", "13", 0],
    ["S", "14", 0], ["T", "15", 0], ["U", "16", 0], ["U", "17", 0], ["U", "18", 0], ["U", "19", 0], ["U", "20", 0],
    ["U", "21", 0], ["U", "22", 0], ["V", "23", 0], ["W", "24", 0], ["X", "25", 0], ["Y", "26", 0], ["Z", "27", 0]];

var road_c = [
    ["E", "6", 0], ["F", "7", 0], ["F", "8", 0], ["F", "9", 0], ["F", "10", 0], ["F", "11", 0], ["F", "12", 0],
    ["F", "13", 0], ["F", "14", 0], ["F", "15", 0], ["F", "16", 0], ["F", "17", 0], ["F", "18", 0], ["G", "19", 0],
    ["H", "20", 0], ["I", "21", 0], ["J", "22", 0], ["K", "23", 0], ["L", "24", 0], ["M", "25", 0], ["N", "26", 0],
    ["O", "27", 0], ["P", "28", 0], ["Q", "28", 0], ["R", "28", 0], ["S", "28", 0], ["T", "28", 0], ["U", "28", 0],
    ["V", "28", 0], ["W", "28", 0], ["X", "28", 0], ["Y", "28", 0], ["Z", "28", 0]];

var road_d = [
    ["E", "6", 0], ["F", "7", 0], ["G", "8", 0], ["H", "8", 0], ["I", "8", 0], ["J", "8", 0], ["K", "8", 0], ["L", "8", 0],
    ["M", "8", 0], ["N", "8", 0], ["O", "8", 0], ["P", "8", 0], ["Q", "8", 0], ["R", "8", 0], ["S", "9", 0], ["T", "10", 0],
    ["U", "11", 0], ["V", "12", 0], ["W", "13", 0], ["X", "14", 0], ["Y", "15", 0], ["Y", "16", 0], ["Y", "17", 0],
    ["Y", "18", 0], ["Y", "19", 0], ["Y", "20", 0], ["Y", "21", 0], ["Y", "22", 0], ["Y", "23", 0], ["Y", "24", 0],
    ["Y", "25", 0], ["Y", "26", 0], ["Z", "27", 0]];

var road_e = [
    ["D", "6", 0], ["D", "7", 0], ["D", "8", 0], ["D", "9", 0], ["D", "10", 0], ["D", "11", 0], ["D", "12", 0], ["D", "13", 0],
    ["D", "14", 0], ["D", "15", 0], ["D", "16", 0], ["D", "17", 0], ["D", "18", 0], ["D", "19", 0], ["D", "20", 0], ["D", "21", 0],
    ["D", "22", 0], ["D", "23", 0], ["D", "24", 0], ["D", "25", 0], ["E", "26", 0], ["F", "27", 0], ["G", "28", 0], ["H", "28", 0],
    ["I", "28", 0], ["J", "28", 0], ["K", "28", 0], ["L", "28", 0], ["M", "28", 0], ["N", "28", 0], ["O", "28", 0], ["P", "28", 0],
    ["Q", "28", 0], ["R", "28", 0], ["S", "28", 0], ["T", "28", 0], ["U", "28", 0], ["V", "28", 0], ["W", "28", 0], ["X", "28", 0],
    ["Y", "28", 0], ["Z", "28", 0]];

// Map for our road types. Mapping html value to html element id
var road_map = {"A":road_a, "B":road_b, "C":road_c, "D":road_d, "E":road_e};

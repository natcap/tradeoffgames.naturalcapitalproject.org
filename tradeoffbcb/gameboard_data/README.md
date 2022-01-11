# Gameboard Data

The Best Coast Belize gameboard, while 2-dimensional, is mostly empty except
for SDUs around the shoreline and the offshore islands.  Thus, a sparse matrix
is the best way to represent this information.  The CSV `gameboard_data.csv`
represents the attributes of each SDU, and these are then converted into a JS
file that can be loaded into the main javascript calculator.

## gameboard_data.csv

This CSV represents the attributes of SDUs that have scores.  The columns of
the CSV are:

* `row_index`: The SDU row index.
* `column_index`: The SDU column index.
* `tourism_quality`: A relative value, an integer value 0-5 representing the
  value of tourism in that SDU.  5 represents the best tourism value.
* `fishing_quality`: A relative value, an integer value 0-5 representing the
  value of fishing in that SDU.  5 represents the best fishing value.
* `coral_km2`: A floating-point value representing the area of coral habitat
  (in km^2) that exists within this SDU.
* `mangroves_km2`: A floating-point value representing the area of mangrove
  habitat (in km^2) that exists within this SDU.
* `seagrass_km2`: A floating-point value representing the area of seagrass
  habitat (in km^2) that exists within this SDU.
* `cv_score`: A relative value, an integer between 0-3, representing the
  vulnerability of the pixel.  0 indicates no vulnerability (which is the case
  in offshore, entirely-water SDUs and landlocked SDUs) while 3 indicates high
  vulnerability.
* `not_sure_what_this_is`: This floating-point value was in the original data
  object used in the calculator before the 2022 refactor, but it was unused.
  There is no information about what this value is supposed to represent.  I
  left it in the CSV in case it's important for some reason, or if future us
  has a stroke of insight as to its meaning.

## gameboard_data.js

This javascript file contains the CSV data rendered as a javascript array of
objects, where the attributes are taken from the CSV.

The reason CSV data is rendered as a javascript file is that it is very
convenient to load a JS file from HTML as a `<script>`, while it can be quite
annoying to get the Cross-Origin Resource request stuff configured as expected
in order to load and parse a CSV directly.  Thus, we render the CSV as a JS
file and just use that.  It's fine.  It's good enough.

But to keep everything in sync, if you need to modify the data of the
gameboard, please just modify the CSV and rerender the JS.  Don't directly edit
the JS.

## render_csv_to_js.py

This is the script that converts the `gameboard_data.csv` into
`gameboard_data.js`.  To run the script, execute the following:

```
$ python render_csv_to_js.py
```

The script takes no parameters and only uses the standard library.

import textwrap
import json
import csv

JS_FILE_HEADER = """
    // Gameboard Data.
    //
    // This file is generated by the python script
    // render_csv_to_js.py, based on the CSV data stored at
    // gameboard_data.csv.
    //
    // If this file needs to be modified, please don't do so directly.
    // Instead, modify the CSV and then rerender this file using the python
    // script.
"""


def main(csv_path, target_js_path):
    with open(target_js_path, 'w') as js_data_file:
        table_data_json = json.dumps(
            list(csv.DictReader(open(csv_path))),
            indent=4)
        js_data_file.write(textwrap.dedent(JS_FILE_HEADER))
        js_data_file.write(
            f'var gameboard_data={table_data_json};')


if __name__ == '__main__':
    main('gameboard_data.csv', 'gameboard_data.js')

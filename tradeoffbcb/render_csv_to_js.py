import json
import csv

def main(csv_path, target_js_path):
    with open(target_js_path, 'w') as js_data_file:
        table_data_json= json.dumps(list(
            csv.DictReader(open(csv_path))))
        js_data_file.write(
            f'var gameboard_data={table_data_json};')


if __name__ == '__main__':
    main('gameboard_data.csv', 'gameboard_data.js')

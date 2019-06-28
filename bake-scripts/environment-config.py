#! /usr/bin/env python
import json
import pipes
import sys

def main(argv):
    config_json = json.load(open(argv[1], "r"))
    api_url = config_json["configuration"]["API_URL"]

    with open('/usr/lib/digital-paper-edit-client/build/env.js', 'w') as react_config:
        react_config.write("window.env = {{ API_URL: \"{0}\" }}".format(api_url));

if __name__ == "__main__":
    sys.exit(main(sys.argv))

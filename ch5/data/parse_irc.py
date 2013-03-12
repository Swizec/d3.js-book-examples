
import json
import os
import re

karma = re.compile("\w+\+\+")

def parse(entry):
    return {'time': entry['time'],
            'from': entry['nick'],
            'to': re.findall(karma, entry['message'])[0]}

if __name__ == '__main__':
    file = os.path.join(
        os.path.split(os.path.realpath(__file__))[0],
        'irc_dump.json')

    print [parse(entry) for entry in json.loads(open(file).read())
           if '++' in entry['message']][30]

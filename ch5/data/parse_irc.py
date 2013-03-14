
import json
import os
import re

karma = re.compile("\w{2,20}\+\+|\+\+\w{2,10}")

def parse(entry):
    return {'time': entry['time'],
            'from': entry['nick'],
            'to': re.findall(karma, entry['message'])[0].replace('+', '')}

def normalize(entries):
    # bare form to first occurence map
    nicks = {}

    for entry in entries:
        bare_from = entry['from'].lower()[:4]
        bare_to = entry['to'].lower()[:4]

        if not bare_from in nicks:
            nicks[bare_from] = entry['from']

        if not bare_to in nicks:
            nicks[bare_to] = entry['to']

        entry['from'] = nicks[bare_from]
        entry['to'] = nicks[bare_to]

        yield entry

if __name__ == '__main__':
    file = os.path.join(
        os.path.split(os.path.realpath(__file__))[0],
        'irc_dump.json')

    karmas = normalize(parse(entry) for entry in json.loads(open(file).read())
                       if re.match(karma, entry['message']))

    open(os.path.join(
        os.path.split(os.path.realpath(__file__))[0],
        'karma_matrix.json'), 'w').write(json.dumps(list(karmas)))

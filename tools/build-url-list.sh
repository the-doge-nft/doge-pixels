#!/bin/bash
for x in {0..640}
do
  for y in {0..480}
  do
    echo "http://143.198.55.229/ipns/k51qzi5uqu5di5wb62lm8ix9tev70ugcj8a8ikn3np2n33qnezaumg1phfzexi/metadata/metadata-${x}_$y.json" >> urls.txt
  done
done

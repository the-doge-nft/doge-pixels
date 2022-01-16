#!/bin/bash
for x in {0..640}
do
  for y in {0..480}
  do
    index_with_offset=$(( 1000000 + $x + $y * 640 ))
    echo "http://143.198.55.229/ipns/k51qzi5uqu5di5wb62lm8ix9tev70ugcj8a8ikn3np2n33qnezaumg1phfzexi/metadata/pixel-$index_with_offset.json" >> urls.txt
  done
done

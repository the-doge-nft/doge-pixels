#!/bin/bash
slugify(){
  echo "$1" | iconv -t ascii//TRANSLIT | sed -r s/[^a-zA-Z0-9]+/-/g | sed -r s/^-+\|-+$//g | tr A-Z a-z
}
mycurl() {
#    alert
    slug=$(slugify $1)
#    echo "$slug"
#    echo "------ caching $1 ------"
    HTTP_CODE=$(curl "$1" --write-out "%{http_code}"  -s -o "./output/$slug.json")
    if [[ ${HTTP_CODE} -lt 200 || ${HTTP_CODE} -gt 299 ]] ; then
      echo "ERROR!!!!! $1 GOT NONO 200 ($HTTP_CODE) RESPONSE"
      exit 420
      return 42069
    fi
    echo "$1 --> 200"
#    START=$(date +%s)
#    curl -s "http://some_url_here/"$1  > $1.txt
#    END=$(date +%s)
#    DIFF=$(( $END - $START ))
#    echo "It took $DIFF seconds"
}
export -f slugify
export -f mycurl
mkdir output || true
#mycurl
#seq 10 | echo "abc"
#seq 10 | xargs parallel mycurl--
#cat test.txt | parallel -j 10 mycurl
cat urls.txt | parallel -j 10 mycurl
#parallel mycurl2
#echo "end"

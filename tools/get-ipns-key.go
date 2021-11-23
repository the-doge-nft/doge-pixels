package main

import (
    "bufio"
    "bytes"
    "encoding/pem"
    "fmt"
    "log"

    "github.com/ipfs/go-ipfs/keystore"
    b58 "github.com/mr-tron/base58/base58"
    mh "github.com/multiformats/go-multihash"
)

func main() {
    ks, err := keystore.NewFSKeystore("/Users/username/.ipfs/keystore/")
    if err != nil {
        log.Fatal(err)
    }

    priv, err := ks.Get("mykey")
    if err != nil {
        log.Fatal(err)
    }

    privBytes, err := priv.Bytes()
    if err != nil {
        log.Fatal(err)
    }

    var privPEM bytes.Buffer
    privWriter := bufio.NewWriter(&privPEM)
    pem.Encode(privWriter, &pem.Block{
        Type:  "RSA PRIVATE KEY",
        Bytes: privBytes,
    })
    privWriter.Flush()

    pub := priv.GetPublic()
    var pubPEM bytes.Buffer
    pubBytes, err := pub.Bytes()
    pubWriter := bufio.NewWriter(&pubPEM)
    pem.Encode(pubWriter, &pem.Block{
        Type:  "RSA PUBLIC KEY",
        Bytes: pubBytes,
    })
    pubWriter.Flush()

    privPEMString := string(privPEM.Bytes())
    pubPEMString := string(pubPEM.Bytes())

    var alg uint64 = mh.SHA2_256
    maxInlineKeyLength := 42
    if len(pubBytes) <= maxInlineKeyLength {
        alg = mh.ID
    }
    hash, _ := mh.Sum(pubBytes, alg, -1)
    peerID := b58.Encode(hash)

    fmt.Println(privPEMString)
    fmt.Println(pubPEMString)
    fmt.Println("IPNS:", peerID)
}

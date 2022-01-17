//imports needed for this function
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const FormData = require('form-data');
const recursive = require('recursive-fs');
const basePathConverter = require('base-path-converter');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

// https://docs.pinata.cloud/api-pinning/pin-file#pinning-a-directory-example
const pinDirectoryToIPFS = (pinataApiKey, pinataSecretApiKey) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const src = './deploy/pixels-sharded/folder1';

    console.log("test1");
    //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
    recursive.readdirr(src, function (err, dirs, files) {
        console.log("test2");

        let data = new FormData();
        files.forEach((file) => {
            console.log("xx: " + file);
            //for each file stream, we need to include the correct relative file path
            data.append(`file`, fs.createReadStream(file), {
                filepath: basePathConverter(src, file)
            });
        });

        console.log("after");
        const metadata = JSON.stringify({
                                            name: 'dog-pixelz-sharded-api'
                                        });
        data.append('pinataMetadata', metadata);

        return axios
            .post(url, data, {
                maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    pinata_api_key: pinataApiKey,
                    pinata_secret_api_key: pinataSecretApiKey
                }
            })
            .then(function (response) {
                //handle response here
                console.log("success");
                console.log(response);
            })
            .catch(function (error) {
                console.error(error);
                throw error;
            });
    });
};

// https://github.com/PinataCloud/Pinata-SDK#pinfromfs
const pinFromSDKFS = (pinataName, path) => {
    return new Promise((resolve) => {
        const options = {
            pinataMetadata: {
                name: pinataName
            }
        };
        console.log(`pinning ${path} to ${pinataName}`)
        pinata.pinFromFS(path, options).then((result) => {
            //handle results here
            console.log(result);
            console.log("");
            resolve()
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
    })
    //
    // const filters = {
    //     // status : 'pinned',
    //     // pageLimit: 10,
    //     // pageOffset: 0,
    //     // metadata: metadataFilter
    // };
    // pinata.pinList(filters).then((result) => {
    //     //handle results here
    //     // console.log   (JSON.stringify(result, null, 2));
    // }).catch((err) => {
    //     //handle error here
    //     console.log(err);
    // });
}
(async () => {
    const qty = parseInt(process.env.PINATA_SHARD_QTY);
    const root = process.env.PINATA_SHARD_ROOT
    // for (let i = 1; i <= qty; ++i) {
    //     // pinDirectoryToIPFS('0fd2a01cd5932b1bb9b8', '202f988efc3c0e8866db1ce3c2b2b2956798e60898198cd00ef2e32636d2cd92');
    //     await pinFromSDKFS(`dog-pixelz-api-sh${i}_${qty}`, `${root}pixels-sh${i}`);
    //     console.log("next " + i);
    // }
    for (let i = 1; i <= qty; ++i) {
        // pinDirectoryToIPFS('0fd2a01cd5932b1bb9b8', '202f988efc3c0e8866db1ce3c2b2b2956798e60898198cd00ef2e32636d2cd92');
        await pinFromSDKFS(`dog-metadata-api-sh${i}_${qty}`, `${root}metadata-sh${i}`);
        console.log("next " + i);
    }

})();

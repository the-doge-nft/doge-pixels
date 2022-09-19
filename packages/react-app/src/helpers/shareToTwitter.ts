import {Http} from "../services";
import env from "../environment";

const shareToTwitter = (data: any, message: string) => {

    Http.post('/v1/twitter/upload/image', {data})
        .then(({data}) => {
            console.log('debug:: res', data)
            const { id } = data
            const screenshotUrl = `${env.api.baseURL}/v1/twitter/share/${id}`
            const text = encodeURIComponent(`${message}\n${screenshotUrl}`);
            window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
        })
        .catch((e) => {
            console.error(e)
        })


    // fetch("https://prod.hmstrs.com/twitter/upload", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //         data,
    //         ext: "png",
    //     }),
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data && data.id && data.location) {
    //             const screenshotUrl = "https://prod.hmstrs.com/twitter/" + data.id;
    //             const text = encodeURIComponent(`${message}\n${screenshotUrl}`);
    //             window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    //         }
    //     })
    //     .catch(err => {
    //         console.error(err);
    //     });
}

export default shareToTwitter

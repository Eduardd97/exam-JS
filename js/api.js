let jobs = [];

export class API {
    constructor(
        baseUrl = "",
        options = {
            headers: {
                "X-RapidAPI-Key":
                    "c041e33b1cmshae284785fd90ef0p11e14bjsnb40794721da1",
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
            },
        }
    ) {
        this.baseUrl = baseUrl;
        this.options = options;
    }

    async searchJobs(job) {
        await this.delay(4000);
        const response = await axios({
            method: "GET",
            url: `${this.baseUrl}`,
            params: {
                query: job,
                page: "2",
                num_pages: "2",
            },
            headers: this.options.headers,
        });

        jobs = response.data.data;

        return jobs;
    }

    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
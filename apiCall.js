// ***** API Call ****//

const getQuote = async () => {
    try {

        let res = await axios.get('https://api.quotable.io/random?minLength=55&maxLength=69')
        let dailyQuote = `"${res.data.content}"`
        let author = res.data.author
        runtime = new DecodeQuote(dailyQuote, author)

    } catch (e) {
        let dailyQuote = "I love deadlines. I love the whooshing noise they make as they go by."
        let author = "Douglas Adams"
        runtime = new DecodeQuote(dailyQuote, author)
    }
    runtime.spanify(runtime.decodeThis)

}
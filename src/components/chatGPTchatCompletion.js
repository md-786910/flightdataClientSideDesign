const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function createChatCompletionFn(prompt, productsData) {
    const tablefields = [
        "productName",
        "description",
        "price(Rs)",
        "qty",
    ];

    const productsDataString = productsData
        .map(
            (product) =>
                `${product.productName}, ${product.description}, ${product.price}, ${product.qty}`
        )
        .join("\n");
    const tableFieldsString = tablefields.join(", ");

    const query = `${prompt}\nuse only following data to answer\n\n${tableFieldsString} are the headers and \n${productsDataString} is the data respectively for those headers`;
    console.log("query", query);
    const { data } = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: query,
            },
        ],
    });

    console.log(data?.choices[0]?.message?.content);
    return data?.choices[0]?.message?.content;
}

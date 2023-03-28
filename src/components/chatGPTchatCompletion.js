import axios from 'axios';
import { API } from '../pages/api';

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function createChatCompletionFn (prompt, productsData, isCart = false) {
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
    prompt = isCart ? 'tell me about these items in short, and call them cart items' : prompt;
    const query = `${prompt} , I have provided you the necessary information here:-, \n\n ${tableFieldsString} are the table headers and \n ${productsDataString} is the data respectively for those table headers`;
    const { data } = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: query,
            },
        ],
    });

    return data?.choices[0]?.message?.content;
}

// Regular expressions for matching user queries
const addToCartRegex = /add\s+([\w\s]+)\s+to\s+cart/i;;
const cartTotalRegex = /(cart\s+(total|price))|((total|price)\s+cart)/i;
const cartItemsRegex = /(what is|show me|get) (my )?(cart items|cart|shopping cart)/i;

// Function to handle user input and call the appropriate API
export async function handleUserInput (input, products = [], cartProducts) {
    if (addToCartRegex.test(input)) {
        const productName = findProductName(input);
        console.log(productName);
        const product = productName && products.find(p => p.productName.toLowerCase() === productName.toLowerCase());
        if (product) {
            addToCart(product._id);
            return `Added ${product.productName} to cart`;
        } else {
            return `Sorry, we don't have ${productName || 'this product'}`;
        }
    } else if (cartTotalRegex.test(input)) {
        return `Your cart total is ₹${getCartTotal(cartProducts)}`;
    } else if (cartItemsRegex.exec(input)) {
        return createChatCompletionFn(input, cartProducts, true);
    } else return "I'm sorry, I didn't understand your query";
}

// Function to add a product to the cart
async function addToCart (productId) {
    // Call your add to cart API here
    await axios.post(`${API}/carts`, { id: productId })
}

// Function to get the cart total
function getCartTotal (cartProducts) {
    const cartTotal = calculateCartTotal(cartProducts);
    // Call your get cart total API here and return the total as a number
    return cartTotal || 0;
}

function calculateCartTotal (products) {
    let totalPrice = 0;
    for (let i = 0; i < products?.length; i++) {
        totalPrice += products[i]?.price;
    }
    return totalPrice;
}

// Helper function to extract the product name from user input
function findProductName (userInput) {
    const regex = /add\s+([\w\s]+)\s+to\s+cart/i;
    const match = regex.exec(userInput);
    const productName = match && match[1]?.trim();
    if (productName) {
        return productName;
    }

    return null;
}

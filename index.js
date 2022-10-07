const fs = require("fs");
const http = require("http");
const url = require("url");
///////////////////////////////
////FILE READ/ WRITE

// const text = fsModule.readFileSync("./txt/read-this.txt", "utf-8");
// console.log(text);
// const textOutput = `This is written text: ${text}`;
// console.log(text);
// const writeText = fsModule.writeFileSync("./txt/read-this.txt", textOutput);

// console.log(fsModule.readFileSync("./txt/read-this.txt", "utf-8"));
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};
///////////////////////////////
////read data

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

///////////////////////////////
////SERVER / CLIENT
const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  } else if (pathName === "/product") {
    res.end("This is product page");
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(400, {
      "Content-type": "text/html",
      "random-text-from-srver": "404 error not found",
    });
    res.end("<h2>Page Not Found </h2>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listeing on port 8000");
});

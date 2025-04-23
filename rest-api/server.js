const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { ApolloServer, gql } = require('apollo-server');
const WebSocket = require('ws');
const fs = require('fs');
const ejs = require('ejs');

const API_PORT = 8080;
const WEB_PORT = 3000;
const GRAPHQL_PORT = 4000;
const WEBSOCKET_PORT = 5001;
const DATA_FILE = 'db/db.json';

const options = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'Shop API', version: '1.0.0' },
    },
    apis: ['./server.js'],
};

const typeDefs = gql`
    type Product {
        id: ID!
        name: String!
        price: Float
        description: String
        categories: [String]
    }

    type Query {
        products(name: String, category: String): [Product]
        product(id: ID!): Product
    }
`;

const resolvers = {
    Query: {
        products: (_, { name, category }) => {
            let products = readProducts();
            if (name) {
                products = products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
            }
            if (category && category !== 'all') {
                products = products.filter(p => p.categories && p.categories.includes(category));
            }
            return products;
        },
        product: (_, { id }) => readProducts().find(p => p.id == id),
    },
};


const app_api = express();
const app_web = express();
const specs = swaggerJsdoc(options);
const server = new ApolloServer({ typeDefs, resolvers });
const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });

app_web.set('view engine', 'ejs');
app_web.set('views', path.join(__dirname, 'views'));
app_web.use(express.static(path.join(__dirname, 'public')));
app_web.use(bodyParser.json());
app_api.use(bodyParser.json());
app_api.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

function readProducts() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) {
        console.error('Error reading products file:', err);
        return [];
    }
}

function writeProducts(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing products file:', err);
    }
}

app_web.get('/', (req, res) => {
    const products = readProducts();
    res.render('index', { products });
});

app_web.get('/add', (req, res) => {
    res.render('add');
});

app_web.get('/edit/:id', (req, res) => {
    let products = readProducts();
    const product = products.find(p => p.id == req.params.id);
    if (product) {
        res.render('edit', { product });
    } else {
        res.status(404).send('Product not found');
    }
});

app_web.put('/api/products/:id', (req, res) => {
    let products = readProducts();
    const index = products.findIndex(p => p.id == req.params.id);
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        writeProducts(products);
        res.json(products[index]);
    } else {
        res.status(404).send('Product not found');
    }
});

app_web.delete('/api/products/:id', (req, res) => {
    let products = readProducts();
    const filteredProducts = products.filter(p => p.id != req.params.id);
    if (filteredProducts.length === products.length) {
        return res.status(404).send('Product not found');
    }
    writeProducts(filteredProducts);
    res.status(204).send();
});

app_web.post('/api/products', (req, res) => {
    const products = readProducts();
    const newProduct = { id: Date.now().toString(), ...req.body };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// Swagger Documentation for API
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Server error
 */
app_api.get('/api/products', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error loading products');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
app_api.put('/api/products/:id', (req, res) => {
    let products = readProducts();
    const index = products.findIndex(p => p.id == req.params.id);
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        writeProducts(products);
        res.json(products[index]);
    } else {
        res.status(404).send('Product not found');
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
app_api.delete('/api/products/:id', (req, res) => {
    let products = readProducts();
    const filteredProducts = products.filter(p => p.id != req.params.id);
    if (filteredProducts.length === products.length) {
        return res.status(404).send('Product not found');
    }
    writeProducts(filteredProducts);
    res.status(204).send();
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product added
 */
app_api.post('/api/products', (req, res) => {
    const products = readProducts();
    const newProduct = { id: Date.now().toString(), ...req.body };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// Start all services
app_api.listen(API_PORT, () => console.log(`API running on port ${API_PORT}`));
app_web.listen(WEB_PORT, () => console.log(`Web app running on port ${WEB_PORT}`));
server.listen(GRAPHQL_PORT, () => console.log(`GraphQL server running on port ${GRAPHQL_PORT}`));

// WebSocket server setup
wss.on('connection', ws => {
    console.log('User connected');
    
    ws.on('message', message => {
        console.log(`Received: ${message}`);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message.toString()); 
        }
    });

    ws.on('close', () => console.log('User disconnected'));
});

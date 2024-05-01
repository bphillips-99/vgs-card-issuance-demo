const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('qs');
const tunnel = require('tunnel');
const dotenv = require('dotenv');
dotenv.config();
console.log(`Outbound route certificate is stored at this path: ${process.env['NODE_EXTRA_CA_CERTS']}`);

const VGS_VAULT_ID=process.env.VGS_VAULT_ID;
const VGS_USERNAME=process.env.VGS_USERNAME;
const VGS_PASSWORD=process.env.VGS_PASSWORD;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

app.get('/get_vault_id', async (req, res) => {
    res.setHeader('content-type', 'application/json')
    res.send({
        "vault_id": VGS_VAULT_ID,
    });
});

app.get('/load_records', async (req, res) => {
    res.setHeader('content-type', 'application/json')
    res.send( [
        {
            "id": "1000",
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "123-456-7890",
            "card_number_token": "424242b5qBSvXmV4242"
        },
        {
            "id": "1001",
            "name": "Jane Smith",
            "email": "jane.smith@example.com",
            "phone": "234-567-8901",
            "card_number_token": "545454x5vpSoBkV5454"
        },
        {
            "id": "1002",
            "name": "Alice Johnson",
            "email": "alice.johnson@example.com",
            "phone": "345-678-9012",
            "card_number_token": "411111ysBaZNuvV1111"
        },
        {
            "id": "1003",
            "name": "Bob Brown",
            "email": "bob.brown@example.com",
            "phone": "456-789-0123",
            "card_number_token": "400005wse1Hc7JV5556"
        },
        {
            "id": "1004",
            "name": "Carol White",
            "email": "carol.white@example.com",
            "phone": "567-890-1234",
            "card_number_token": "555555FZ2WjT3GV4444"
        }
    ]);
});

// Return the card cvc that was passed in.
// In a real environment, we will also perform
// validation on the user session to ensure they
// are allowed to reveal this value. This validation
// will be owned by the same authentication system
// that the rest of the customer's app employs.
app.post('/reveal_card_number', async (req, res) => {
    console.log(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(req.body);
});

// Return the card cvc that was passed in.
// In a real environment, we will also perform
// validation on the user session to ensure they
// are allowed to reveal this value. This validation
// will be owned by the same authentication system
// that the rest of the customer's app employs.
app.post('/reveal_card_cvc', async (req, res) => {
    console.log(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(req.body);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});


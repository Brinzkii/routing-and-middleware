process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
const {items} = require('./fakeDb');

let beer = {
    name: 'beer',
    price: 1.99
}

let candy = {
    name: 'candy',
    price: 0.99
}

beforeEach(() => {
    items.push(beer);
    items.push(candy);
})

afterEach(() => {
    items.length = 0;
})

describe('GET /items', () => {
    test('Should return a list of items', async () => {
        let resp = await request(app).get('/items');

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([
            {"name": "beer", "price": 1.99},
            {"name": "candy", "price": 0.99}
        ])
    })
})

describe('POST /items', () => {
    test('Should add item to list', async () => {
        let item = {name: "soda", price: 1.50};
        let resp = await request(app).post('/items').send(item).set('Content-Type', 'application/json');

        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({"added":{"name":"soda", "price":1.50}})
    })

    test('Should return 406 if name or price are missing', async () => {
        let item = {name: "soda"};
        let resp = await request(app).post('/items').send(item).set('Content-Type', 'application/json');

        expect(resp.statusCode).toBe(406);

        item = {price: 1.50};
        resp = await request(app).post('/items').send(item).set('Content-Type', 'application/json');

        expect(resp.statusCode).toBe(406);
    })
})

describe('GET /items/:name', () => {
    test('Should return a single item from list', async () => {
        let resp = await request(app).get('/items/beer');

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"name": "beer", "price": 1.99});
    })

    test('Should return 404 if item not in list', async () => {
        let resp = await request(app).get('/items/soda');

        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error":{"message": "No matching item in shopping list!", "status": 404}});
    })
})

describe('PATCH /items/:name', () => {
    test('Should update a single items name and/or price', async () => {
        let resp = await request(app).patch('/items/beer').send({name: 'new beer'}).set('Content-Type', 'application/json');

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"updated":{"name":"new beer", "price":1.99}})
    })

    test('Should return 404 if item not in list', async () => {
        let resp = await request(app).patch('/items/soda');

        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error":{"message": "No matching item in shopping list!", "status": 404}});
    })
})

describe('DELETE /items/:name', () => {
    test('Should delete a single item from list', async () => {
        let resp = await request(app).delete('/items/new beer');

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"message":"Deleted"});
    })

    test('Should return 404 if item not in list', async () => {
        let resp = await request(app).delete('/items/soda');

        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error":{"message": "No matching item in shopping list!", "status": 404}});
    })
})
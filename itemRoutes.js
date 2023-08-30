const {items,Item} = require('./fakeDb');
const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');


/** GET /items: get list of items */

router.get('/', (req, res, next) => {
    if (items.length == 0) {
        return res.status(204).json('No items added to list yet!');
    } else {
        return res.json(items);
    }
})

/** POST /items: add item to shopping list */

router.post('/', (req, res, next) => {
    try {
        if (!req.body.name || !req.body.price) throw new ExpressError('Name and price required for new item!', 406)

        let item = new Item(req.body.name, req.body.price)
        items.push(item)
        res.status(201).json({"added":{"name":item.name, "price":item.price}})
    } catch (err) {
        return next(err);
    }
})

/** GET /items/:name: display a single items name and price */

router.get('/:name', (req, res, next) => {
    try {
        let item = items.find((i) => i.name == req.params.name);

        if (!item) throw new ExpressError('No matching item in shopping list!', 404)

        return res.json(item);
    } catch (err) {
        return next(err);
    }
})

/** PATCH /items/:name: modify a single items name and/or price */

router.patch('/:name', (req, res, next) => {
    try {
        let item = items.find((i) => i.name == req.params.name);

        if (!item) throw new ExpressError('No matching item in shopping list!', 404)

        item.name = req.body.name || item.name
        item.price = req.body.price || item.price
        return res.json({"updated":{"name":item.name, "price":item.price}})
    } catch (err) {
        return next(err);
    }
})

/** DELETE /items/:name: delete a specific item from list */

router.delete('/:name', (req, res, next) => {
    try {
        let item = items.findIndex((i) => i.name == req.params.name);

        if (item < 0) throw new ExpressError('No matching item in shopping list!', 404)

        items.splice(item, 1)
        return res.json({"message":"Deleted"});
    } catch (err) {
        return next(err);
    }
})


module.exports = router;
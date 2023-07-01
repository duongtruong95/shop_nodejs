var express = require('express');
var router = express.Router();

var Cate = require('../model/Cate.js');
var Product = require('../model/Product.js');
var GioHang = require('../model/giohang.js');

var countJson = function(json){
	var count = 0;
	for(var id in json){
			count++;
	}

	return count;
}

// GET home page
router.get('/', async (req, res) => {
	try {
		const product = await Product.find();
		const cate = await Cate.find();
		res.render('site/page/index', { product, cate });
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal Server Error');
	}
});

// GET category page
router.get('/cate/:name.:id.html', async (req, res) => {
	try {
		const { id } = req.params;
		const data = await Product.find({ cateId: id });
		const cate = await Cate.find();
		res.render('site/page/cate', { product: data, cate });
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal Server Error');
	}
});

// GET detail page
router.get('/chi-tiet/:name.:id.:cate.html', async (req, res) => {
	try {
		const { id } = req.params;
		const data = await Product.findById(id);
		const pro = await Product.find({ cateId: data.cateId, _id: { $ne: data._id } }).limit(4);
		res.render('site/page/chitiet', { data, product: pro });
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal Server Error');
	}
});

// POST menu
router.post('/menu', async (req, res) => {
	try {
		const data = await Cate.find();
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal Server Error');
	}
});



module.exports = router;

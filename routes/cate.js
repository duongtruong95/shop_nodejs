var express = require('express');
var router = express.Router();

var Cate = require('../model/Cate.js');

function bodauTiengViet(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/ /g, "-");
    str = str.replace(/\./g, "-");
    return str;
}

/* GET home page. */
router.get('/', checkAdmin, function(req, res, next) {
  res.redirect('/admin/cate/danh-sach.html'); 
});

router.get('/danh-sach.html', checkAdmin,  function(req, res, next) {
	 Cate.find().then(function(data){
		res.render('admin/cate/danhsach', {data: data});
	});
  	
});

router.get('/them-cate.html', checkAdmin, function(req, res, next) {
  res.render('admin/cate/them', { errors: null});
});


router.post('/them-cate.html', checkAdmin, async function(req, res, next) {
	req.checkBody('name', 'Giá Trị không được rổng').notEmpty();
	req.checkBody('name', 'Name 5 đến 32 ký tự').isLength({min:5, max:32});
	var errors = req.validationErrors();
	if (errors) {
		res.render('admin/cate/them',{errors : errors});
	} else {
		try {
			var cate = new Cate({
				name: req.body.name,
				nameKhongDau: bodauTiengViet(req.body.name)
			});
			await cate.save();
			req.flash('success_msg', 'Đã Thêm Thành Công');
			res.redirect('/admin/cate/them-cate.html');
		} catch (err) {
			console.log(err);
		}
	}
});

router.get('/:id/sua-cate.html', checkAdmin, async (req, res, next) => {
	try {
		const data = await Cate.findById(req.params.id).exec();
		res.render('admin/cate/sua', { errors: null, data: data });
	} catch (err) {
		next(err);
	}
});

router.post('/:id/sua-cate.html', checkAdmin, async (req, res, next) => {
	req.checkBody('name', 'Giá Trị không được rổng').notEmpty();
	req.checkBody('name', 'Name 5 đến 32 ký tự').isLength({ min: 5, max: 32 });
	const errors = req.validationErrors();

	if (errors) {
		try {
			const data = await Cate.findById(req.params.id).exec();
			res.render('admin/cate/sua', { errors: errors, data: data });
		} catch (err) {
			next(err);
		}
	} else {
		try {
			const data = await Cate.findById(req.params.id).exec();
			data.name = req.body.name;
			data.nameKhongDau = bodauTiengViet(req.body.name);
			await data.save();
			req.flash('success_msg', 'Đã Sửa Thành Công');
			res.redirect('/admin/cate/' + req.params.id + '/sua-cate.html');
		} catch (err) {
			next(err);
		}
	}
});

router.get('/:id/xoa-cate.html', checkAdmin, async (req, res, next) => {
	try {
		await Cate.findByIdAndRemove(req.params.id).exec();
		req.flash('success_msg', 'Đã Xoá Thành Công');
		res.redirect('/admin/cate/danh-sach.html');
	} catch (err) {
		next(err);
	}
});

async function checkAdmin(req, res, next) {
	try {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/admin/dang-nhap.html');
		}
	} catch (err) {
		next(err);
	}
}

module.exports = router;
const express = require("express");
const router = express.Router();
const moment = require('moment');

const { Post } = require("../models/Post");

// router.post("/uploadFileImg", (req, res) => {
//   User.findOneAndUpdate(
//     { _id: req.body._id },
//     {
//       proFileImg: req.body.proFileImg,
//     }
//   ).exec((err, result) => {
//     if (err) return res.status(400).send(err);
//     return res.status(200).json({ success: true, result });
//   });
// });

router.post("/getPost", (req, res) => {
  if(req.body.topic=="whole"){
    const endDate1='2021-06-30';
    const startDate1='2021-06-01';
    const startDate = moment(startDate1).startOf('day');
  const endDate = moment(endDate1).endOf('day');
  const request = {
    topic: 'your_topic',
    class: 'your_class',
    startDate: '2023-06-01',
    endDate: '2023-06-30'
  };
  Post.aggregate([
    {
      $match: {
        $and: [
          // { topic: req.body.topic },
          { class: req.body.class },
          // { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() } }
        ]
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        createdAt: 1,
        topic:1
      }
    },
    {
      $sort: {
        createdAt: 1
      }
    }
  ]).exec((err, posts) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, posts });
  });
  }
  else{
  Post.find({
     topic: req.body.topic,class: req.body.class }).exec((err, posts) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, posts });
  });
}
});
router.post('/getPostWhole', (req, res) => {
  const startDate = moment(req.body.startDate).startOf('day');
  const endDate = moment(req.body.endDate).endOf('day');

  Post.aggregate([
    {
      $match: {
        $and: [
          { topic: req.body.topic },
          { class: req.body.class },
          { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() } }
        ]
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        createdAt: 1
      }
    },
    {
      $sort: {
        createdAt: 1
      }
    }
  ]).exec((err, posts) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, posts });
  });
});
router.post("/getPostList", (req, res) => {
  Post.find({ userFrom: req.body.userFrom }).exec((err, posts) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, posts });
  });
});
router.post("/getOnePost", (req, res) => {
  Post.find({ _id: req.body._id }).exec((err, posts) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, posts });
  });
});
router.post("/getImgeFile", (req, res) => {
  Post.find({ _id: req.body._id }).exec((err, posts) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, posts });
  });
});

router.post("/removePost", (req, res) => {
  Post.findOneAndDelete({
    title: req.body.title,
    userFrom: req.body.userFrom,
  }).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

router.post("/removeOnePost", (req, res) => {
  Post.findOneAndDelete({
    _id: req.body._id,
  }).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

router.post("/updatePost", (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body._id },
    {
      title: req.body.title,
      content: req.body.content,
      imagePath: req.body.imagePath,
    }
  ).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, result });
  });
});

router.post("/downToFavorite", (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body._id, userFrom: req.body.userFrom },
    {
      favoriteNumber: 0,
    }
  ).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

router.post("/upToFavorite", (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body._id, userFrom: req.body.userFrom },
    {
      favoriteNumber: 1,
    }
  ).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

router.post("/updateFavorite", (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body._id, userFrom: req.body.userFrom },
    {
      favoriteNumber: req.body.favoriteNumber,
    }
  ).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

router.post("/post", (req, res) => {
  //회원 가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  const post = new Post(req.body);

  post.save((err, req) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

module.exports = router;

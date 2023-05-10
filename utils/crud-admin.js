const { admin } = require("./auth");

const getOne = model => async (req, res) => {
  const { id } = req.params;
  // const adminStatus = req.user.role < 5 ? true : false;
  // if (adminStatus) {
    const doc = await model.findOne({_id: id});
    if (!doc) {
      res.status(404).end();
    }
  
    res.status(200).json({ data: doc });
  // } else {
  //   res.status(401).send({message: 'Not auth: Admin Only'});
  // }

}

const getMany = model => async (req, res) => {
  const docs = await model.find();
  res.status(200).json({ data: docs })
}

const createOne = model => async (req, res) => {
  const adminStatus = req.user?.role < 5 ? true : false;
  // console.log(req.body)

  if (adminStatus) {
    try {
      const doc = await model.create({ ...req.body, createdBy: req.user._id });
      res.status(201).json({ data: doc});
    } catch (e){
      console.log(e)
      if(e.code === 11000) {
        res.status(400).send({message: "Duplicate exist"})
        // res.status(400).send(e)
      }
      res.status(400).end(e)
    }

  } else {
    res.status(401).send({message: 'Not auth: Admin Only'});
  }
}

const updateOne = model => async (req, res) => {
  const adminStatus = req.user.role < 5 ? true : false;
  if (adminStatus) {
    const doc = await model.findOneAndUpdate(
      {
      _id: req.params.id
    },
     req.body, 
     { new: true}
     )
     if (!doc) {
      res.status(404).end()
     }
     res.status(200).json({ data: doc })
  } else {
    res.status(401).send({message: 'Not auth: Admin Only'});
  }
}

const removeOne = model => async (req, res) => {
  const adminStatus = req.user.role < 5 ? true : false;
  if (adminStatus) {
    const doc = await model
      .findOneAndRemove({
        _id: req.params.id
      })
      .exec()
  
      if(!doc) {
        res.status(400).end()
      }
  
      res.status(200).json({data: doc})
  } else {
    res.status(401).send({message: 'Not auth: Admin Only'});
  }
}

const crudController = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})

module.exports = {
  removeOne,
  updateOne,
  getMany,
  getOne,
  createOne,
  crudController
}
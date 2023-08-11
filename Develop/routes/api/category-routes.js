const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  try {
    const categories = await Category.findAll({
      // include its associated Products
      include: [Product],
    });

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});
// find one category by its `id` value
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      // include its associated Products
      include: [Product],
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});
// create a new category
router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create({
      category_id: req.body.category_id,
    });

    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});
// update a category by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedCategory[0]) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.json({ message: "Category update successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete a category by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

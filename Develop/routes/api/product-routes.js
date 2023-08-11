const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");
// get all products
router.get("/", async (req, res) => {
  // find all categories
  try {
    const products = await Product.findAll({
      // be sure to include its associated Products
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  // find a single product by its `id`
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
      // be sure to include its associated Category and Tag data
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
// create new product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    // If there are product tags, create pairings
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});
// update product
router.put("/:id", async (req, res) => {
  // update product data
  try {
    const [rowsUpdated, [updatedProduct]] = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });

    if (rowsUpdated === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });
      // create filtered list of new tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which tags to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      // run both actions
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});
// delete one product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }
    // If product exists, delete it
    await product.destroy();

    //Also delete any associated Product Tag entries for the product
    await ProductTag.destroy({ where: { product_id: req.params.id } });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

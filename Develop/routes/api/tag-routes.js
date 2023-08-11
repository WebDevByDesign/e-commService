const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint
router.get("/", async (req, res) => {
  // find all tags
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/", async (req, res) => {
  // create a new tag
  try {
    const tag = await Tag.create(req.body);
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});
// update a tag's name by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const [rowsUpdated, [updatedTag]] = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });

    if (rowsUpdated === 0) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    await tag.destroy();

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

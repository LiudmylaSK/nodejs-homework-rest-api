const { HttpError, ctrlWrapper } = require("../helpers");
const { Contact } = require("../models/contacts");

const getAll = async (req, res) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

const getById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);

    if (!result) throw HttpError(404, "Not found");

    res.json(result);
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

const addNew = async (req, res) => {
  try {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

const deleteById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);

    if (!result) throw HttpError(404, "Not found");

    res.json({ message: "Contact deleted" });
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

const updateById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (!result) throw HttpError(404, "Not found");

    res.json(result);
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

const updateStatusContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.json(result);
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addNew: ctrlWrapper(addNew),
  deleteById: ctrlWrapper(deleteById),
  updateById: ctrlWrapper(updateById),
  updateFavorite: ctrlWrapper(updateStatusContact),
};

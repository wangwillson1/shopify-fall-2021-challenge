const db = require("../models");
const User = db.user;
const Role = db.role;
const Image = db.image;

const Op = db.Sequelize.Op;

exports.upload = async (req, res) => {
    try {
        image = await Image.create({
            imgUrl: req.body.imgUrl,
            isPublic: req.body.isPublic,
            userId: req.userId
        });

        res.status(200).send(
            {   message: "Image registered successfully",
                userId: image.userId,
                isPublic: image.isPublic
            });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
}

exports.getImageByImageId = async (req, res) => {
    try {
        let image = await Image.findOne({
            where: {
                id: req.body.imgId
            }
        });

        if (!image) res.status(404).send({ message: `ERROR: No image found with id ${req.body.imgId}` });

        res.status(200).send(
            {   imgUrl: image.imgUrl,
                isPublic: image.isPublic,
                userId: image.userId
            });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
}

exports.getImagesByUserId = async (req, res) => {
    try {
        let images = await Image.findAll({
            where: {
                userId: req.userId
            }
        })

        if (!images) res.status(404).send({ message: "ERROR: No images found" })

        res.status(200).send({ images });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
}

exports.getAllPublicImages = async (req, res) => {
    try {
        let images = await Image.findAll({
            where: {
                isPublic: true
            }
        });

        if (!images) res.status(404).send({ message: "ERROR: No images found" });

        res.status(200).send({ images });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
}

exports.getAllImages = async (req, res) => {
    try {
        let images = await Image.findAll();

        if (!images) res.status(404).send({ message: "ERROR: No images found" });

        res.status(200).send({ images });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
}

exports.deleteImageById = async (req, res) => {
    try {
        let image = await Image.findOne({
            where: {
                id: req.body.imgId
            }
        });

        if (!image) return res.status(404).send({ message: "ERROR: No images found" });
        else if (image.userId != req.userId) return res.status(401).send({ message: "ERROR: You are not the owner of this image" });

        await Image.destroy({
            where: {
                id: req.body.imgId,
                userId: req.userId
            }
        });

        res.status(200).send({ message: "Image deleted successfully" });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
}
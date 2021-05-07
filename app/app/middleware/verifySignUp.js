const db = require("../models");

const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(409).send({
                message: "ERROR: Email already in use"
            });

            return;
        }
        next();
    });
}

verifyRoleExists = (req, res, next) => {
    if (req.body.roles) {
        if (req.body.roles.forEach(role => !ROLES.includes(role))) {
            res.status(404).send({
                message: `ERROR: ${role} role does not exist.`
            });

            return;
        }
    }

    next();
}

verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
    verifyRoleExists: verifyRoleExists
}

module.exports = verifySignUp;
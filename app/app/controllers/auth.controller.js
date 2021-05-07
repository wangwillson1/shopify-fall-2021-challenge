const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    // Add user to db
    let user;

    try {
        user = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        });

        if (!user) throw new Error("User not created");

        if (req.body.roles) {
            let roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            })

            await user.setRoles(roles);
            res.send({ message: "User registered successfully" });
        }
        else {
            // set to user role (id 1) if no role specified
            await user.setRoles([1]);
            res.send({ message: "User was registered successfully" });
        }
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

exports.signin = async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if (!user) res.status(404).send({ message: "ERROR: User not found" })

        var passwordValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Incorrect password"
            });
        }

        // password correct, issue token
        let secret = config.secret;
        console.log(secret);
        var token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });

        // assign proper roles for permissions
        var authorities = [];
        let roles = await user.getRoles()
        roles.forEach(role => authorities.push(role.name.toUpperCase()));

        res.status(200).send({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            roles: authorities,
            accessToken: token
        });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}
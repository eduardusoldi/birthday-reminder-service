const User = require("../models/User");

class UserController {

    static async createUser(req, res, next) {
        try {
            const { name, email, birthday, timezone } = req.body

            const requiredFields = { name, email, birthday, timezone };
            for (const [key, value] of Object.entries(requiredFields)) {
                if (!value) throw { status: 400, msg: `Please insert ${key}` };
            }

            const user = new User(req.body);
            await user.save();

            const newUser = user.toObject()
            const formattedUser = {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                birthday: newUser.birthday,
                timezone: newUser.timezone,
            }
            res.status(201).json({
                message: "User created successfully",
                data: formattedUser
            });
        } catch (error) {
            next(error)
        }
    }

    static async retrieveUserById(req, res, next) {
        try {
            const user = await User.findById(req.params.id, { createdAt: 0, updatedAt: 0, __v: 0 }).lean();
            if (!user) throw { status: 404, msg: "User not found" }

            const formattedUser = user ? { _id: user._id, ...user } : null;
            res.json(formattedUser);
        } catch (error) {
            next(error)
        }
    }


    static async updateUser(req, res, next) {
        try {
            if (req.body.length === 0 ) throw {status: 404, msg: "Please insert the fields"}
            
            const allowedFields = ["name", "email", "birthday", "timezone"];
            const updateFields = Object.keys(req.body);

            const invalidFields = updateFields.filter(field => !allowedFields.includes(field));
            if (invalidFields.length) {
                throw { status: 400, msg: `Invalid fields: ${invalidFields.join(", ")}` };
            }

            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!user) throw { status: 404, msg: "User not found" };

            const formattedUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                birthday: user.birthday,
                timezone: user.timezone,
            }
            res.json(formattedUser);
        } catch (error) {
            next(error);
        }
    }


    static async deleteUser(req, res, next) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) throw { status: 404, msg: "User not found" }

            res.json({ message: "User deleted successfully" });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController
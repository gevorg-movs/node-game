const mongoose = require("mongoose");
const {body, check, validationResult} = require("express-validator");

const validatorFunction = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            errors: errors.array(),
        });
    }
    next();
}

const idValidator = value => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return Promise.reject('Invalid id');
    }
    return true
}

exports.get = [
    check("_id").custom(idValidator),
    validatorFunction
]

exports.create = [
    check("title", "Title is required").exists(),
    check("variants", "Variants are required").isObject(),
    check("correct_answer", "Correct answer is required").exists(),
    body('variants').custom(value => {
        if (Object.keys(value).length === 0) {
            return Promise.reject('Variants can not be empty');
        }
        return true
    }),
    validatorFunction
]

exports.answer = [
    check("_id").custom(idValidator),
    check("answer", "Answer is required").exists(),
    check("user_name", "User name is required").exists(),
    validatorFunction
]


const {Router} = require("express");
const Question = require('../models/Question')
const User = require('../models/User')
const router = Router();
const config = require("config")
const questionValidations = require('../validations/questionValidations')


router.get("/all",
    async (req, res) => {
        try {
            const questions = await Question.find({
                status: config.get('question.status.1')
            })

            return res.status(200).json({
                questions
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error,
            });
        }
    })


router.get("/", questionValidations.get,
    async (req, res) => {
        try {
            const {_id} = req.body;
            const question = await Question.findOne({
                _id,
                status: config.get('question.status.1')
            });

            if (!question) {
                return res.status(403).json({
                    error: 'Question not found'
                });
            }

            question.start = new Date()
            question.end = new Date(question.start);
            question.end.setSeconds(question.start.getSeconds() + config.get('question.expiration'));
            question.status = config.get('question.status.2')

            await question.save()

            return res.status(200).json({
                question
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error,
            });
        }
    })

router.post("/",
    questionValidations.create,
    async (req, res) => {
        try {
            const {title, variants, correct_answer} = req.body;
            let newQuestion = new Question({
                title,
                variants,
                correct_answer,
            });

            newQuestion = await newQuestion.save();

            return res.status(200).json({
                newQuestion
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error,
            });
        }
    })


router.post("/answer",
    questionValidations.answer,
    async (req, res) => {
        try {
            const {_id, answer, user_name} = req.body;

            const question = await Question.findOne({_id});

            if (!question) {
                return res.status(403).json({
                    error: 'Question with following id not found',
                });
            }

            if (!question.variants.hasOwnProperty(answer)) {
                return res.status(403).json({
                    error: 'Invalid answer type. ' + 'Allowed variants: ' + Object.keys(question.variants).join(', ')
                });
            }

            if (question.end > new Date && question.status == config.get('question.status.2')) {
                question.status = config.get('question.status.3')
                await question.save()

                let user = await User.findOne({name: user_name})

                if (!user) {
                    user = new User({
                        name: user_name
                    })
                    user = await user.save()
                }

                if (question.correct_answer == answer) {
                    user.right += 1
                } else {
                    user.wrong += 1
                }
                await user.save()


                return res.status(200).json({
                    message: `Your answer is: ${answer}`
                });
            } else {
                return res.status(200).json({
                    message: `Answer time has expired or the question was answered`
                });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: error.message,
            });
        }
    })

module.exports = router
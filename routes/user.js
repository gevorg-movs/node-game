const User = require('../models/User')
const {Router} = require("express");
const router = Router();
const {check, validationResult} = require("express-validator");

router.get("/result", [
        check("user_name", "User name is required").exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(403).json({
                    error: errors.array()
                });
            }
            const {user_name} = req.body;

            const user = await User.findOne({name: user_name})

            if (!user) {
                return res.status(403).json({
                    error: 'User with following name not found'
                });
            }

            const rightPercent = (user.right / (user.right + user.wrong)) * 100

            let status = ''
            if (rightPercent == 100) {
                status = 'Perfect'
            } else if (rightPercent >= 80 && rightPercent < 100) {
                status = 'Great'
            } else if (rightPercent >= 40 && rightPercent < 80) {
                status = 'Okay'
            } else if (rightPercent < 40) {
                status = 'Bad'
            }

            return res.status(200).json({
                status
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error,
            });
        }
    })

module.exports = router
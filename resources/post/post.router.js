const { Router } = require("express");
const router = Router();

const uploadHandler = require.main.require("../utils/uploadHandler");
const { auth } = require.main.require("../utils/auth");

const controller = require("./post.controller");

/**
 * @swagger
 * tags:
 *  name: Posts
 *  description: The post management api
 */

/**
 * @swagger
 *  /post/:
 *  post:
 *     tags: [Posts]
 *     summary: Endpoint to create a new post
 *     description: New post should have token as creator and at least have the content filled
 *     parameters:
 *      - in: header
 *        required: true
 *        name: authorization
 *        description: Token for the app, should be written as Bearer(space)[token]
 *        schema:
 *          $ref: '#/components/schemas/HeaderTokenDto'
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *            $ref: '#/components/schemas/SignUpDto'
 *     responses:
 *       '200':
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TokenResponse'
 *       '409':
 *          description: Duplicate username
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/DuplicateErrorResponse'
 *       '422':
 *          description: Incomplete user data
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/IncompleteErrorResponse'
 *       '400':
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", uploadHandler.single("image"), auth, controller.create);
router.get("/:id", controller.findById);
router.patch("/:id", uploadHandler.single("image"), auth, controller.update);

module.exports = router;

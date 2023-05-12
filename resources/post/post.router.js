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
 *       multipart/formdata:
 *         schema:
 *            $ref: '#/components/schemas/PostSchemaDto'
 *     responses:
 *       '201':
 *          description: Ok (created new post)
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/PostSchema'
 *       '401':
 *          description: Unauthorized (invalid token / format)
 *       '422':
 *          description: Incomplete form, content empty
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
router.delete("/:id", auth, controller.delete);

module.exports = router;

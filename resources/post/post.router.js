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
 *     description: New post should have token as creator and at least have the content filled  its buggy on swaggger please use insomnia/postman to hit the api
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
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TokenErrorResponse'
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

/**
 * @swagger
 *  /post/{id}:
 *  get:
 *     tags: [Posts]
 *     summary: Endpoint to get post by id
 *     parameters:
 *      - in: path
 *        required: true
 *        name: id
 *        description: id of the post
 *        schema:
 *          type: string
 *     responses:
 *       '200':
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/PostSchema'
 *       '400':
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *  patch:
 *     tags: [Posts]
 *     summary: Endpoint to update post data
 *     parameters:
 *      - in: path
 *        required: true
 *        name: id
 *        description: id of the post
 *        schema:
 *          type: string
 *      - in: header
 *        required: true
 *        name: authorization
 *        description: MUST be the post owner's token
 *        schema:
 *          $ref: '#/components/schemas/HeaderTokenDto'
 *     requestBody:
 *      required: true
 *      content:
 *       multipart/formdata:
 *         schema:
 *            $ref: '#/components/schemas/PostSchemaDto'
 *     responses:
 *       '200':
 *          description: Ok (post updated)
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/PostSchema'
 *       '401':
 *          description: Unauthorized (invalid token / format)
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TokenErrorResponse'
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
 *  delete:
 *     tags: [Posts]
 *     summary: Endpoint to delete post data
 *     parameters:
 *      - in: path
 *        required: true
 *        name: id
 *        description: id of the post
 *        schema:
 *          type: string
 *      - in: header
 *        required: true
 *        name: authorization
 *        description: MUST be the post owner's token
 *        schema:
 *          $ref: '#/components/schemas/HeaderTokenDto'
 *     responses:
 *       '200':
 *          description: Ok (post deleted)
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/DeleteResponse'
 *       '401':
 *          description: Unauthorized (invalid token / format)
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TokenErrorResponse'
 *       '400':
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", controller.findById);
router.patch("/:id", uploadHandler.single("image"), auth, controller.update);
router.delete("/:id", auth, controller.delete);

// comment doc pending
router.post("/:id/comment", auth, controller.comment);

// like doc pending
router.post("/:id/like", auth, controller.like);
router.delete("/:id/like", auth, controller.unlike);

module.exports = router;

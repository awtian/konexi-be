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
 * tags:
 *  name: PostsAddons
 *  description: The post addons (likes, comment)
 */

/**
 * @swagger
 *  /post/:
 *  post:
 *     tags: [Posts]
 *     summary: Endpoint to create a new post
 *     description: New post should have token as creator and at least have the content filled  its buggy on swaggger please use insomnia/postman to hit the api
 *     requestBody:
 *      required: true
 *      content:
 *       application/x-www-form-urlencoded:
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
 *  get:
 *     tags: [Posts]
 *     summary: Endpoint to get all post / searchable post
 *     parameters:
 *      - in: query
 *        name: search
 *        description: Search keyword (content, author username, author fullname)
 *        schema:
 *          type: string
 *     responses:
 *       '200':
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/PostSchema'
 *       '400':
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", uploadHandler.single("image"), auth, controller.create);
router.get("/", controller.getPosts);
/**
 * @swagger
 *  /post/feed:
 *  get:
 *     tags: [Posts]
 *     summary: Get feed (user own post and followed users)
 *     description: New post should have token as identifier
 *     securityDefinitions:
 *       authentication:
 *          type: apiKey
 *          name: Authorization
 *          in: header
 *     responses:
 *       '200':
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/PostSchema'
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
router.get("/feed/", auth, controller.getFeed);

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

/**
 * @swagger
 *  /post/{id}/comment:
 *  post:
 *     tags: [Posts, PostsAddons]
 *     summary: Endpoint to create a new comment based on id
 *     parameters:
 *      - in: path
 *        required: true
 *        name: id
 *        description: id of the post
 *        schema:
 *          type: string
 *     requestBody:
 *      required: true
 *      content:
 *       application/x-www-form-urlencoded:
 *         schema:
 *            $ref: '#/components/schemas/CommentSchemaDto'
 *     responses:
 *       '201':
 *          description: Ok (created new comment)
 *       '401':
 *          description: Unauthorized (invalid token / format)
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TokenErrorResponse'
 *       '422':
 *          description: Incomplete form, comment empty
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

router.post("/:id/comment", auth, controller.comment);

/**
 * @swagger
 *  /post/{id}/like:
 *  post:
 *     tags: [Posts, PostsAddons]
 *     summary: Endpoint to create a new like based on id
 *     parameters:
 *      - in: path
 *        required: true
 *        name: id
 *        description: id of the post
 *        schema:
 *          type: string
 *     responses:
 *       '201':
 *          description: Ok (created new like)
 *       '409':
 *          description: Conflict (liked already)
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
 *  delete:
 *     tags: [Posts, PostsAddons]
 *     summary: Endpoint to unlike based on id
 *     parameters:
 *      - in: path
 *        required: true
 *        name: id
 *        description: id of the post
 *        schema:
 *          type: string
 *     responses:
 *       '200':
 *          description: Ok (created new like)
 *       '401':
 *          description: Unauthorized (invalid token / format)
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TokenErrorResponse'
 *       '404':
 *          description: Like not found
 *       '400':
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:id/like", auth, controller.like);
router.delete("/:id/like", auth, controller.unlike);

module.exports = router;

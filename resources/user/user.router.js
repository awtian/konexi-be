const { Router } = require("express");
const router = Router();
const { auth } = require.main.require("../utils/auth");
const controllers = require("./user.controller");

/**
 * @swagger
 * tags:
 *  name: User
 *  description: The user managing api
 */

/**
 * @swagger
 *  /user/signup:
 *  post:
 *     tags: [User]
 *     summary: Endpoint to signup and generate token for a new user
 *     description: Endpoint for signup, username, password, and full name is required
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
router.post("/signup", controllers.signup);

/**
 * @swagger
 * /user/signin:
 *  post:
 *     tags: [User]
 *     summary: Endpoint to signin and generate token for existing user
 *     description: Endpoint for sign in, username and password is required.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SignInDto'
 *     responses:
 *       '200':
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
router.post("/signin", controllers.signin);

/**
 * @swagger
 * /user/:
 *  put:
 *     tags: [User]
 *     summary: Endpoint to update user data based on their token
 *     description: Endpoint for updating the data based on the token brought, username, password, and full name is able to be updated
 *     parameters:
 *      - in: header
 *        name: authorization
 *        description: Token for the app, should be written as Bearer(space)[token]
 *        schema:
 *          $ref: '#/components/schemas/HeaderTokenDto'
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       '200':
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UpdateUserResponse'
 
 */
router.put("/", controllers.update);

router.post("/follow/:id", auth, controllers.follow);
router.delete("/follow/:id", auth, controllers.unfollow);

module.exports = router;

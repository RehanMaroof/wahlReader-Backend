const express = require('express');
const userController = require('../controllers/user.controller');
const { MDWR } = require('../middlewares');
const { SCHEMA } = require('../validators/validation');

const userRoutes = express.Router();

/**
* @openapi
* /api/users/v1/auth/sign-in:
*   post:
*     tags:
*       - users-login
*     description: login for users
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - password
*             properties:
*               email:
*                 type: string
*                 format: email
*                 example: user@example.com
*               password:
*                 type: string
*                 format: password
*                 example: password123
*     responses:
*       200: 
*         description: successful response
*       400:
*         description: bad request
*/
userRoutes.post('/v1/auth/sign-in', MDWR.validationMiddleware(SCHEMA.LOGIN), userController.LOGIN);


/**
* @openapi
* /api/users/v1/auth/register:
*   post:
*     tags:
*       - users-register
*     description: register for users
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - name
*               - email
*               - password
*             properties:
*               name:
*                 type: string
*                 example: John Doe
*               email:
*                 type: string
*                 format: email
*                 example: user@example.com
*               password:
*                 type: string
*                 format: password
*                 example: password123
*     responses:
*       200: 
*         description: successful response
*       400:
*         description: bad request
*/
userRoutes.post('/v1/auth/register', MDWR.validationMiddleware(SCHEMA.SIGNUP), userController.REGISTER);


/**
 * @openapi
 * /api/users/v1/auth/refresh:
 *   post:
 *     tags:
 *       - users-refresh
 *     description: refresh token for users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 format: refresh_token
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *     responses:
 *       200:
 *         description: successful response
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 */ 
userRoutes.get('/v1/auth/refresh', MDWR.validateRefreshToken(), userController.REFRESH);


/**
 * @openapi
 * /api/users/v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - users-forgot-password
 *     description: forgot password for users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: successful response
 *       400:
 *         description: bad request
 */
userRoutes.post('/v1/auth/forgot-password',  MDWR.validationMiddleware(SCHEMA.FORGOTPASSWORD), userController.FORGOTPASSWORD);


/**
 * @openapi
 * /api/users/v1/auth/reset-password:
 *   post:
 *     tags:
 *       - users-reset-password
 *     description: reset password for users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirm_password
 *               - otp
 *             properties:
 *               otp:
 *                  type: number
 *                  example: 123456
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               new_password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               confirm_password:
 *                  type: string
 *                  format: password
 *                  example: password123
 *     responses:
 *       200:
 *         description: successful response
 *       400:
 *         description: bad request
 */
userRoutes.post('/v1/auth/reset-password',MDWR.validationMiddleware(SCHEMA.RESETPASSWORD), userController.RESETPASSWORD);


module.exports = userRoutes;

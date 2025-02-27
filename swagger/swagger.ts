const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.0.0',
  autoHeaders: false,
});

const doc = {
  info: {
    title: 'circle API',
    description: 'Welcome to Circle API',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    '@schemas': {
      LoginDTO: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'example@gmail.com',
          },
          password: {
            type: 'string',
            example: 'example123',
          },
        },
      },
      registerDTO: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'example@gmail.com',
          },
          username: {
            type: 'string',
            example: 'exampleuser',
          },
          password: {
            type: 'string',
            example: 'example123',
          },
          fullName: {
            type: 'string',
            example: 'example user',
          },
        },
      },
      forgotPasswordDTO: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'example@gmail.com',
          },
        },
      },
      resetPasswordDTO: {
        type: 'object',
        properties: {
          oldPassword: {
            type: 'string',
            example: 'example123',
          },
          newPassword: {
            type: 'string',
            example: '321elpmaxe',
          },
        },
      },
      CreateThreadDTO: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            example: 'Lorem Ipsum Bla Bla Bla...',
          },
          images: {
            type: 'file',
            example: 'hanya image/png image/jpeg image/jpg',
          },
        },
      },
      UpdateProfileDTO: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            example: 'tester',
          },
          fullName: {
            type: 'string',
            example: 'tester',
          },
          bio: {
            type: 'string',
            example: 'tester',
          },
          avatarUrl: {
            type: 'file',
          },
          bannerUrl: {
            type: 'file',
          },
        },
      },
      likeUnlikeDTO: {
        type: 'object',
        properties: {
          threadId: {
            type: 'string',
            example: '2aa9e97b-fedc-4569-b96a-3be973f9ae30',
          },
        },
      },
      followUnfollowDTO: {
        type: 'object',
        properties: {
          followingId: {
            type: 'string',
            example: 'cab05454-7320-46c4-a097-3043a0c20571',
          },
        },
      },
      CreateReplyDTO: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            example: 'Test Reply Gan',
          },
        },
      },
      // /
    },
  },
  host: 'localhost:3000',
};

const outputFile = './swagger-output.json';
const routes = ['src/index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);

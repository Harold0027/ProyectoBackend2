PROYECTOBACKEND2/
│── node_modules/
│── app/
│   ├── controllers/
│   │   └── orders.controller.js
│   │   └── users.controller.js
│   │   └── mailer.controller.js
│   │   └── messaging.controller.js
│   │   └── session.controller.js
│   ├── dao/
│   │   └── //base.dao.js
│   │   └── //order.mongo.dao.js
│   │   └── //user.mongo.dao.js
│   └── dtos/
│       └── //user.dto.js
│   └── services/
│   │   └── orders.service.js
│   │   └── users.service.js
│   │   └── mailer.service.js
│   │   └── messaging.service.js
│   └── server/
│       └── server.js
│── config/
│   ├── auth/
│   │   └── passport.config.js
│   ├── db/
│   │   └── connection.js
│   └── models/
│       └── user.model.js
        └── order.model.js
│── middleware/
│   └── auth.middleware.js(para dar acceso al usuario segun su rol)
│
│── routes/
│   ├── sessions.router.js (/login, /logout, crud)
├   └── orders.router.js (/orders/id, /orders, crud)
│   └── users.router.js (/users, /users/id, crud)
└   └── messaging.router.js
└   └── mailer.router.js 
│── views/
│   ├── home.handlebars
│   ├── emails/
│   │   └── /order-status.handlebar
│   │   └── /welcome.handlebar
│   ├── layout/
│   │   └── /main.handlebar
│   └── orders/
│       └── /index.handlebar
│       └── /create.handlebar
│   └── session/
│       └── /login.handlebar
│       └── /register.handlebar
│── .env
│── app.js
│── package.json

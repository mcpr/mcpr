define({ "api": [
  {
    "type": "get",
    "url": "/healthcheck",
    "title": "Health Check",
    "name": "HealthCheck",
    "group": "Main",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nodeCheck",
            "description": "<p>Status of the Node check.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dbCheck",
            "description": "<p>Status of the database connection.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"nodeCheck\": {\n     \"status\": \"ok\"\n  },\n  \"dbCheck\": {\n     \"status\": \"connected\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mcpr.io/api/v1/healthcheck",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/index.js",
    "groupTitle": "Main",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/healthcheck"
      }
    ]
  },
  {
    "type": "get",
    "url": "/",
    "title": "Version",
    "name": "Version",
    "group": "Main",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of API</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "version",
            "description": "<p>Version of API</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "homepage",
            "description": "<p>Homepage of project</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "instance",
            "description": "<p>Instance information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "instance.url",
            "description": "<p>Instance base URL</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "instance.api",
            "description": "<p>Instance base API URL</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"name\": \"MCPR API\",\n  \"version\": \"0.0.1\",\n  \"homepage\": \"https://mcpr.io\",\n  \"instance\": {\n     \"url\": \"https://mcpr.io\",\n     \"api\": \"https://mcpr.io/api/v1\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mcpr.io/api/v1",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/index.js",
    "groupTitle": "Main",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/"
      }
    ]
  },
  {
    "type": "post",
    "url": "/plugins",
    "title": "Create Plugin",
    "name": "CreatePlugin",
    "group": "Plugin",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "short_description",
            "description": "<p>A short description of the plugin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>The author's user ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "created",
            "defaultValue": "CurrentTime",
            "description": "<p>The date on which the plugin was created</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>The title of the plugin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "source",
            "description": "<p>URL of the source code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "readme",
            "description": "<p>The README.md file</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "license",
            "description": "<p>The license of the plugin</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "keywords",
            "description": "<p>List of plugin keywords</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/api/v1/plugins/plugin.controller.js",
    "groupTitle": "Plugin",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/plugins"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/plugins/:id",
    "title": "Delete Plugin",
    "name": "DeletePlugin",
    "group": "Plugin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of plugin</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X \"DELETE\" https://mcpr.io/api/v1/plugins/dynmap",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/plugins/plugin.controller.js",
    "groupTitle": "Plugin",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/plugins/:id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/plugins/:id/download",
    "title": "Download Plugin",
    "name": "DownloadPlugin",
    "group": "Plugin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of plugin</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -o dynmap.jar https://mcpr.io/api/v1/plugins/dynmap/download",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/plugins/plugin.controller.js",
    "groupTitle": "Plugin",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/plugins/:id/download"
      }
    ]
  },
  {
    "type": "get",
    "url": "/plugins/:id",
    "title": "Get Plugin",
    "name": "GetPlugin",
    "group": "Plugin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of plugin</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of plugin</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "short_description",
            "description": "<p>A short description of the plugin</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>The author's user ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<p>The date on which the plugin was created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>The title of the plugin</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "latest_version_date",
            "description": "<p>The date on which the latest version was published</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "latest_version",
            "description": "<p>Version number of the latest version</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "source",
            "description": "<p>URL of the source code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "sourceGithub",
            "description": "<p>Specifies whether or not the plugin source is hosted on GitHub</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "flavors",
            "description": "<p>List of supported Minecraft flavors</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "readme",
            "description": "<p>The README.md file</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "license",
            "description": "<p>The license of the plugin</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "keywords",
            "description": "<p>List of plugin keywords</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"dynmap\",\n  \"title\": \"Dynmap\",\n  \"author\": \"mikeprimm\",\n  \"short_description\": \"Dynamic \\\"Google Maps\\\" style web maps for your Spigot/Bukkit server\",\n  \"latest_version\": \"2.4\",\n  \"latest_version_date\": \"2017-02-11T00:00:00.000Z\",\n  \"source\": \"webbukkit/dynmap\",\n  \"sourceGithub\": true,\n  \"readme\": \"## Dynamp Readme\",\n  \"license\": \"MIT\",\n  \"__v\": 0,\n  \"keywords\": [\"map\", \"dynamic\"],\n  \"flavors\": [\"bukkit\", \"spigot\"],\n  \"created\": \"2017-06-12T22:55:07.759Z\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mcpr.io/api/v1/plugins/dynmap",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/plugins/plugin.controller.js",
    "groupTitle": "Plugin",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/plugins/:id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/plugins",
    "title": "Request Plugin List",
    "name": "GetPlugins",
    "group": "Plugin",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "plugins",
            "description": "<p>List of plugins.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "sort",
            "description": "<p>Return plugins sorted in <code>asc</code> or <code>desc</code> order. Default is <code>desc</code></p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "order_by",
            "description": "<p>Return plugins ordered by <code>downloads</code>, <code>_id</code>, <code>title</code>, <code>author</code>, <code>latest_version</code>, <code>latest_version_date</code>, or <code>created</code> fields. Default is <code>downloads</code></p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mcpr.io/api/v1/plugins",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/plugins/plugin.controller.js",
    "groupTitle": "Plugin",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/plugins"
      }
    ]
  },
  {
    "type": "get",
    "url": "/users/:username/plugins",
    "title": "Get User's Plugins",
    "name": "GetUsersPlugins",
    "group": "Plugin",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "plugins",
            "description": "<p>List of plugins.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>Username to get owned plugins</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "sort",
            "description": "<p>Return plugins sorted in <code>asc</code> or <code>desc</code> order. Default is <code>desc</code></p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "order_by",
            "description": "<p>Return plugins ordered by <code>downloads</code>, <code>_id</code>, <code>title</code>, <code>author</code>, <code>latest_version</code>, <code>latest_version_date</code>, or <code>created</code> fields. Default is <code>downloads</code></p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mcpr.io/api/v1/users/nprail/plugins",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/plugins/plugin.controller.js",
    "groupTitle": "Plugin",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/users/:username/plugins"
      }
    ]
  },
  {
    "type": "get",
    "url": "/plugins/search",
    "title": "Search For Plugins",
    "name": "SearchPlugins",
    "group": "Plugin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Keyword to search for</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X \"GET\" https://mcpr.io/api/v1/plugins/search?q=dynmap",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/plugins/plugin.controller.js",
    "groupTitle": "Plugin",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/plugins/search"
      }
    ]
  },
  {
    "type": "put",
    "url": "/plugins/:id",
    "title": "Update Plugin",
    "name": "UpdatePlugin",
    "group": "Plugin",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of plugin</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/api/v1/plugins/plugin.controller.js",
    "groupTitle": "Plugin",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/plugins/:id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/users/me/profile",
    "title": "Get Current User",
    "name": "GetCurrentUser",
    "group": "Users",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Your user ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hashedEmail",
            "description": "<p>Your email address base64 hashed</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Your email address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Your username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Your name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "github",
            "description": "<p>Your GitHub username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "gitlab",
            "description": "<p>Your GitLab username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "website",
            "description": "<p>Your website address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "twitter",
            "description": "<p>Your Twitter username</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"5995e9242165660018bb0a8a\",\n  \"hashedEmail\": \"f0c8830d585c2c3cfc1e7d310c3fe933\",\n  \"email\": \"noah@prail.net\",\n  \"username\": \"nprail\",\n  \"name\": \"Noah Prail\",\n  \"github\": \"nprail\",\n  \"gitlab\": \"nprail\",\n  \"website\": \"https://nprail.me\",\n  \"twitter\": \"noahprail\"\n}",
          "type": "json"
        }
      ]
    },
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl --header \"Authorization: Bearer YOUR_JWT_TOKEN\" -i https://mcpr.io/api/v1/users/me/profile",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/users/user.controller.js",
    "groupTitle": "Users",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/users/me/profile"
      }
    ]
  },
  {
    "type": "get",
    "url": "/users/:username",
    "title": "Get User",
    "name": "GetUser",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>User's user ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hashedEmail",
            "description": "<p>User's email address base64 hashed</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User's username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "github",
            "description": "<p>User's GitHub username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "gitlab",
            "description": "<p>User's GitLab username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "website",
            "description": "<p>User's website address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "twitter",
            "description": "<p>User's Twitter username</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"5995e9242165660018bb0a8a\",\n  \"hashedEmail\": \"f0c8830d585c2c3cfc1e7d310c3fe933\",\n  \"email\": \"noah@prail.net\",\n  \"username\": \"nprail\",\n  \"name\": \"Noah Prail\",\n  \"github\": \"nprail\",\n  \"gitlab\": \"nprail\",\n  \"website\": \"https://nprail.me\",\n  \"twitter\": \"noahprail\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mcpr.io/api/v1/users/nprail",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/users/user.controller.js",
    "groupTitle": "Users",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/users/:username"
      }
    ]
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Request User List",
    "name": "GetUsers",
    "group": "Users",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "users",
            "description": "<p>List of users.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "sort",
            "description": "<p>Return users sorted in <code>asc</code> or <code>desc</code> order. Default is <code>desc</code></p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "order_by",
            "description": "<p>Return userse ordered by <code>updatedAt</code>, <code>username</code>, <code>name</code>, or <code>email</code> fields. Default is <code>updatedAt</code></p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mcpr.io/api/v1/users?sort=asc&order_by=username",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/users/user.controller.js",
    "groupTitle": "Users",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/users"
      }
    ]
  },
  {
    "type": "post",
    "url": "/users/me/login",
    "title": "Login",
    "name": "PostLogin",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Your username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Your password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True or false success</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT login token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5OTVlOTI0MjE2NTY2MDAxOGJiMGE4YSIsInVzZXJuYW1lIjoibnByYWlsIiwiaWF0IjoxNTAzMzE4MTIwLCJleHAiOjE1MDMzMjgyMDB9.CATgjmJm-qzq9IAYI5mFMjKe9LdFmF7pvBFMSNwDjLQ\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X \"POST\" https://mcpr.io/api/v1/users/me/login",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/users/user.controller.js",
    "groupTitle": "Users",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/users/me/login"
      }
    ]
  },
  {
    "type": "post",
    "url": "/users/me/signup",
    "title": "Signup",
    "name": "PostSignup",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of new  user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address of new  user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of new  user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True or false success</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"message\": \"Successfully created new user.\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X \"POST\" https://mcpr.io/api/v1/users/me/signup",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/users/user.controller.js",
    "groupTitle": "Users",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/users/me/signup"
      }
    ]
  },
  {
    "type": "put",
    "url": "/users/me/password",
    "title": "Update Password",
    "name": "PutPassword",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "current",
            "description": "<p>Your current password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "new",
            "description": "<p>Your new password</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True or false success</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"message\": \"Password updated!\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X \"PUT\" https://mcpr.io/api/v1/users/me/password",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/users/user.controller.js",
    "groupTitle": "Users",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/users/me/password"
      }
    ]
  },
  {
    "type": "put",
    "url": "/users/me/profile",
    "title": "Update Profile",
    "name": "PutProfile",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Your name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "github",
            "description": "<p>Your GitHub username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "gitlab",
            "description": "<p>Your GitLab username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "website",
            "description": "<p>Your website address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "twitter",
            "description": "<p>Your Twitter username</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True or false success</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"message\": \"Profile updated!\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X \"PUT\" https://mcpr.io/api/v1/users/me/profile",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/users/user.controller.js",
    "groupTitle": "Users",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/users/me/profile"
      }
    ]
  },
  {
    "type": "post",
    "url": "/versions",
    "title": "Create Version",
    "name": "CreateVersion",
    "group": "Versions",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "plugin",
            "description": "<p>ID of the plugin this version belongs to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "version",
            "description": "<p>SemVer string of the version</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "release_notes",
            "description": "<p>A short description of the changes in this version</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the version. (Valid values are R, RC, B, and A)</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "game_versions",
            "description": "<p>List of supported Minecraft versions</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/api/v1/versions/versions.controller.js",
    "groupTitle": "Versions",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/versions"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/versions/:pluginID/:versionID",
    "title": "Delete Version",
    "name": "DeleteVersion",
    "group": "Versions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pluginID",
            "description": "<p>ID of plugin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "versionID",
            "description": "<p>Version of plugin</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X \"DELETE\" https://mcpr.io/api/v1/versions/dynmap/2.4.0",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/versions/versions.controller.js",
    "groupTitle": "Versions",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/versions/:pluginID/:versionID"
      }
    ]
  },
  {
    "type": "get",
    "url": "/versions/:pluginID/:versionID/download",
    "title": "Download Plugin",
    "name": "DownloadVersion",
    "group": "Versions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pluginID",
            "description": "<p>ID of plugin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "versionID",
            "description": "<p>Version of plugin</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -o dynmap.jar https://mcpr.io/api/v1/versions/dynmap/2.4.0/download",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/versions/versions.controller.js",
    "groupTitle": "Versions",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/versions/:pluginID/:versionID/download"
      }
    ]
  },
  {
    "type": "get",
    "url": "/versions/:pluginID",
    "title": "Get Plugin's Verions",
    "name": "GetPluginVersions",
    "group": "Versions",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "versions",
            "description": "<p>List of versions.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "sort",
            "description": "<p>Return versions sorted in <code>asc</code> or <code>desc</code> order. Default is <code>desc</code></p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "order_by",
            "description": "<p>Return versions ordered by <code>downloads</code>, <code>version</code>, <code>plugin</code>, <code>size</code>, or <code>created</code> fields. Default is <code>downloads</code></p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mcpr.io/api/v1/versions/dynmap",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/versions/versions.controller.js",
    "groupTitle": "Versions",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/versions/:pluginID"
      }
    ]
  },
  {
    "type": "get",
    "url": "/versions/:pluginID/:versionID",
    "title": "Get Version",
    "name": "GetVersion",
    "group": "Versions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pluginID",
            "description": "<p>ID of plugin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "versionID",
            "description": "<p>SemVer string of the version</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of the version</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "version",
            "description": "<p>SemVer string of the version</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "release_notes",
            "description": "<p>A short description of the changes in this version</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "downloads",
            "description": "<p>Number of downloads this version has</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "size",
            "description": "<p>Size of the plugin in bytes</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<p>The date on which the plugin was created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the version. (R for Release, RC for Release Candidate, B for Beta, and A for Alpha)</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "game_versions",
            "description": "<p>List of plugin keywords</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"dynmap-2.4.0\",\n  \"version\": \"2.4.0\",\n  \"release_notes\": \"Just some changes\",\n  \"downloads\": 10543,\n  \"size\": \"46547\",\n  \"type\": \"R\",\n  \"game_versions\": [\"1.8\", \"1.9\", \"1.10\", \"1.11\"],\n  \"created\": \"2017-06-12T22:55:07.759Z\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mcpr.io/api/v1/versions/dynmap/2.4.0",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/versions/versions.controller.js",
    "groupTitle": "Versions",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/versions/:pluginID/:versionID"
      }
    ]
  },
  {
    "type": "get",
    "url": "/versions",
    "title": "Get Versions List",
    "name": "GetVersions",
    "group": "Versions",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "versions",
            "description": "<p>List of versions.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "sort",
            "description": "<p>Return versions sorted in <code>asc</code> or <code>desc</code> order. Default is <code>desc</code></p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "order_by",
            "description": "<p>Return versions ordered by <code>downloads</code>, <code>version</code>, <code>plugin</code>, <code>size</code>, or <code>created</code> fields. Default is <code>downloads</code></p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mcpr.io/api/v1/verions",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/api/v1/versions/versions.controller.js",
    "groupTitle": "Versions",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/versions"
      }
    ]
  },
  {
    "type": "put",
    "url": "/versions/:pluginID/:versionID",
    "title": "Update Version",
    "name": "UpdateVersion",
    "group": "Versions",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pluginID",
            "description": "<p>ID of plugin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "versionID",
            "description": "<p>Version of plugin</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/api/v1/versions/versions.controller.js",
    "groupTitle": "Versions",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/versions/:pluginID/:versionID"
      }
    ]
  },
  {
    "type": "post",
    "url": "/versions/:pluginID/:versionID/upload",
    "title": "Upload Plugin Jar",
    "name": "UploadVersion",
    "group": "Versions",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the plugin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "version",
            "description": "<p>Version number of the plugin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "jar",
            "description": "<p>Plugin jar file <code>multipart/form-data</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/api/v1/versions/versions.controller.js",
    "groupTitle": "Versions",
    "sampleRequest": [
      {
        "url": "https://mcpr.io/api/v1/versions/:pluginID/:versionID/upload"
      }
    ]
  }
] });

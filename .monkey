{
  "target": "clicker.my-monkey.fr",
  "source": "./dist/",
  "exclude": [
    "node_modules",
    ".env",
    ".git",
    ".DS_Store",
    ".monkey"
  ],
  "nodejs_app": false,
  "setup": {
    "spa_routing": true
  },
  "build_command": "npm run build",
  "htaccess_rules": [
    "Options -Indexes",
    "ErrorDocument 404 /index.html"
  ],
  "sitemap": {
    "enabled": true,
    "only_defined": true,
    "default_priority": 0.8,
    "default_changefreq": "weekly",
    "priorities": [
      {
        "pattern": "/",
        "priority": 1,
        "changefreq": "weekly"
      }
    ]
  },
  "robots": {
    "enabled": true,
    "user_agent": "*",
    "allow": true,
    "sitemap": true
  }
}

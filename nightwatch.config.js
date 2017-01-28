const fs = require('fs');
const extension = fs.readFileSync('./var/release.crx.base64').toString();

module.exports = {
  "src_folders": [
    "test/e2e"
  ],
  "output_folder": "test/e2e/reports",
  "selenium": {
    "start_process": true,
    "server_path": "node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar",
    "host": "127.0.0.1",
    "port": 4444,
    "cli_args": {
      "webdriver.chrome.driver": "node_modules/webdriver-manager/selenium/chromedriver_2.26",
      "webdriver.ie.driver": ""
    }
  },
  "test_settings": {
    "default": {
      "launch_url": "http://localhost",
      "selenium_port": 4444,
      "selenium_host": "localhost",
      "silent": true,
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "chromeOptions": {
          "extensions": [extension]
        }
      }
    }
  }
};

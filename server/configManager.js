const path = require('path');
const fs = require('fs');
const { app } = require('electron');

class ConfigManager {
  constructor() {
    // Store config in user data directory (persists between updates)
    this.userDataPath = app.getPath('userData');
    this.configPath = path.join(this.userDataPath, 'config.json');
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    return { isConfigured: false };
  }

  saveConfig(config) {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
      this.config = config;
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  }

  isConfigured() {
    return this.config.isConfigured && this.config.mongoUri;
  }

  getMongoUri() {
    return this.config.mongoUri;
  }

  setMongoUri(uri) {
    this.config.mongoUri = uri;
    this.config.isConfigured = true;
    return this.saveConfig(this.config);
  }
}

module.exports = ConfigManager;
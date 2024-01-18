'use strict';

const Service = require('@fabric/core/types/service');

class LabService extends Service {
  constructor (settings = {}) {
    super(settings);

    this.settings = Object.assign({
      name: 'Lab',
      remotes: [
        { host: 'hub.fabric.pub', port: 443, secure: true },
      ],
      state: {
        status: 'INITIALIZED',
        collections: {
          elements: {}
        },
        counts: {
          elements: 0
        }
      }
    }, settings);

    this._state = {
      content: this.settings.state
    };

    return this;
  }

  async start () {
    this.emit('debug', 'Starting...');

    // Sync
    await this.sync();

    // Ready
    this.commit();
    this.emit('ready');

    // Return
    return this;
  }

  async sync () {
    this.emit('debug', 'Syncing...');

    for (let remote of this.settings.remotes) {
      this.emit('debug', `Syncing with ${remote.host}:${remote.port}...`);
      const element = await fetch(`https://${remote.host}:${remote.port}/`, {
        method: 'OPTIONS',
        headers: {
          accept: 'application/json'
        }
      });
      console.debug('RESPONSE:', element.type, element.status, element.headers);

      const response = await element.json();
      this.emit('debug', `Found ${response.length} elements.`);
      for (let element of response) {
        this.emit('debug', `Found element ${element.id}.`);
        // this._state.content.collections.element[element.id] = element;
      }
    }

    this.emit('debug', 'Sync complete!');

    return this;
  }
}

module.exports = LabService;

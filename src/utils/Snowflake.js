// Stolen from discordjs/discord.js and modified

'use strict';

const Long = require('long');

let INCREMENT = 0;

/**
 * Represents a Snowflake
 * @typedef {Snowflake} Snowflake
 */
class Snowflake {
  static _pad(v, n, c = '0') {
    return String(v).length >= n ? String(v) : (String(c).repeat(n) + v).slice(-n);
  }

  /**
   * Used to deconstruct a Snowflake to have some information about it.
   * @function Snowflake._deconstruct()
   * @param {Snowflake} snowflake
   * @returns {Object}
   */
  static _deconstruct(snowflake) {
    const BINARY = this._pad(Long.fromString(snowflake).toString(2), 64);
    const res = {
      timestamp: parseInt(BINARY.substring(0, 42), 2) + 1420070400000,
      workerID: parseInt(BINARY.substring(42, 47), 2),
      processID: parseInt(BINARY.substring(47, 52), 2),
      increment: parseInt(BINARY.substring(52, 64), 2),
      binary: BINARY
    };
    Object.defineProperty(res, 'date', {
      get: function get() { return new Date(this.timestamp); },
      enumerable: true
    });
    return res;
  }

  /**
   * Used to verify if a string is a Snowflake.
   * @function Snowflake.is()
   * @param {Snowflake} snowflake
   * @returns {Boolean}
   */
  static is(snowflake) {
    snowflake = this._deconstruct(snowflake);
    const timestamp = snowflake.timestamp;
    return timestamp > 1420070400000 && timestamp <= 3619093655551;
  }

  /**
   * Used to generate a Snowflake.
   * @function Snowflake.generate()
   * @param {Number} timestamp
   * @returns {String}
   */
  static generate(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    if (typeof timestamp !== 'number' || isNaN(timestamp)) throw new TypeError(`"timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`);

    if (INCREMENT >= 4095) INCREMENT = 0;
    const BINARY = `${this._pad((timestamp - 1420070400000).toString(2), 42)}0000100000${this._pad((INCREMENT++).toString(2), 12)}`;
    return Long.fromString(BINARY, 2).toString();
  }
}

module.exports = Snowflake;
'use strict';

/**
 * Represents the embed builder
 * @typedef {MessageEmbed} MessageEmbed
 */
class MessageEmbed {
  /**
   * @constructor
   */
  constructor() {
    this.embed = [{
      title: null,
      author: null,
      color: null,
      description: null,
      thumbnail: null,
      fields: [],
      image: null,
      footer: null,
      timestamp: null
    }];
  }

  /**
   * Sets the title of the embed.
   * @param {?string} title The title
   * @returns {MessageEmbed}
   */
  setTitle(title) {
    if (!title) throw new Error('[MessageEmbed] You must provide a title to set a title!');
    if (title.length > 256) throw new Error('[MessageEmbed] You must provide a title with 256 characters max.!');
    this.embed[0].title = title;
    return this;
  }

  /**
   * Sets the description of the embed.
   * @param {string} description The description
   * @returns {MessageEmbed}
   */
  setDescription(description) {
    if (!description) throw new Error('[MessageEmbed] You must provide a description to set a description!');
    if (description.length > 2048) throw new Error('[MessageEmbed] You must provide a description with 2048 characters max.!');
    this.embed[0].description = description;
    return this;
  }

  /**
   * Sets the image of the embed.
   * @param {string} url The URL of the image
   * @returns {MessageEmbed}
   */
  setImage(url) {
    if (!url) throw new Error('[MessageEmbed] You must provide an url to set an image!');
    this.embed[0].image = {
      url: url
    };
    return this;
  }

  /**
   * Sets the thumbnail of the embed.
   * @param {string} url The URL of the thumbnail
   * @returns {MessageEmbed}
   */
  setThumbnail(url) {
    if (!url) throw new Error('[MessageEmbed] You must provide a text to set a footer!');
    this.embed[0].thumbnail = {
      url: url
    };
    return this;
  }

  /**
   * Sets the footer of the embed.
   * @param {string} text The text of the footer
   * @param {string} iconURL The icon URL of the footer
   * @returns {MessageEmbed}
   */
  setFooter(text, iconURL) {
    if (!text) throw new Error('[MessageEmbed] You must provide a text to set a footer!');
    if (text.length > 2048) throw new Error('[MessageEmbed] You must provide a text of a footer with 2048 characters max.!');
    if (!iconURL) throw new Error('[MessageEmbed] You must provide a iconURL to set a footer!');
    this.embed[0].footer = {
      text: text,
      icon_url: iconURL
    };
    return this;
  }

  /**
   * Sets the timestamp of the embed.
   * @returns {MessageEmbed}
   */
  setTimestamp() {
    this.embed[0].timestamp = new Date();
    return this;
  }

  /**
   * Sets the author of the embed.
   * @param {string} name The name of the author
   * @param {string} iconURL The icon URL of the author
   * @returns {MessageEmbed}
   */
  setAuthor(name, iconURL) {
    if (!name) throw new Error('[MessageEmbed] You must provide a name to set an author!');
    if (name.length > 256) throw new Error('[MessageEmbed] You must provide an author with 256 characters max.!');
    if (!iconURL) throw new Error('[MessageEmbed] You must provide a iconURL to set a author!');
    this.embed[0].author = {
      name: name,
      icon_url: iconURL
    };
    return this;
  }

  /**
   * Sets the color of the embed.
   * @param {string|number|number[]} color The color of the embed
   * @returns {MessageEmbed}
   */
  setColor(color) {
    if (!color) throw new Error('[MessageEmbed] You must provide a color to set a color!');
    this.embed[0].color = color;
    return this;
  }

  /**
   * Adds a field to the embed.
   * @param {string} name The name of the field
   * @param {string} value The value of the field
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {MessageEmbed}
   */
  addField(name, value, inline = false) {
    if (!name) throw new Error('[MessageEmbed] You must provide a name to add a field!');
    if (name.length > 256) throw new Error('[MessageEmbed] You must provide a name of a field with 256 characters max.!');
    if (!value) throw new Error('[MessageEmbed] You must provide a value to add a field!');
    if (value.length > 1024) throw new Error('[MessageEmbed] You must provide a value of a field with 1024 characters max.!');
    if (this.embed[0].fields.length > 25) throw new Error('[MessageEmbed] You can include 25 fields max.!');
    this.embed[0].fields.push({
      name,
      value,
      inline: inline
    });
    return this;
  }
}

module.exports = MessageEmbed;
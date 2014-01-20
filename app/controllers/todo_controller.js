// Todo Controller
// ==========================

// An example controller for a page containing a twitter feed

var tetra = require('tetra'),
  controller = new tetra.locomotive.Controller();

controller.index = function () {
  this.render();
};

module.exports = controller;

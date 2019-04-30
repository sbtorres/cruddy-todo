const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        throw ('error creating new todo file');
      }
      callback(null, { id, text }); 
    })
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('could not map director');
    } else {
      var returnArray = [];
      _.map(files, (file) => {
        returnArray.push({id: file.slice(0, -4), text: file.slice(0, -4)});
      })
      callback(null, returnArray);
    }
  })  
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

// For when doing promises
  // var todoFiles = fs.readdir(path.join(__dirname, 'data'), (err, files) => {
  //   if (err) {
  //     throw ('could not map director');
  //   } else {
  //     return _.map(files, (file) => {
  //       fs.readFile(path.join(__dirname, 'data', `${file}`), 'utf8', (err, text) => {
  //       if (err) {
  //         throw ('file not properly mapped');
  //       } else {
  //         var randomID = Math.floor(Math.random() * 1000000);
  //         callback(null, { randomID , text });
  //       }
  //     })})
  //   }
  // })
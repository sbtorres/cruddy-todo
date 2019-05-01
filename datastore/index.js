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
  var fileArray = fs.readdirSync(exports.dataDir)

  var promisedArray = fileArray.map((file) => {
    return new Promise (function (resolve, reject) {
      fs.readFile(`${exports.dataDir}/${file}`, 'utf-8', (err, text) => {
      if(err) {
        reject(err);
      } else {
        resolve({id: file.slice(0, -4), text: text});
      }
    })
  })
  })

  Promise.all(promisedArray).then((todos) => {
    callback(null, todos);
  })

};

// exports.readAll = (callback) => {
//   fs.readdir(exports.dataDir, (err, files) => {
//     if (err) {
//       throw ('could not map director');
//     } else {
//       var returnArray = [];
//       _.map(files, (file) => {
//         returnArray.push({id: file.slice(0, -4), text: file.slice(0, -4)});
//       })
//       callback(null, returnArray);
//     }
//   })  
// };

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, text) => {
    if (err) {
      let error = ('not a valid id');
      callback(error);
    } else {
      callback(null, {id, text});
    }
  })
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err) => {
    if (err) {
      callback('File does not exist');
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback (err);
        } else {
          callback(null, {id, text});
        }
      })
    }
  })
}

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  })
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
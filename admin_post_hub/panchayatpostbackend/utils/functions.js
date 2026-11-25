const httpStatus = require("http-status");
const fs = require("fs");
// const gm = require('gm')
// const Jimp = require('jimp');
const path = require('path');

const statusCheck = (status) => {
  return status ? { status: true } : {};
};


// const compressImages = async (file) => {
//     console.log('file', file);

//     const ref = __dirname.replace('utils', '') + file.path
//     const output = __dirname.replace('utils', '') + file.destination + '/' + 'preview' + '.jpg'
//     console.log(ref);
//     console.log('preview', __dirname.replace('utils', '')
//         + file.destination + '/' + 'preview' + Date.now() + '.jpg');
//     await Jimp.read(ref, (err, lenna) => {
//         if (err) throw err;
//         lenna
//             .resize(256, 256) // resize
//             .quality(60)
//             .write(output); // save
//     });

//     console.log('file.destination + ref', ref);
//     return ref
// }

const getFilesData = async (files) => {
  if (files) {
    if (Array.isArray(files)) {
      if (files.length > 0) {
        let images = [];
        await Promise.all(files.map(async (file) => {
          // const fileName = compressImages(file)
          const fileName = file.destination + "/" + file.filename;
          // console.log('fileName', fileName);
          // const thumbnail = await gm('http://localhost:4000/' + fileName).resize(100, 100).write('http://localhost:4000/' + file.destination + "/" + Date.now() + path.extname(file.originalname), function (err) {
          //   if (!err) console.log('done');
          //   else console.log('err', err);
          // });
          // console.log('fileName', thumbnail);

          images.push(fileName);
        }));
        return images;
      } else if (files.destination) {
        // return compressImages(files)
        return files.destination + "/" + files.filename;
      }
    } else {
      // return compressImages(files)
      return files.destination + "/" + files.filename;
    }
  }
};

const removeFile = (file) => {
  if (typeof file === "object") {
    if (file.length > 0) {
      file.map((f) => {
        if (fs.existsSync(f)) {
          fs.unlink(f, (err) => {
            if (err) {
              return { status: httpStatus.INTERNAL_SERVER_ERROR, message: err };
            }
          });
        }
      });
    }
  } else {
    if (fs.existsSync(file)) {
      fs.unlink(file, (err) => {
        if (err) {
          return { status: httpStatus.INTERNAL_SERVER_ERROR, message: err };
        }
      });
    }
  }
};


const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


module.exports = {
  getFilesData,
  removeFile,
  statusCheck,
  shuffle
};

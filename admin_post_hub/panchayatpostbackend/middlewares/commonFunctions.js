const fs = require('fs');
const httpStatus = require('http-status');
const getColors = require('get-image-colors')
const tinycolor = require("tinycolor2");

const removeFile = (file) => {
    const fileNameWithPath = 'public' + file
    if (fs.existsSync(fileNameWithPath)) {
        fs.unlink(fileNameWithPath, (err) => {
            if (err) {
                return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: err })
            }
        });
    }
}

const getColorImage = async (filename) => {
    const options = {
        count: 1,
    }
    const colors = await getColors(filename, options).then(colors => {
        return colors
    })
    return colors.map(color => color.hex())
}

const shadeColor = (col, amt) => {

    return tinycolor(col).lighten(amt).toString();

}

module.exports = { removeFile, getColorImage, shadeColor }
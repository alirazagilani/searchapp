const express = require("express");
const app = express();


let fs = require("fs");

let readFromFile = async (filename) => {
  let path = process.cwd() + `\/${filename}`;

  try {
    if (fs.existsSync(path)) {
      let data = await fs.promises.readFile(path, "utf8");
      return data;
    } else {
      return { error: "no file exist" };
    }
  } catch (err) {
    return { error: err };
  }
};

function containsSpecialChars(str) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}

let fileWordArray = [];
const hashArray = {};
let fileData;

const findWord = async (word) => {
  if (!fileData) {
    // console.log("read");
    fileData = await readFromFile("inp.txt");
    fileWordArray = fileData.split(/\r?\n| /);
    for (let [index, word] of fileWordArray.entries()) {
      // console.log(index, " - ", word)
      let element = word;
      if (containsSpecialChars(element[0])) {
        element = element.substring(1);
      }
      if (containsSpecialChars(element[element.length - 1])) {
        element = element.substring(0, element.length - 1);
      }
      element = element.toLowerCase().trim();
      if (hashArray[element]) hashArray[element].push(index);
      else hashArray[element] = [index];
    }
  }

  // console.log(hashArray);

  if (hashArray[word]) {
    let indexes = hashArray[word];
    let result = [];
    let startIndex = 0;
    let endIndex = 0;
    indexes.forEach((index) => {
      // console.log("current: ",index);
      startIndex = index - 3 < 0 ? 0 : index - 3;
      endIndex =
        index + 4 > fileWordArray.length - 1 ? fileWordArray.length : index + 4;

      var newArr = fileWordArray.slice(startIndex, endIndex);
      result.push(newArr.join(" "));
    });
    return { success: 1, data: result };
  } else {
    return { success: 0, data: "No match found" };
  }
};

app.get("/search", async (req, res) => {
  // console.log(res)
  var params = req.query;
  if (params.word) {
    const response = await findWord(params.word);
    // console.log("resposne: ", response);
    res.send({success: response.success, data: response.data });
    return;
  }

  res.send({success: 0, data: "Word param missing" });
});

module.exports = app;
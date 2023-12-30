const { ipcRenderer } = require("electron");
const axios = require("axios");
const path = require("path");
const SERVER_URL = require(path.join(__dirname, "config"));
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

document.querySelector(".file-upload").addEventListener("click", () => {
  ipcRenderer.send("file-request");
});

document.querySelector(".weight-upload").addEventListener("click", () => {
  ipcRenderer.send("weight-request");
});

ipcRenderer.on("imageFile", (evt, payload) => {
  axios.post(`${SERVER_URL}/processImage`, { imageFile: payload }).then(response => {
    console.log(`imageFile response log: ${response}`);
  }).catch(error => {
    console.log(`imageFile error log: ${error}`);
  });
  const img = new Image();
  img.src = "data:image/png;base64," + payload.content;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };
});

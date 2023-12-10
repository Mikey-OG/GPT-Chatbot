"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.config = void 0;
var formidable = require("formidable");
var fs_1 = require("fs");
var path_1 = require("path");
exports.config = {
    api: {
        bodyParser: false
    }
};
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var form;
        return __generator(this, function (_a) {
            form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
                var oldPath = uploadedFile.filepath;
                var newPath = path_1["default"].join(process.cwd(), 'public')
                    + '/uploaded_file.pdf';
                var rawData = fs_1["default"].readFileSync(oldPath);
                fs_1["default"].rename(oldPath, newPath, function (err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ success: false, message: "Problem with file upload" });
                    }
                    // Send a success message
                    res.status(200).json({ success: true, message: "File has been successfully uploaded" });
                    // if (err) console.log(err)
                    // return res.json({ success: false, message: "Problem with file upload" });
                    // return res.send("Successfully uploaded")
                    // var tempFilePath = files.filetoupload.filepath; 
                    // var projectFilePath = __dirname + '/uploaded_file/' + 
                    //     files.filetoupload.originalFilename; 
                    // fs.rename(tempFilePath, projectFilePath, function (err) { 
                    //     if (err) throw err; 
                    //     res.write('File has been successfully uploaded'); 
                    //     res.end(); 
                });
            });
            return [2 /*return*/];
        });
    });
}
exports["default"] = handler;
// import type { NextApiRequest, NextApiResponse } from 'next';
// import * as formidable from 'formidable';
// import fs from 'fs';
// import path from 'path';
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
// interface CustomFormidableFile extends formidable.File {
//   path: string;
//   name: string;
// }
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const form = new formidable.IncomingForm();
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error('Error parsing form:', err);
//         res.status(500).json({ error: 'Error parsing form' });
//         return;
//       }
//       // Check if files exist and have the expected properties
//       if (!files || !files.file) {
//         res.status(400).json({ error: 'No file uploaded' });
//         return;
//       }
//       const uploadedFile = Array.isArray(files.file)
//       ? (files.file[0] as CustomFormidableFile)
//       : (files.file as CustomFormidableFile);
//         // ? files.file[0]
//         // : files.file;
//       console.log('uploadedFile:', uploadedFile); // Log the uploaded file object
//       // Use the original path property or any other property that contains the file path
//       const tempPath = uploadedFile.path || uploadedFile['path'];
//       const newFileName = 'uploaded.pdf';
//       const newPath = path.join(process.cwd(), 'public', newFileName); // Adjust the upload directory path
//       console.log('tempPath:', tempPath);
//       console.log('newPath:', newPath);
//       if (!tempPath) {
//         console.log('Uploaded file:', uploadedFile);
//         res.status(500).json({ error: 'Uploaded file path is undefined' });
//         return;
//       }
//       fs.rename(tempPath, newPath, (renameErr) => {
//         if (renameErr) {
//           console.error('Error renaming file:', renameErr);
//           res.status(500).json({ error: 'Error renaming file' });
//           return;
//         }
//         res.status(200).json({ success: true });
//       });
//     });
//   } catch (error) {
//     console.error('Error handling file upload:', error);
//     res.status(500).json({ error: 'Error handling file upload' });
//   }
// }
// import type { NextApiRequest, NextApiResponse } from 'next';
// import * as formidable from 'formidable';
// import fs from 'fs';
// import path from 'path';
// interface CustomFormidableFile extends formidable.File {
//   path: string;
//   name: string;
// }
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const form = new formidable.IncomingForm();
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error('Error parsing form:', err);
//         res.status(500).json({ error: 'Error parsing form' });
//         return;
//       }
//       // Check if files exist and have the expected properties
//       if (!files || !files.file) {
//         res.status(400).json({ error: 'No file uploaded' });
//         return;
//       }
//     //   const uploadedFile = Array.isArray(files.file)
//     //     ? (files.file[0] as CustomFormidableFile)
//     //     : (files.file as CustomFormidableFile); // Use the first file in the array if it's an array
//         const uploadedFile = Array.isArray(files.file)
//         ? files.file[0]
//         : files.file;
//     //   console.log('uploadedFile:', uploadedFile); // Log the uploaded file object
//       const fs = require('fs');
//       const path = require('path');
//        console.log((uploadedFile as any).path);
//        console.log((uploadedFile as any).name);
//       // Check if path is defined before using it
//       if ((!uploadedFile as any).path) {
//         // console.log('Uploaded file:', uploadedFile);
//         res.status(500).json({ error: 'Uploaded file path is undefined' });
//         return;
//       }
//       const tempPath = (uploadedFile as any).path!;
//       const newFileName = 'uploaded.pdf';
//       const newPath = path.join(process.cwd(), 'public', newFileName); // Adjust the upload directory path
//       console.log('tempPath:', tempPath);
//       console.log('newPath:', newPath);
//       fs.rename(tempPath, newPath);
//       res.status(200).json({ success: true });
//     });
//   } catch (error) {
//     console.error('Error handling file upload:', error);
//     res.status(500).json({ error: 'Error handling file upload' });
//   }
// }

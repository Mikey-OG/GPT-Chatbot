import type { NextApiRequest, NextApiResponse } from 'next';
import * as formidable from 'formidable';
import fs from 'fs';
import path from 'path';

interface CustomFormidableFile extends formidable.File {
  path?: string;
  name?: string;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      const uploadedFile = Array.isArray(files.file) ? (files.file[0] as CustomFormidableFile) : (files.file as unknown as CustomFormidableFile);

        let oldPath = uploadedFile.filepath;
        let newPath = path.join(process.cwd(), 'public')
            + '/uploaded_file.pdf'
        let rawData = fs.readFileSync(oldPath)
 
        fs.rename(oldPath, newPath, function (err) {
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
        })
    })
  // try {
  //   const form = new formidable.IncomingForm();

  //   form.parse(req, async (err, fields, files) => {
  //     if (err) {
  //       console.error('Error parsing form:', err);
  //       res.status(500).json({ error: 'Error parsing form' });
  //       return;
  //     }

  //     // Check if files exist and have the expected properties
  //     if (!files || !files.file) {
  //       res.status(400).json({ error: 'No file uploaded' });
  //       return;
  //     }
    
  //     const uploadedFile = Array.isArray(files.file)
  //       ? (files.file[0] as CustomFormidableFile)
  //       : (files.file as CustomFormidableFile);

  //     console.log('uploadedFile:', uploadedFile);

  //     // Check if path is defined before using it
  //     if (!uploadedFile.path) {
  //       console.error('Uploaded file:', uploadedFile);
  //       res.status(500).json({ error: 'Uploaded file path is undefined' });
  //       return;
  //     }

  //     const tempPath = uploadedFile.path;
  //     const newFileName = 'uploaded.pdf';
  //     const newPath = path.join(process.cwd(), 'public', newFileName);

  //     console.log('tempPath:', tempPath);
  //     console.log('newPath:', newPath);

  //     fs.rename(tempPath, newPath, (renameErr) => {
  //       if (renameErr) {
  //         console.error('Error renaming file:', renameErr);
  //         res.status(500).json({ error: 'Error renaming file', details: renameErr.message });
  //         return;
  //       }

  //       res.status(200).json({ success: true });
  //     });
  //   });
  // } catch (error) {
  //   console.error('Error handling file upload:', error);
  //   res.status(500).json({ error: 'Error handling file upload' });
  // }
}



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

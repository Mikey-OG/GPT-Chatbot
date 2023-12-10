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
var openai_1 = require("langchain/embeddings/openai");
var pinecone_1 = require("langchain/vectorstores/pinecone");
var schema_1 = require("langchain/schema");
var makechain_1 = require("@/utils/makechain");
var pinecone_client_1 = require("@/utils/pinecone-client");
var pinecone_2 = require("@/config/pinecone");
var fs_1 = require("fs");
var path_1 = require("path");
function extractTextFromPDF(pdfFilePath) {
    return __awaiter(this, void 0, Promise, function () {
        var pdf, dataBuffer, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pdf = require('pdf-parse');
                    dataBuffer = fs_1["default"].readFileSync(pdfFilePath);
                    return [4 /*yield*/, pdf(dataBuffer)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data.text];
            }
        });
    });
}
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, question, history, sanitizedQuestion, pdfFilePath, pdfContent, index, vectorStore, chain, pastMessages, response, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, question = _a.question, history = _a.history;
                    console.log('question', question);
                    console.log('history', history);
                    //only accept post requests
                    if (req.method !== 'POST') {
                        res.status(405).json({ error: 'Method not allowed' });
                        return [2 /*return*/];
                    }
                    if (!question) {
                        return [2 /*return*/, res.status(400).json({ message: 'No question in the request' })];
                    }
                    sanitizedQuestion = question.trim().replaceAll('\n', ' ');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    pdfFilePath = path_1["default"].join(process.cwd(), 'public', 'uploaded_file.pdf');
                    return [4 /*yield*/, extractTextFromPDF(pdfFilePath)];
                case 2:
                    pdfContent = _b.sent();
                    index = pinecone_client_1.pinecone.Index(pinecone_2.PINECONE_INDEX_NAME);
                    return [4 /*yield*/, pinecone_1.PineconeStore.fromExistingIndex(new openai_1.OpenAIEmbeddings({}), {
                            pineconeIndex: index,
                            textKey: 'text'
                        })];
                case 3:
                    vectorStore = _b.sent();
                    chain = makechain_1.makeChain(vectorStore);
                    pastMessages = history.map(function (message, i) {
                        if (i % 2 === 0) {
                            return new schema_1.HumanMessage(message);
                        }
                        else {
                            return new schema_1.AIMessage(message);
                        }
                    });
                    pastMessages.push(new schema_1.AIMessage(pdfContent));
                    return [4 /*yield*/, chain.call({
                            question: sanitizedQuestion,
                            chat_history: pastMessages
                        })];
                case 4:
                    response = _b.sent();
                    console.log('response', response);
                    res.status(200).json(response);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.log('error', error_1);
                    res.status(500).json({ error: error_1.message || 'Something went wrong' });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = handler;
// import type { NextApiRequest, NextApiResponse } from 'next';
// import type { Document } from 'langchain/document';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { PineconeStore } from 'langchain/vectorstores/pinecone';
// import { makeChain } from '@/utils/makechain';
// import { pinecone } from '@/utils/pinecone-client';
// import { PINECONE_INDEX_NAME} from '@/config/pinecone';
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { question, history } = req.body;
//   console.log('question', question);
//   console.log('history', history);
//   //only accept post requests
//   if (req.method !== 'POST') {
//     res.status(405).json({ error: 'Method not allowed' });
//     return;
//   }
//   if (!question) {
//     return res.status(400).json({ message: 'No question in the request' });
//   }
//   // OpenAI recommends replacing newlines with spaces for best results
//   const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
//   try {
//     const index = pinecone.Index(PINECONE_INDEX_NAME);
//     /* create vectorstore*/
//     const vectorStore = await PineconeStore.fromExistingIndex(
//       new OpenAIEmbeddings({}),
//       {
//         pineconeIndex: index,
//         textKey: 'text',
//         // namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
//       },
//     );
//     // Use a callback to get intermediate sources from the middle of the chain
//     let resolveWithDocuments: (value: Document[]) => void;
//     const documentPromise = new Promise<Document[]>((resolve) => {
//       resolveWithDocuments = resolve;
//     });
//     const retriever = vectorStore.asRetriever({
//       callbacks: [
//         {
//           handleRetrieverEnd(documents) {
//             resolveWithDocuments(documents);
//           },
//         },
//       ],
//     });
//     //create chain
//     const chain = makeChain(vectorStore);
//     const pastMessages = history
//       .map((message: [string, string]) => {
//         return [`Human: ${message[0]}`, `Assistant: ${message[1]}`].join('\n');
//       })
//       .join('\n');
//     console.log(pastMessages);
//     //Ask a question using chat history
//     const response = await chain.invoke({
//       question: sanitizedQuestion,
//       chat_history: pastMessages,
//     });
//     const sourceDocuments = await documentPromise;
//     console.log('response', response);
//     res.status(200).json({ text: response, sourceDocuments });
//   } catch (error: any) {
//     console.log('error', error);
//     res.status(500).json({ error: error.message || 'Something went wrong' });
//   }
// }
// import type { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import path from 'path';
// import formidable from 'formidable';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { PineconeStore } from 'langchain/vectorstores/pinecone';
// import { AIMessage, HumanMessage } from 'langchain/schema';
// import { makeChain } from '@/utils/makechain';
// import { pinecone } from '@/utils/pinecone-client';
// import { PINECONE_INDEX_NAME } from '@/config/pinecone';
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { question, history } = req.body;
//   console.log('question', question);
//   console.log('history', history);
//   // only accept post requests
//   if (req.method !== 'POST') {
//     res.status(405).json({ error: 'Method not allowed' });
//     return;
//   }
//   if (!question) {
//     return res.status(400).json({ message: 'No question in the request' });
//   }
//   // OpenAI recommends replacing newlines with spaces for best results
//   const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
//   try {
//     // Load the uploaded PDF content
//     const pdfFilePath = path.join(process.cwd(), 'public', 'fontys_doc.pdf');
//     const pdfContent = fs.readFileSync(pdfFilePath, 'utf-8');
//     const index = pinecone.Index(PINECONE_INDEX_NAME);
//     // create vectorstore
//     const vectorStore = await PineconeStore.fromExistingIndex(
//       new OpenAIEmbeddings({}),
//       {
//         pineconeIndex: index,
//         textKey: 'text',
//         // namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
//       },
//     );
//     // create chain
//     const chain = makeChain(vectorStore);
//     const pastMessages = history.map((message: string, i: number) => {
//       if (i % 2 === 0) {
//         return new HumanMessage(message);
//       } else {
//         return new AIMessage(message);
//       }
//     });
//     // Include the PDF content in the chat history
//     pastMessages.push(new AIMessage(pdfContent));
//     // Ask a question using updated chat history
//     const response = await chain.call({
//       question: sanitizedQuestion,
//       chat_history: pastMessages,
//     });
//     console.log('response', response);
//     res.status(200).json(response);
//   } catch (error: any) {
//     console.log('error', error);
//     res.status(500).json({ error: error.message || 'Something went wrong' });
//   }
// }
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { PineconeStore } from 'langchain/vectorstores/pinecone';
// import { AIMessage, HumanMessage } from 'langchain/schema';
// import { makeChain } from '@/utils/makechain';
// import { pinecone } from '@/utils/pinecone-client';
// import { PINECONE_INDEX_NAME} from '@/config/pinecone';
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { question, history } = req.body;
//   console.log('question', question);
//   console.log('history', history);
//   //only accept post requests
//   if (req.method !== 'POST') {
//     res.status(405).json({ error: 'Method not allowed' });
//     return;
//   }
//   if (!question) {
//     return res.status(400).json({ message: 'No question in the request' });
//   }
//   // OpenAI recommends replacing newlines with spaces for best results
//   const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
//   try {
//     const index = pinecone.Index(PINECONE_INDEX_NAME);
//     /* create vectorstore*/
//     const vectorStore = await PineconeStore.fromExistingIndex(
//       new OpenAIEmbeddings({}),
//       {
//         pineconeIndex: index,
//         textKey: 'text',
//         // namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
//       },
//     );
//     //create chain
//     const chain = makeChain(vectorStore);
//     const pastMessages = history.map((message: string, i: number) => {
//       if (i % 2 === 0) {
//         return new HumanMessage(message);
//       } else {
//         return new AIMessage(message);
//       }
//     });
//     //Ask a question using chat history
//     const response = await chain.call({
//       question: sanitizedQuestion,
//       chat_history: pastMessages
//     });
//     console.log('response', response);
//     res.status(200).json(response);
//   } catch (error: any) {
//     console.log('error', error);
//     res.status(500).json({ error: error.message || 'Something went wrong' });
//   }
// }

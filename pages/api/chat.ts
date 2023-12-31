import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { AIMessage, HumanMessage } from 'langchain/schema';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME} from '@/config/pinecone';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

async function extractTextFromPDF(pdfFilePath: string): Promise<string> {
  // Use a PDF parsing library to extract text from the PDF file
  // Example: You can use 'pdf-parse' or any other suitable library
  // Install 'pdf-parse' using: npm install pdf-parse
  const pdf = require('pdf-parse');
  const dataBuffer = fs.readFileSync(pdfFilePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history } = req.body;

  console.log('question', question);
  console.log('history', history);

  //only accept post requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {

    const pdfFilePath = path.join(process.cwd(), 'public', 'uploaded_file.pdf');
    const pdfContent = await extractTextFromPDF(pdfFilePath);
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        // namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
      },
    );

    //create chain
    const chain = makeChain(vectorStore);

    const pastMessages = history.map((message: string, i: number) => {
      if (i % 2 === 0) {
        return new HumanMessage(message);
      } else {
        return new AIMessage(message);
      }
    });
    
    pastMessages.push(new AIMessage(pdfContent));
    //Ask a question using chat history
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: pastMessages
    });

    console.log('response', response);
    res.status(200).json(response);
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}




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

"use strict";
exports.__esModule = true;
exports.makeChain = void 0;
var openai_1 = require("langchain/chat_models/openai");
var chains_1 = require("langchain/chains");
var CONDENSE_TEMPLATE = "Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.\n\nChat History:\n{chat_history}\nFollow Up Input: {question}\nStandalone question:";
var QA_TEMPLATE = "You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.\nIf you don't know the answer, just say you don't know. DO NOT try to make up an answer.\nIf the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.\n\n{context}\n\nQuestion: {question}\nHelpful answer in markdown:";
exports.makeChain = function (vectorstore) {
    var model = new openai_1.ChatOpenAI({
        temperature: 0,
        modelName: 'gpt-3.5-turbo-0301'
    });
    var chain = chains_1.ConversationalRetrievalQAChain.fromLLM(model, vectorstore.asRetriever(3), {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: CONDENSE_TEMPLATE,
        returnSourceDocuments: true
    });
    return chain;
};

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var layout_1 = require("@/components/layout");
var Home_module_css_1 = require("@/styles/Home.module.css");
var image_1 = require("next/image");
var react_markdown_1 = require("react-markdown");
var LoadingDots_1 = require("@/components/ui/LoadingDots");
var accordion_1 = require("@/components/ui/accordion");
var react_2 = require("react");
var react_dropzone_1 = require("react-dropzone");
var VoiceButton = function (_a) {
    var onSpeechRecognition = _a.onSpeechRecognition;
    var _b = react_1.useState(false), isListening = _b[0], setIsListening = _b[1];
    var recognition = typeof window !== 'undefined' ? new window.webkitSpeechRecognition() : null;
    react_1.useEffect(function () {
        recognition.onresult = function (event) {
            var transcript = event.results[0][0].transcript;
            onSpeechRecognition(transcript);
        };
        recognition.onend = function () {
            setIsListening(false);
        };
    }, [onSpeechRecognition]);
    var toggleListening = function () {
        if (isListening) {
            recognition.stop();
        }
        else {
            recognition.start();
            setIsListening(true);
        }
    };
    return (React.createElement("button", { onClick: toggleListening, style: {
            // backgroundColor: '#4CAF50', // Set your desired background color
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            // marginLeft: '900px',
            // marginTop: '-150px',
            position: 'absolute',
            top: '8px',
            left: '850px'
        }, className: 'dropzone bg-gray-900 border border-gray-800 p-10 rounded-md hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer' }, isListening ? 'Stop Listening' : 'Start Listening'));
};
function Home() {
    var _this = this;
    var onDrop = react_2.useCallback(function (acceptedFiles) { return __awaiter(_this, void 0, void 0, function () {
        var file, formData, response, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = acceptedFiles[0];
                    if (file.type !== "application/pdf") {
                        alert("Please upload a PDF");
                        return [2 /*return*/];
                    }
                    formData = new FormData();
                    formData.set("file", file);
                    return [4 /*yield*/, fetch("/api/addData", {
                            method: "POST",
                            body: formData
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    body = _a.sent();
                    if (body.success) {
                        alert("Data added successfully");
                    }
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var _a = react_dropzone_1.useDropzone({
        onDrop: onDrop
    }), getRootProps = _a.getRootProps, getInputProps = _a.getInputProps;
    var _b = react_1.useState(''), query = _b[0], setQuery = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState(null), error = _d[0], setError = _d[1];
    var _e = react_1.useState({
        messages: [
            {
                message: 'Hi, what would you like to learn about this document?',
                type: 'apiMessage'
            },
        ],
        history: []
    }), messageState = _e[0], setMessageState = _e[1];
    var messages = messageState.messages, history = messageState.history;
    var messageListRef = react_1.useRef(null);
    var textAreaRef = react_1.useRef(null);
    react_1.useEffect(function () {
        var _a;
        (_a = textAreaRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, []);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var question, response, data_1, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    setError(null);
                    if (!query) {
                        alert('Please input a question');
                        return [2 /*return*/];
                    }
                    question = query.trim();
                    setMessageState(function (state) { return (__assign(__assign({}, state), { messages: __spreadArrays(state.messages, [
                            {
                                type: 'userMessage',
                                message: question
                            },
                        ]) })); });
                    setLoading(true);
                    setQuery('');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                question: question,
                                history: history
                            })
                        })];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data_1 = _b.sent();
                    if (data_1.error) {
                        setError(data_1.error);
                    }
                    else {
                        setMessageState(function (state) { return (__assign(__assign({}, state), { messages: __spreadArrays(state.messages, [
                                {
                                    type: 'apiMessage',
                                    message: data_1.text,
                                    sourceDocs: data_1.sourceDocuments
                                },
                            ]), history: __spreadArrays(state.history, [[question, data_1.text]]) })); });
                    }
                    setLoading(false);
                    (_a = messageListRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo(0, messageListRef.current.scrollHeight);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    setLoading(false);
                    setError('An error occurred while fetching the data. Please try again.');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var speakResponse = function (message) {
        var synth = window.speechSynthesis;
        var utterance = new SpeechSynthesisUtterance(message);
        synth.speak(utterance);
    };
    var handleSpeechRecognition = function (transcript) { return __awaiter(_this, void 0, void 0, function () {
        var question, response, data_2, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    question = transcript.trim();
                    // Update the state to include the user's question
                    setMessageState(function (state) { return (__assign(__assign({}, state), { messages: __spreadArrays(state.messages, [
                            {
                                type: 'userMessage',
                                message: question
                            },
                        ]) })); });
                    // Set the query and proceed with handling the question
                    setQuery(question);
                    // Call the API to get a response
                    setLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                question: question,
                                history: history
                            })
                        })];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data_2 = _b.sent();
                    if (data_2.error) {
                        setError(data_2.error);
                    }
                    else {
                        // Update the state with the API response
                        setMessageState(function (state) { return (__assign(__assign({}, state), { messages: __spreadArrays(state.messages, [
                                {
                                    type: 'apiMessage',
                                    message: data_2.text,
                                    sourceDocs: data_2.sourceDocuments
                                },
                            ]), history: __spreadArrays(state.history, [[question, data_2.text]]) })); });
                        speakResponse(data_2.text);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    setError('An error occurred while fetching the data. Please try again.');
                    return [3 /*break*/, 5];
                case 5:
                    setLoading(false);
                    // Scroll to the bottom of the message list
                    (_a = messageListRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo(0, messageListRef.current.scrollHeight);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleEnter = function (e) {
        if (e.key === 'Enter' && query) {
            handleSubmit(e);
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(layout_1["default"], null,
            React.createElement("div", { className: "mx-auto flex flex-col gap-4" },
                React.createElement("h1", { className: "text-2xl font-bold leading-[1.1] tracking-tighter text-center" }),
                React.createElement("main", { className: Home_module_css_1["default"].main },
                    React.createElement("div", { className: Home_module_css_1["default"].cloud },
                        React.createElement("div", { ref: messageListRef, className: Home_module_css_1["default"].messagelist }, messages.map(function (message, index) {
                            var icon;
                            var className;
                            if (message.type === 'apiMessage') {
                                icon = (React.createElement(image_1["default"], { key: index, src: "/bot-image.png", alt: "AI", width: "40", height: "40", className: Home_module_css_1["default"].boticon, priority: true }));
                                className = Home_module_css_1["default"].apimessage;
                            }
                            else {
                                icon = (React.createElement(image_1["default"], { key: index, src: "/usericon.png", alt: "Me", width: "30", height: "30", className: Home_module_css_1["default"].usericon, priority: true }));
                                className =
                                    loading && index === messages.length - 1
                                        ? Home_module_css_1["default"].usermessagewaiting
                                        : Home_module_css_1["default"].usermessage;
                            }
                            return (React.createElement(React.Fragment, null,
                                React.createElement("div", { key: "chatMessage-" + index, className: className },
                                    icon,
                                    React.createElement("div", { className: Home_module_css_1["default"].markdownanswer },
                                        React.createElement(react_markdown_1["default"], { linkTarget: "_blank" }, message.message))),
                                message.sourceDocs && (React.createElement("div", { className: "p-5", key: "sourceDocsAccordion-" + index },
                                    React.createElement(accordion_1.Accordion, { type: "single", collapsible: true, className: "flex-col" }, message.sourceDocs.map(function (doc, index) { return (React.createElement("div", { key: "messageSourceDocs-" + index },
                                        React.createElement(accordion_1.AccordionItem, { value: "item-" + index },
                                            React.createElement(accordion_1.AccordionTrigger, null,
                                                React.createElement("h3", null,
                                                    "Source ",
                                                    index + 1)),
                                            React.createElement(accordion_1.AccordionContent, null,
                                                React.createElement(react_markdown_1["default"], { linkTarget: "_blank" }, doc.pageContent),
                                                React.createElement("p", { className: "mt-2" },
                                                    React.createElement("b", null, "Source:"),
                                                    " ",
                                                    doc.metadata.source))))); }))))));
                        }))),
                    React.createElement("div", { className: Home_module_css_1["default"].center },
                        React.createElement("div", { className: Home_module_css_1["default"].cloudform },
                            React.createElement("form", { onSubmit: handleSubmit },
                                React.createElement("textarea", { disabled: loading, onKeyDown: handleEnter, ref: textAreaRef, autoFocus: false, rows: 1, maxLength: 512, id: "userInput", name: "userInput", placeholder: loading
                                        ? 'Waiting for response...'
                                        : 'Please ask your question?', value: query, onChange: function (e) { return setQuery(e.target.value); }, className: Home_module_css_1["default"].textarea }),
                                React.createElement("button", { type: "submit", disabled: loading, className: Home_module_css_1["default"].generatebutton }, loading ? (React.createElement("div", { className: Home_module_css_1["default"].loadingwheel },
                                    React.createElement(LoadingDots_1["default"], { color: "#000" }))) : (React.createElement("svg", { viewBox: "0 0 20 20", className: Home_module_css_1["default"].svgicon, xmlns: "http://www.w3.org/2000/svg" },
                                    React.createElement("path", { d: "M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" })))),
                                React.createElement("div", __assign({ style: { height: '5px', width: '180px', marginLeft: '500px' } }, getRootProps({
                                    className: 'dropzone bg-gray-900 border border-gray-800 p-10 rounded-md hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer'
                                })),
                                    React.createElement("input", __assign({}, getInputProps())),
                                    React.createElement("p", { style: { color: 'white', marginTop: '-10px' } }, "Upload PDF"))),
                            React.createElement(VoiceButton, { onSpeechRecognition: handleSpeechRecognition }))),
                    error && (React.createElement("div", { className: "border border-red-400 rounded-md p-4" },
                        React.createElement("p", { className: "text-red-500" }, error))))))));
}
exports["default"] = Home;
// import { useRef, useState, useEffect } from 'react';
// import Layout from '@/components/layout';
// import styles from '@/styles/Home.module.css';
// import { Message } from '@/types/chat';
// import Image from 'next/image';
// import ReactMarkdown from 'react-markdown';
// import LoadingDots from '@/components/ui/LoadingDots';
// import { Document } from 'langchain/document';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import { useCallback } from "react";
// import { useDropzone } from "react-dropzone";
// import { useCompletion } from "ai/react";
// import { cache } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
// declare global {
//   interface Window {
//     webkitSpeechRecognition: any;
//   }
// }
// export default function Home() {
//   const onDrop = useCallback(async (acceptedFiles: File[]) => {
//     const file = acceptedFiles[0];
//     if (file.type !== "application/pdf") {
//       alert("Please upload a PDF");
//       return;
//     }
//     const formData = new FormData();
//     formData.set("file", file);
//     const response = await fetch("/api/addData", {
//       method: "POST",
//       body: formData,
//     });
//     const body = await response.json();
//     if (body.success) {
//       alert("Data added successfully");
//     }
//   }, []);
//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//   });
//   const [query, setQuery] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [messageState, setMessageState] = useState<{
//     messages: Message[];
//     pending?: string;
//     history: [string, string][];
//     pendingSourceDocs?: Document[];
//   }>({
//     messages: [
//       {
//         message: 'Hi, what would you like to learn about this document?',
//         type: 'apiMessage',
//       },
//     ],
//     history: [],
//   });
//   const { messages, history } = messageState;
//   const messageListRef = useRef<HTMLDivElement>(null);
//   const textAreaRef = useRef<HTMLTextAreaElement>(null);
//   useEffect(() => {
//     textAreaRef.current?.focus();
//   }, []);
//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setError(null);
//     if (!query) {
//       alert('Please input a question');
//       return;
//     }
//     const question = query.trim();
//     setMessageState((state) => ({
//       ...state,
//       messages: [
//         ...state.messages,
//         {
//           type: 'userMessage',
//           message: question,
//         },
//       ],
//     }));
//     setLoading(true);
//     setQuery('');
//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           question,
//           history,
//         }),
//       });
//       const data = await response.json();
//       if (data.error) {
//         setError(data.error);
//       } else {
//         setMessageState((state) => ({
//           ...state,
//           messages: [
//             ...state.messages,
//             {
//               type: 'apiMessage',
//               message: data.text,
//               sourceDocs: data.sourceDocuments,
//             },
//           ],
//           history: [...state.history, [question, data.text]],
//         }));
//       }
//       setLoading(false);
//       messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
//     } catch (error) {
//       setLoading(false);
//       setError('An error occurred while fetching the data. Please try again.');
//     }
//   };
//   type VoiceButtonProps = {
//     onSpeechRecognition: (transcript: string) => void;
//     onImmediateResponse: (transcript: string) => void; // Add this prop t
//   };
//   const VoiceButton:React.FC<VoiceButtonProps> = ({ onSpeechRecognition, onImmediateResponse  }) => {
//     const [isListening, setIsListening] = useState(false);
//     const recognition = typeof window !== 'undefined' ? new window.webkitSpeechRecognition() : null;
//     useEffect(() => {
//       recognition.onresult = (event: any) => {
//         const transcript = event.results[0][0].transcript;
//         // Immediately add the user's question to the conversation
//         onSpeechRecognition(transcript);
//         // Trigger response immediately
//         onImmediateResponse(transcript);
//         triggerResponse(transcript);
//       };
//       recognition.onend = () => {
//         setIsListening(false);
//       };
//     }, [onSpeechRecognition, onImmediateResponse]);
//     const toggleListening = () => {
//       if (isListening) {
//         recognition.stop();
//       } else {
//         recognition.start();
//         setIsListening(true);
//       }
//     };
//     // Function to trigger the chatbot response
//     const triggerResponse = async (transcript: string) => {
//       // Simulate the form submission
//       await handleSubmit({ preventDefault: () => {} });
//       // Speak the response
//       speakResponse();
//     };
//     return (
//       <button onClick={toggleListening}>
//         {isListening ? 'Stop Listening' : 'Start Listening'}
//       </button>
//     );
//     // const [isListening, setIsListening] = useState(false);
//     // const recognition = typeof window !== 'undefined' ? new window.webkitSpeechRecognition(): null;
//     // useEffect(() => {
//     //   recognition.onresult = (event: any) => {
//     //     const transcript = event.results[0][0].transcript;
//     //     onSpeechRecognition(transcript);
//     //   };
//     //   recognition.onend = () => {
//     //     setIsListening(false);
//     //   };
//     // }, [onSpeechRecognition]);
//     // const toggleListening = () => {
//     //   if (isListening) {
//     //     recognition.stop();
//     //   } else {
//     //     recognition.start();
//     //     setIsListening(true);
//     //   }
//     // };
//     // return (
//     //   <button onClick={toggleListening}>
//     //     {isListening ? 'Stop Listening' : 'Start Listening'}
//     //   </button>
//     // );
//   };
//   const handleSpeechRecognition = async (transcript: string) => {
//     // setQuery(transcript);
//     // await handleSubmit({ preventDefault: () => {} });
//     // speakResponse();
//     setQuery(transcript);
//   // Immediately add the user's question to the conversation
//   setMessageState((state) => ({
//     ...state,
//     messages: [
//       ...state.messages,
//       {
//         type: 'userMessage',
//         message: transcript,
//       },
//     ],
//   }));
//   // Trigger response immediately
//   speakResponse();
//   };
//   const speakResponse = () => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(messages[messages.length - 1].message);
//     synth.speak(utterance);
//   };
//   const handleEnter = (e: any) => {
//     if (e.key === 'Enter' && query) {
//       handleSubmit(e);
//     } else if (e.key === 'Enter') {
//       e.preventDefault();
//     }
//   };
//   return (
//     <>
//       <Layout>
//         <div className="mx-auto flex flex-col gap-4">
//           <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
//             Chat With Your Docs
//           </h1>
//           <main className={styles.main}>
//             <div className={styles.cloud}>
//               <div ref={messageListRef} className={styles.messagelist}>
//                 {messages.map((message, index) => {
//                   let icon;
//                   let className;
//                   if (message.type === 'apiMessage') {
//                     icon = (
//                       <Image
//                         key={index}
//                         src="/bot-image.png"
//                         alt="AI"
//                         width="40"
//                         height="40"
//                         className={styles.boticon}
//                         priority
//                       />
//                     );
//                     className = styles.apimessage;
//                   } else {
//                     icon = (
//                       <Image
//                         key={index}
//                         src="/usericon.png"
//                         alt="Me"
//                         width="30"
//                         height="30"
//                         className={styles.usericon}
//                         priority
//                       />
//                     );
//                     className =
//                       loading && index === messages.length - 1
//                         ? styles.usermessagewaiting
//                         : styles.usermessage;
//                   }
//                   return (
//                     <>
//                       <div key={`chatMessage-${index}`} className={className}>
//                         {icon}
//                         <div className={styles.markdownanswer}>
//                           <ReactMarkdown linkTarget="_blank">
//                             {message.message}
//                           </ReactMarkdown>
//                         </div>
//                       </div>
//                       {message.sourceDocs && (
//                         <div
//                           className="p-5"
//                           key={`sourceDocsAccordion-${index}`}
//                         >
//                           <Accordion
//                             type="single"
//                             collapsible
//                             className="flex-col"
//                           >
//                             {message.sourceDocs.map((doc, index) => (
//                               <div key={`messageSourceDocs-${index}`}>
//                                 <AccordionItem value={`item-${index}`}>
//                                   <AccordionTrigger>
//                                     <h3>Source {index + 1}</h3>
//                                   </AccordionTrigger>
//                                   <AccordionContent>
//                                     <ReactMarkdown linkTarget="_blank">
//                                       {doc.pageContent}
//                                     </ReactMarkdown>                                   
//                                     <p className="mt-2">
//                                       <b>Source:</b> {doc.metadata.source}
//                                     </p>
//                                   </AccordionContent>
//                                 </AccordionItem>
//                               </div>
//                             ))}
//                           </Accordion>
//                         </div>
//                       )}
//                     </>
//                   );
//                 })}
//               </div>
//             </div>
//             <div className={styles.center}>
//               <div className={styles.cloudform}>
//                 <form onSubmit={handleSubmit}>
//                   <textarea
//                     disabled={loading}
//                     onKeyDown={handleEnter}
//                     ref={textAreaRef}
//                     autoFocus={false}
//                     rows={1}
//                     maxLength={512}
//                     id="userInput"
//                     name="userInput"
//                     placeholder={
//                       loading
//                         ? 'Waiting for response...'
//                         : 'What is this legal case about?'
//                     }
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     className={styles.textarea}
//                   />
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={styles.generatebutton}
//                   >
//                     {loading ? (
//                       <div className={styles.loadingwheel}>
//                         <LoadingDots color="#000" />
//                       </div>
//                     ) : (
//                       <svg
//                         viewBox="0 0 20 20"
//                         className={styles.svgicon}
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
//                       </svg>
//                     )}
//                   </button>
//                   <div
//                     style={{ height: '5px', width: '180px', marginLeft: '500px' }}
//                     {...getRootProps({
//                       className:
//                         'dropzone bg-gray-900 border border-gray-800 p-10 rounded-md hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer',
//                     })}
//                   >
//                     <input {...getInputProps()} />
//                     <p style={{ color: 'white', marginTop: '-10px' }}>
//                       Upload PDF
//                     </p>
//                   </div>
//                   <button
//                     style={{
//                       backgroundColor: 'green',
//                       padding: '10px',
//                       borderRadius: '5px',
//                       border: 'none',
//                       cursor: 'pointer',
//                       marginLeft: '900px',
//                       marginTop: '-170px',
//                       width: '50px',
//                       height: '50px',
//                     }}
//                   >
//                     <FontAwesomeIcon
//                       icon={faMicrophone}
//                       style={{ color: 'white' }}
//                     />
//                   </button>
//                 </form>
//                 <VoiceButton onSpeechRecognition={handleSpeechRecognition} onImmediateResponse={handleSubmit} />
//               </div>
//             </div>
//             {error && (
//               <div className="border border-red-400 rounded-md p-4">
//                 <p className="text-red-500">{error}</p>
//               </div>
//             )}
//           </main>
//         </div>
//       </Layout>
//     </>
//   );
// }
// import { useRef, useState, useEffect } from 'react';
// import Layout from '@/components/layout';
// import styles from '@/styles/Home.module.css';
// import { Message } from '@/types/chat';
// import Image from 'next/image';
// import ReactMarkdown from 'react-markdown';
// import LoadingDots from '@/components/ui/LoadingDots';
// import { Document } from 'langchain/document';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import { useCallback } from "react";
// import { useDropzone } from "react-dropzone";
// import { useCompletion } from "ai/react";
// import {cache} from "react"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
// export default function Home() {
//   const onDrop = useCallback(async (acceptedFiles: File[]) => {
//     const file = acceptedFiles[0];
//     if (file.type !== "application/pdf") {
//       alert("Please upload a PDF");
//       return;
//     }
//     const formData = new FormData();
//     formData.set("file", file);
//     const response = await fetch("/api/addData", {
//       method: "POST",
//       body: formData,
//     });
//     const body = await response.json();
//     if (body.success) {
//       alert("Data added successfully");
//     }
//   }, []);
//   // Configure react-dropzone
//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//   });
//   const [query, setQuery] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [messageState, setMessageState] = useState<{
//     messages: Message[];
//     pending?: string;
//     history: [string, string][];
//     pendingSourceDocs?: Document[];
//   }>({
//     messages: [
//       {
//         message: 'Hi, what would you like to learn about this document?',
//         type: 'apiMessage',
//       },
//     ],
//     history: [],
//   });
//   const { messages, history } = messageState;
//   const messageListRef = useRef<HTMLDivElement>(null);
//   const textAreaRef = useRef<HTMLTextAreaElement>(null);
//   useEffect(() => {
//     textAreaRef.current?.focus();
//   }, []);
//   //handle form submission
//   async function handleSubmit(e: any) {
//     e.preventDefault();
//     setError(null);
//     if (!query) {
//       alert('Please input a question');
//       return;
//     }
//     const question = query.trim();
//     setMessageState((state) => ({
//       ...state,
//       messages: [
//         ...state.messages,
//         {
//           type: 'userMessage',
//           message: question,
//         },
//       ],
//     }));
//     setLoading(true);
//     setQuery('');
//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           question,
//           history,
//         }),
//       });
//       const data = await response.json();
//       console.log('data', data);
//       if (data.error) {
//         setError(data.error);
//       } else {
//         setMessageState((state) => ({
//           ...state,
//           messages: [
//             ...state.messages,
//             {
//               type: 'apiMessage',
//               message: data.text,
//               sourceDocs: data.sourceDocuments,
//             },
//           ],
//           history: [...state.history, [question, data.text]],
//         }));
//       }
//       console.log('messageState', messageState);
//       setLoading(false);
//       //scroll to bottom
//       messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
//     } catch (error) {
//       setLoading(false);
//       setError('An error occurred while fetching the data. Please try again.');
//       console.log('error', error);
//     }
//   }
//   //prevent empty submissions
//   const handleEnter = (e: any) => {
//     if (e.key === 'Enter' && query) {
//       handleSubmit(e);
//     } else if (e.key == 'Enter') {
//       e.preventDefault();
//     }
//   };
//   return (
//     <>
//       <Layout>
//         <div className="mx-auto flex flex-col gap-4">
//           <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
//             Chat With Your Docs
//           </h1>
//           <main className={styles.main}>
//             <div className={styles.cloud}>
//               <div ref={messageListRef} className={styles.messagelist}>
//                 {messages.map((message, index) => {
//                   let icon;
//                   let className;
//                   if (message.type === 'apiMessage') {
//                     icon = (
//                       <Image
//                         key={index}
//                         src="/bot-image.png"
//                         alt="AI"
//                         width="40"
//                         height="40"
//                         className={styles.boticon}
//                         priority
//                       />
//                     );
//                     className = styles.apimessage;
//                   } else {
//                     icon = (
//                       <Image
//                         key={index}
//                         src="/usericon.png"
//                         alt="Me"
//                         width="30"
//                         height="30"
//                         className={styles.usericon}
//                         priority
//                       />
//                     );
//                     // The latest message sent by the user will be animated while waiting for a response
//                     className =
//                       loading && index === messages.length - 1
//                         ? styles.usermessagewaiting
//                         : styles.usermessage;
//                   }
//                   return (
//                     <>
//                       <div key={`chatMessage-${index}`} className={className}>
//                         {icon}
//                         <div className={styles.markdownanswer}>
//                           <ReactMarkdown linkTarget="_blank">
//                             {message.message}
//                           </ReactMarkdown>
//                         </div>
//                       </div>
//                       {message.sourceDocs && (
//                         <div
//                           className="p-5"
//                           key={`sourceDocsAccordion-${index}`}
//                         >
//                           <Accordion
//                             type="single"
//                             collapsible
//                             className="flex-col"
//                           >
//                             {message.sourceDocs.map((doc, index) => (
//                               <div key={`messageSourceDocs-${index}`}>
//                                 <AccordionItem value={`item-${index}`}>
//                                   <AccordionTrigger>
//                                     <h3>Source {index + 1}</h3>
//                                   </AccordionTrigger>
//                                   <AccordionContent>
//                                     <ReactMarkdown linkTarget="_blank">
//                                       {doc.pageContent}
//                                     </ReactMarkdown>
//                                     <p className="mt-2">
//                                       <b>Source:</b> {doc.metadata.source}
//                                     </p>
//                                   </AccordionContent>
//                                 </AccordionItem>
//                               </div>
//                             ))}
//                           </Accordion>
//                         </div>
//                       )}
//                     </>
//                   );
//                 })}
//               </div>
//             </div>
//             <div className={styles.center}>
//               <div className={styles.cloudform}>
//                 <form onSubmit={handleSubmit}>
//                   <textarea
//                     disabled={loading}
//                     onKeyDown={handleEnter}
//                     ref={textAreaRef}
//                     autoFocus={false}
//                     rows={1}
//                     maxLength={512}
//                     id="userInput"
//                     name="userInput"
//                     placeholder={
//                       loading
//                         ? 'Waiting for response...'
//                         : 'What is this legal case about?'
//                     }
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     className={styles.textarea}
//                   />
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={styles.generatebutton}
//                   >
//                     {loading ? (
//                       <div className={styles.loadingwheel}>
//                         <LoadingDots color="#000" />
//                       </div>
//                     ) : (
//                       // Send icon SVG in input field
//                       <svg
//                         viewBox="0 0 20 20"
//                         className={styles.svgicon}
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
//                       </svg>
//                     )}
//                   </button>
//                   <div style={{height:'5px',width:'180px', marginLeft:'500px'}}//This is where i stopped from last night.
//                     {...getRootProps({
//                       className:
//                         "dropzone bg-gray-900 border border-gray-800 p-10 rounded-md hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer",
//                     })}
//                   >
//                     <input {...getInputProps()} />
//                     <p style={{color: 'white', marginTop:'-10px'}}>Upload PDF</p>
//                   </div>
//                   <button
//                      style={{
//                      backgroundColor: 'green', // Set the button background color to green
//                      padding: '10px', // Adjust padding as needed
//                      borderRadius: '5px', // Add rounded corners if desired
//                      border: 'none', // Remove border if not needed
//                      cursor: 'pointer', // Change cursor on hover
//                      marginLeft:'900px',
//                      marginTop:'-170px',
//                      width:'50px',
//                      height:'50px'
//                     }}
//                    >
//                   <FontAwesomeIcon icon={faMicrophone} style={{ color: 'white' }} />
//                   </button>
//                 </form>
//               </div>
//             </div>
//             {error && (
//               <div className="border border-red-400 rounded-md p-4">
//                 <p className="text-red-500">{error}</p>
//               </div>
//             )}
//           </main>
//         </div>
//       </Layout>
//     </>
//   );
// }

import { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useCompletion } from "ai/react";
import { cache } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}


type VoiceButtonProps = {
  onSpeechRecognition: (transcript: string) => void;
};

const VoiceButton:React.FC<VoiceButtonProps> = ({ onSpeechRecognition }) => {
  const [isListening, setIsListening] = useState(false);
  const recognition = typeof window !== 'undefined' ? new window.webkitSpeechRecognition(): null;

  useEffect(() => {
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onSpeechRecognition(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [onSpeechRecognition]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <button onClick={toggleListening}
    style={{
      // backgroundColor: '#4CAF50', // Set your desired background color
      color: 'white', // Set your desired text color
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      // marginLeft: '900px',
      // marginTop: '-150px',
      position: 'absolute',
      top: '8px', // Adjust this value to move the button up or down
      left: '850px',
    }} className='dropzone bg-gray-900 border border-gray-800 p-10 rounded-md hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer'
    
    >
      {isListening ? 'Stop Listening' : 'Start Listening'}
    </button>
  );
};

export default function Home() {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);

    const response = await fetch("/api/addData", {
      method: "POST",
      body: formData,
    });

    const body = await response.json();

    if (body.success) {
      alert("Data added successfully");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Hi, what would you like to learn about this document?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }

      setLoading(false);

      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
    }
  };

   const speakResponse = (message: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
  };

 const handleSpeechRecognition = async (transcript: string) => {
    // Trim the transcript and set it as the user's question
    const question = transcript.trim();

  // Update the state to include the user's question
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

  // Set the query and proceed with handling the question
    setQuery(question);

  // Call the API to get a response
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
      // Update the state with the API response
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
        speakResponse(data.text);
      }
    } catch (error) {
      setError('An error occurred while fetching the data. Please try again.');
    }

    setLoading(false);

  // Scroll to the bottom of the message list
    messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);

  // Speak the response
  
  //   const question = transcript.trim();

  // // Update the state to include the user's question
  //   setMessageState((state) => ({
  //     ...state,
  //     messages: [
  //       ...state.messages,
  //       {
  //         type: 'userMessage',
  //         message: question,
  //       },
  //     ],
  //   }));

  // // Set the query and proceed with handling the question
  //   setQuery(question);
  //   await handleSubmit({ preventDefault: () => {} });
  //   speakResponse();
  //   // setQuery(transcript);
  //   // await handleSubmit({ preventDefault: () => {} });
  //   // speakResponse();
   };

 

  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <>
      <Layout>
        <div className="mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
            
          </h1>
          <main className={styles.main}>
            <div className={styles.cloud}>
              <div ref={messageListRef} className={styles.messagelist}>
                {messages.map((message, index) => {
                  let icon;
                  let className;
                  if (message.type === 'apiMessage') {
                    icon = (
                      <Image
                        key={index}
                        src="/bot-image.png"
                        alt="AI"
                        width="40"
                        height="40"
                        className={styles.boticon}
                        priority
                      />
                    );
                    className = styles.apimessage;
                  } else {
                    icon = (
                      <Image
                        key={index}
                        src="/usericon.png"
                        alt="Me"
                        width="30"
                        height="30"
                        className={styles.usericon}
                        priority
                      />
                    );
                    className =
                      loading && index === messages.length - 1
                        ? styles.usermessagewaiting
                        : styles.usermessage;
                  }
                  return (
                    <>
                      <div key={`chatMessage-${index}`} className={className}>
                        {icon}
                        <div className={styles.markdownanswer}>
                          <ReactMarkdown linkTarget="_blank">
                            {message.message}
                          </ReactMarkdown>
                        </div>
                      </div>
                      {message.sourceDocs && (
                        <div
                          className="p-5"
                          key={`sourceDocsAccordion-${index}`}
                        >
                          <Accordion
                            type="single"
                            collapsible
                            className="flex-col"
                          >
                            {message.sourceDocs.map((doc, index) => (
                              <div key={`messageSourceDocs-${index}`}>
                                <AccordionItem value={`item-${index}`}>
                                  <AccordionTrigger>
                                    <h3>Source {index + 1}</h3>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ReactMarkdown linkTarget="_blank">
                                      {doc.pageContent}
                                    </ReactMarkdown>                                   
                                    <p className="mt-2">
                                      <b>Source:</b> {doc.metadata.source}
                                    </p>
                                  </AccordionContent>
                                </AccordionItem>
                              </div>
                            ))}
                          </Accordion>
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
            <div className={styles.center}>
              <div className={styles.cloudform}>
                <form onSubmit={handleSubmit}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    ref={textAreaRef}
                    autoFocus={false}
                    rows={1}
                    maxLength={512}
                    id="userInput"
                    name="userInput"
                    placeholder={
                      loading
                        ? 'Waiting for response...'
                        : 'Please ask your question?'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.textarea}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.generatebutton}
                  >
                    {loading ? (
                      <div className={styles.loadingwheel}>
                        <LoadingDots color="#000" />
                      </div>
                    ) : (
                      <svg
                        viewBox="0 0 20 20"
                        className={styles.svgicon}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    )}
                  </button>
                  <div
                    style={{ height: '5px', width: '180px', marginLeft: '500px' }}
                    {...getRootProps({
                      className:
                        'dropzone bg-gray-900 border border-gray-800 p-10 rounded-md hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer',
                    })}
                  >
                    <input {...getInputProps()} />
                    <p style={{ color: 'white', marginTop: '-10px' }}>
                      Upload PDF
                    </p>
                  </div>
                  {/* <button
                    style={{
                      backgroundColor: 'green',
                      padding: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                      marginLeft: '900px',
                      marginTop: '-170px',
                      width: '50px',
                      height: '50px',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faMicrophone}
                      style={{ color: 'white' }}
                    />
                  </button> */}
                </form>
                <VoiceButton onSpeechRecognition={handleSpeechRecognition} />
              </div>
            </div>
            {error && (
              <div className="border border-red-400 rounded-md p-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </main>
        </div>
      </Layout>
    </>
  );
}










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

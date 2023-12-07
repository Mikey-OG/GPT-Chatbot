// import panel 
// import param
// import speech_recognition as sr
// import * as sr from 'SP';
// from gtts import gTTS
// import os
// import pyttsx3

    
// const engine = pyttsx3.init()

// // Initialize speech recognizer
// const voice_input = sr.Recognizer()

// // # Initialize text-to-speech engine for voice responses
// voice_output = pyttsx3.init()


// class cbfs {
//     chat_history: any[] = [];
//     answer: string = "";
//     db_query: string = "";
//     db_response: any[] = [];
//     text_chat_history: any[] = [];
//     voice_chat_history: any[] = [];
//     microphone_active: boolean = false;

//     constructor() {
//         this.panels = [];
//         this.loaded_file = "C:\\Users\\ebowu\\Downloads\\fontys_doc.pdf";
//         this.qa = load_db(this.loaded_file, "stuff", 4);
//         this.microphone_active = false;
//     }

//     call_load_db(count: number) {
//         if (count == 0 || file_input.value === null) {
//             return pn.pane.Markdown(`Loaded File: ${this.loaded_file}`);
//         } else {
//             file_input.save("temp.pdf");
//             this.loaded_file = file_input.filename;
//             button_load.button_style = "outline";
//             this.qa = load_db("temp.pdf", "stuff", 4);
//             button_load.button_style = "solid";
//         }
//         this.clr_history();
//         return pn.pane.Markdown(`Loaded File: ${this.loaded_file}`);
//     }

//     get_voice_input() {
//         const recognizer = sr.Recognizer();
//         with sr.Microphone() as source {
//             console.log("Say something...");
//             const audio = recognizer.listen(source);
//         }
//         try {
//             const query = recognizer.recognize_google(audio);
//             return query;
//         } catch (sr.UnknownValueError) {
//             return "Sorry, I didn't catch that.";
//         }
//     }

//     speak_text(response: string) {
//         engine.say(response);
//         engine.runAndWait();
//     }

//     voice_interaction(query: string = "") {
//         if (!this.microphone_active) {
//             this.speak_text("Please ask your question.");
//             this.microphone_active = true;
//             return pn.WidgetBox(pn.Row('User:', pn.pane.Markdown("", width=600)), scroll=true);
//         }
//         if (!query) {
//             this.speak_text("I'm already listening. Please wait for a response.");
//             return pn.WidgetBox(pn.Row('User:', pn.pane.Markdown("", width=600)), scroll=true);
//         }
//         query = this.get_voice_input();
//         const result = this.qa({ "question": query, "chat_history": this.chat_history });
//         this.chat_history.extend([(query, result["answer"])]);
//         this.db_query = result["generated_question"];
//         this.db_response = result["source_documents"];
//         this.answer = result['answer'];
//         this.panels.extend([
//             pn.Row('User:', pn.pane.Markdown(query, width=600)),
//             pn.Row('ChatBot:', pn.pane.Markdown(this.answer, width=600, styles={ 'background-color': '' }))
//         ]);
//         this.speak_text(this.answer);
//         inp.value = '';
//         this.microphone_active = false;
//         return pn.WidgetBox(...this.panels, scroll=true);
//     }
// }



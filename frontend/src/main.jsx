import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { BrowserRouter as Router } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatProvider";

import {disableReactDevTools} from '@fvilers/disable-react-devtools'

if(process.env.NODE_ENV==="production") disableReactDevTools()

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </Router>
);

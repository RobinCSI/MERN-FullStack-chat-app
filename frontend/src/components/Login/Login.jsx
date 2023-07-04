import React, { useState } from "react";

import styles from "./Login.module.css";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  async function handleFormSubmit() {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Details missing",
        description: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login successful",
        description: "You are being redirected to the chat page",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chatPage");
    } catch (error) {
      toast({
        title: "Login unsuccessful",
        description: "Entered details are incorrect",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  }

  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Email:</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password:</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement w="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        w="100%"
        mt="15"
        onClick={handleFormSubmit}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        w="100%"
        mt="15"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
          // setTimeout(()=>{handleFormSubmit()}, 2000);
        }}
      >
        Login as Guest User
      </Button>
    </VStack>
  );
};

export default Login;
